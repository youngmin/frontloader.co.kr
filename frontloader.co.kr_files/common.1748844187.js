var selRange, product_brand_list; 
if (typeof(COMMON_JS) == 'undefined') {
    jQuery.migrateTrace = false;
    jQuery.migrateMute = true;
    $.fn.outerHTML = function() {
        return $(this).clone().wrapAll("<div/>").parent().html();
    }

    $.toast = function(opts) {
        var show = function() {
            if($('.toast-container').length) $('.toast-container').remove();
            var $toast = $('\
                <div class="toast-container">\
                    <div class="toast-box">' + opts.title + '</div>\
                </div>\
            ');

            var set_height = $toast.height();
            // 애니메이션 방법1
            // $toast.css({
            //     'top' : opts.top, 
            //     'left' : opts.left, 
            //     'z-index': opts.zIndex,
            //     'box-shadow' : '1px 1px 4px ' + colorset + 'aa',
            //     'color' : colorset,
            //     'font-size' : '14px',
            //     'border' : '1px solid ' + colorset,
            //     'height' : '0px',
            // }).animate({'height' : set_height}, opts.animation_duration);

            // 애니메이션 방법2
            // $toast.css({
            //     'display':'none', 
            //     'top' : opts.top, 
            //     'left' : opts.left, 
            //     'z-index': opts.zIndex,
            //     'box-shadow' : '1px 1px 4px ' + colorset + 'aa',
            //     'color' : colorset,
            //     'font-size' : '14px',
            //     'border' : '1px solid ' + colorset,
            // }).fadeIn(opts.animation_duration);

            // 애니메이션 방법3

            $toast.find('.toast-box').css({
                'top': opts.top,
                'left': opts.left,
                'z-index': opts.zIndex,
                'transform': 'translateX(-50%) scale(0)',
                'transition': 'transform ' + (opts.animation_duration / 1000) + 's',
                'opacity': '.3',
                'position': 'fixed',
                'word-break' : 'auto-phrase',
            });
            $toast.find('.toast-box').addClass(opts.type);

            $('body').append($toast);

            setTimeout(function() {
                $toast.find('.toast-box').css({ 'transform': 'translateX(-50%) scale(1)' });
                $toast.find('.toast-box').animate({ 'opacity': '1' }, opts.animation_duration);
            });

            setTimeout(function() {
                // $toast.find('.toast-box').css({'transform' : 'scale(0)'});
                $toast.find('.toast-box').fadeOut();
            }, opts.display_duration + opts.animation_duration);

            setTimeout(function() {
                $toast.remove();
            }, opts.display_duration + opts.animation_duration * 2);
        }

        opts = $.extend(true, {}, $.toast.defaults, opts);
        show();
    }

    $.toast.defaults = {
        'title': 'Type the title.',
        'type': 'info', // info - blue, danger - red, 
        'display_duration': 3000,
        'animation_duration': 300,
        'top': '150px',
        'left': '50%',
        'zIndex': '9999',
    };

    if (typeof rt_path == 'undefined')
        alert('rt_path 변수가 선언되지 않았습니다.');

    var COMMON_JS = true;

    var setLogs = function(type, action, icon, obj, page, select_el) {
        if(typeof page == 'undefined') page = PAGE;
        if(typeof select_el == 'undefined') select_el = editEL;
        $.ajax({
            url:'/template/log',
            type:'post',
            async: true,
            dataType:'json',
            data: { sid: SID, page: page, type: type, el: select_el, action: action, icon: icon, obj: obj },
            success:function(data) {
                if (typeof data.error != 'undefined' && data.error) {
                    return false;
                }
                addlogs(data);
            }
        });
    }
    
    var addlogs = function(data) {
        $('.history-dropdown li a').removeClass('active');
        var $li = $('<li>'),
            $log = $('<a>'),
            str = $.lang[LANG]['log.' + data.action],
            obj = (typeof $.lang[LANG]['log.' + data.obj] == 'undefined') ? data.obj + ' ' : $.lang[LANG]['log.' + data.obj] + ' ',
            obj = (data.type == 'MENU' || data.type == 'FOOT' || data.type == 'BOOKMARK') ? obj : '',
            logEL = (data.el) ? data.el : '';
        logEL = logEL.replace('el_', '');
        block = (data.obj == 'ELEM') ? '#' + logEL + ' ' : ' ';
    
        if (obj === '' && typeof str != 'undefined' && str.length > 0) str = str.replace(/^: /, '');
    
        if ($('.history-dropdown').children().length > 14) {
            $('.history-dropdown li').last().remove();
        }
        $log.attr('href', '#')
            .attr('data-seq', data.seq)
            .attr('data-toggle', 'tooltip')
            .attr('data-placement', 'left')
            .attr('title', data.date)
            .addClass('user-logs')
            .addClass('active')
            .append('<i class="fa ' + data.icon + '"></i> ' + obj + str);
    
        $li.append($log);
        $('.history-dropdown').prepend($li);
    }

    function getServiceHost() {
        var s = window.location.hostname;
        if (s == 'www.creatorlink.net' || s == 'creatorlink.net' || s == 'www.showbible.com' || s == 'showbible.com' || s == 'www.addblock.net' || s == 'addblock.net' ||
            s == 'www.creatorlink-gabia.com' || s == 'creatorlink-gabia.com') {
            s = s.replace('www.', '');
            s = (window.location.port) ? s + ':' + window.location.port : s;
        } else {
            s = window.location.host;
        }
        return s;
    }

    function clLocalStorageClear() {
      var cl_key_arr = ['referer','sid','type','pid','view','page_mode','status','parent','reply_name','reply','id','content','secret','href','forum_email'];
      $.each(cl_key_arr, function(i, k) {
          if (typeof k != 'undefined' && k) window.localStorage.removeItem(k);
      });
    }

    function log_analytics(sid, googleAnalytics, googleAnalytics_check) {
        var scriptTag = '';
        if (googleAnalytics_check == 'old') {
            scriptTag = "\
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){\n\
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\n\
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\n\
            })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');\n\
            ";
            if (googleAnalytics) {
                scriptTag += "\
                ga('create', '" + googleAnalytics + "', 'auto');\n\
                ga('require', 'displayfeatures');\n\
                ga('require', 'linkid');\n\
                ga('send', 'pageview');\n\
                ";
            }

        } else {
            if (sid && googleAnalytics) {
                scriptTag = "\
                window.dataLayer = window.dataLayer || [];\n\
                function gtag(){dataLayer.push(arguments); }\n\
                gtag('js', new Date());\n\
                ";
                scriptTag += (googleAnalytics) ? "gtag('config', '" + googleAnalytics + "');\n" : "";
                $('body').prepend('<script async src="https://www.googletagmanager.com/gtag/js?id=' + googleAnalytics + '"></script>');
            }
        }

        if(scriptTag != '') {
            var addScriptTag = '';
            if(sid && googleAnalytics) {
                addScriptTag += "\n\
                    <script>\n\
                        window.dataLayer = window.dataLayer || [];\n\
                        if(typeof localStorage.getItem('googleAnalyticsUID"+sid+"') != 'undefined' && localStorage.getItem('googleAnalyticsUID"+sid+"')) {\n\
                            dataLayer.push({ 'user_id': localStorage.getItem('googleAnalyticsUID"+sid+"') });\n\
                        }\n\
                    </script>\n\
                ";
            }

            addScriptTag += '<script>' + scriptTag + '</script>'
            $('body').prepend(addScriptTag);
        }
        
    }

    function naverSeo(type) {
        var jsonscript = '';
        switch (type) {
            case 'faq':
                {
                    jsonscript +=
                    '\
                    {\
                      "@context": "http://schema.org",\
                      "@type": "FAQPage",\
                      "mainEntity": [\
                        {\
                          "@type": "Question",\
                          "name": "포트폴리오 사이트만 만들 수 있나요?",\
                          "acceptedAnswer": {\
                            "@type": "Answer",\
                            "text": "아닙니다. 쇼핑몰, 회사홈페이지, 개인블로그, 모바일청첩장 등 원하시는 사이트를 자유롭게 만드실 수 있습니다."\
                          }\
                        },\
                        {\
                          "@type": "Question",\
                          "name": "결제 기능(쇼핑몰)을 사용할 수 있나요",\
                          "acceptedAnswer": {\
                            "@type": "Answer",\
                            "text": "<ul>\
                                        <li>쇼핑 요금제를 적용하여 쇼핑몰을 만들 수 있습니다.</li>\
                                        <li> </li>\
                                        <li>PG가입을 통해 신용카드나 계좌이체 등의 결제시스템을 연동할 수 있으며, 상품관리나 주문배송관리 등의 쇼핑 관련 기능이 제공됩니다.</li>\
                                        <li>기존에 크리에이터링크에서 만든 홈페이지가 있는 경우에도 새로 쇼핑몰을 만들 필요 없이 쇼핑 요금제만 적용하면 쇼핑몰로 전환할 수 있습니다.</li>\
                                        <li><a href=\\"https://www.creatorlink.net/shoppingevent\\">쇼핑 요금제 자세히 보기</a></li>\
                                    </ul>"\
                          }\
                        },\
                        {\
                          "@type": "Question",\
                          "name": "코딩을 몰라도 홈페이지를 만들 수 있나요?",\
                          "acceptedAnswer": {\
                            "@type": "Answer",\
                            "text": "네. 코딩을 전혀 몰라도 쉽게 만들 수 있는 모듈형 제작방식을 제공하고 있습니다."\
                          }\
                        },\
                        {\
                          "@type": "Question",\
                          "name": "홈페이지는 몇 개까지 만들 수 있나요?",\
                          "acceptedAnswer": {\
                            "@type": "Answer",\
                            "text": "계정 당 10개의 홈페이지를 만들 수 있습니다."\
                          }\
                        },\
                        {\
                          "@type": "Question",\
                          "name": "네이버나 다음에 노출시킬 수 있나요?",\
                          "acceptedAnswer": {\
                            "@type": "Answer",\
                            "text": "네. 사이트를 만드신 후 각 포털에 검색등록을 하실 수 있습니다."\
                          }\
                        }\
                      ]\
                    }\
                ';
                    break;
                }
            case 'carousel':
                {
                    jsonscript +=
                    '\
                    {\
                      "@context":"http://schema.org",\
                      "@type":"ItemList",\
                      "itemListElement":[\
                        {\
                          "@type": "ListItem",\
                          "name": "Dajeong",\
                          "image": "https://storage.googleapis.com/cr-resource/image/b79b620cbfea30807340cf90ed5e5bbe/rousefleur/rousefleur-bestsite.jpg",\
                          "url": "https://rousefleur.creatorlink.net",\
                          "position": "1"\
                        },\
                        {\
                          "@type": "ListItem",\
                          "name": "궁리",\
                          "image": "https://storage.googleapis.com/cr-resource/image/91cd3ae4e7326ec246d8ce207325311e/guungri/guungri-bestsite.jpg",\
                          "url": "https://guungri.creatorlink.net",\
                          "position": "2"\
                        },\
                        {\
                          "@type": "ListItem",\
                          "name": "운타",\
                          "image": "https://storage.googleapis.com/cr-resource/image/0a1afa78e08359fea268dc23cf25feba/unta/unta-bestsite.jpg",\
                          "url": "https://unta.creatorlink.net",\
                          "position": "3"\
                        },\
                        {\
                          "@type": "ListItem",\
                          "name": "HC DESIGN",\
                          "image": "https://storage.googleapis.com/cr-resource/image/8a3065df6f50178993b1d7d5ab5bb345/metafranchise/metafranchise-bestsite.jpg",\
                          "url": "https://metafranchise.creatorlink.net",\
                          "position": "4"\
                        },\
                        {\
                          "@type": "ListItem",\
                          "name": "에이캠스튜디오",\
                          "image": "https://storage.googleapis.com/cr-resource/image/17fbe9f7a0ddd0efddf0f34aeca01744/acamstudio/acamstudio-bestsite.jpg",\
                          "url": "https://acamstudio.creatorlink.net",\
                          "position": "5"\
                        },\
                        {\
                          "@type": "ListItem",\
                          "name": "미카엘",\
                          "image": "https://storage.googleapis.com/cr-resource/image/5fa6beb099367406036b7744fdf0d518/lawyerljw/lawyerljw-bestsite.jpg",\
                          "url": "https://lawyerljw.creatorlink.net",\
                          "position": "6"\
                        },\
                        {\
                          "@type": "ListItem",\
                          "name": "포씨드",\
                          "image": "//storage.googleapis.com/cr-resource/image/774baa5c985fc6eb5824f15d60130756/forseed/forseed-bestsite.jpg",\
                          "url": "https://forseed.creatorlink.net",\
                          "position": "7"\
                        },\
                        {\
                          "@type": "ListItem",\
                          "name": "snoworks",\
                          "image": "https://storage.googleapis.com/cr-resource/image/8bb728caf2a19b5f6263478d7eaaee24/whaledesign/whaledesign-bestsite.jpg",\
                          "url": "https://whaledesign.creatorlink.net",\
                          "position": "8"\
                        },\
                        {\
                          "@type": "ListItem",\
                          "name": "NARKO",\
                          "image": "https://storage.googleapis.com/cr-resource/image/a206b43e3689c50cb9affa3a7f76df8a/narko/narko-bestsite.jpg",\
                          "url": "https://narko.creatorlink.net",\
                          "position": "9"\
                        } \
                      ]\
                    }\
                ';
                    break;
                }
            case 'review':
                {
                    jsonscript +=
                    '\
                    {\
                      "@context": "https://schema.org",\
                      "@type": "Product",\
                      "aggregateRating": {\
                        "@type": "AggregateRating",\
                        "ratingValue": "5",\
                        "reviewCount": "70"\
                      },\
                      "name" : "Responsive Homepage",\
                      "review": [\
                        {\
                          "@type": "Review",\
                          "author": "soh******",\
                          "name": "써본것 중 제일 쉽고 편했어요",\
                          "reviewBody": "간단하게 사이트를 만들 수 있어 좋아요 :) 직접 코딩을 해서 제작해 본 적도 있고, 카***** 같은 유사 플랫폼을 이용한 적도 있는데 제가 시도해 본 것 중엔 사용방식이나 설정 방법이 제일 쉽고 편했어요. 웹사이트 제작 필요하신 분들께 추천드려봅니다.",\
                          "reviewRating": {\
                            "@type": "Rating",\
                            "bestRating": "5",\
                            "ratingValue": "5"\
                          }\
                        },\
                        {\
                          "@type": "Review",\
                          "author": "지**",\
                          "name": "디자인도 퀄리티가 너무 높아서.... 놀랐습니다.",\
                          "reviewBody": "홈페이지 제작 어렵게 생각했는데 이렇게 멋진 홈페이지가 간단하게 뚝딱 제작된다니...너무 놀랍네요...홈페이지가 필요하시거나 포폴필요하신분은 크리에이터링크로 작업하시면 너무 좋을듯합니다. 디자인도 퀄리티가 너무 높아서.... 놀랐습니다.",\
                          "reviewRating": {\
                            "@type": "Rating",\
                            "bestRating": "5",\
                            "ratingValue": "5"\
                          }\
                        },\
                        {\
                          "@type": "Review",\
                          "author": "fa***",\
                          "name": "창업 사이트도 크리에이터 링크를 이용하고 있답니다.",\
                          "reviewBody": "크리에이터 링크 사이트를 이용해서 사이트를 만들어 사용한지 벌써 일년이 넘었네요! 너무나 편리하고 필수적인 기능들이 잘 들어가 있어서, 초보자들도 바로 만들 수 있게끔 되어있어요. 저도 처음엔 개인 포트폴리오 사이트를 만드려고 크리에이터 링크를 이용하다가 너무 좋아서 지금은 창업 사이트도 크리에이터 링크를 이용하고 있답니다.",\
                          "reviewRating": {\
                            "@type": "Rating",\
                            "bestRating": "5",\
                            "ratingValue": "5"\
                          }\
                        },\
                        {\
                          "@type": "Review",\
                          "author": "이**",\
                          "name": "\\"쉽고 빠르게 홈페이지 제작은..크리에이터 링크가 답입니다.",\
                          "reviewBody": "\\"우리나라에서 제공하는 무료 홈페이지 중에서 \\"\\"아, 이게 제일 나다운 홈페이지다.\\"\\" 하고 느꼈네요. 내가 원하는 대로 만들려면 어려운 코딩 공부를 해야 되죠ㅠㅠ 하지만 크리에이터 링크는 척척! 잘 만들어주니까 너무 좋아요! 여러분.. 쉽고 빠르게 홈페이지 제작은..크리에이터 링크가 답입니다.\\"",\
                          "reviewRating": {\
                            "@type": "Rating",\
                            "bestRating": "5",\
                            "ratingValue": "5"\
                          }\
                        },\
                        {\
                          "@type": "Review",\
                          "author": "윤**",\
                          "name": "윅*에서 크리에이터링크로 갈아탔네요~",\
                          "reviewBody": "원래는 포트폴리오 사이트를 외국사이트 윅*로 만들어보려고 계획했었는데 우연히 크리에이터링크 사이트 발견하고 거기 작업하던거 포기하고 바로 갈아탔네요~ 쉽게 블럭으로 추가되는 것도 편리하고 편집하는 것도 직관적이고 무엇보다도 한글 서체가 다양해서 만족입니다~ " ,\
                          "reviewRating" : {\
                            "@type": "Rating",\
                            "bestRating": "5",\
                            "ratingValue": "5"\
                          }\
                        }\
                      ]\
                    }\
                ';
                    break;
                }

            default:
                {
                    break;
                }
        }
        $('body').prepend('<script type="application/ld+json">' + jsonscript + '</script>');
    }

    function arrayUnique(array) {
        var a = array.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i] === a[j])
                    a.splice(j--, 1);
            }
        }
        return a;
    }

    function arrayRemove(arr, value) {
        return arr.filter(function(ele) {
            return ele != value;
        });
    }

    function win_open(url, name, option) {
        var popup = window.open(rt_path + '/' + url, name, option);
        popup.focus();
    }

    // 쪽지 창
    function win_memo(url) {
        if (!url)
            url = "member/memo/lists";
        win_open(url, "winMemo", "left=50,top=50,width=620,height=460,scrollbars=1");
    }

    // 자기소개 창
    function win_profile(mb_id) {
        win_open("member/profile/qry/" + mb_id, 'winProfile', 'left=50,top=50,width=400,height=500,scrollbars=1');
    }

    // 우편번호 창
    function win_zip(frm_name, frm_zip1, frm_zip2, frm_addr1, frm_addr2) {
        url = "useful/zip/qry/" + frm_name + "/" + frm_zip1 + "/" + frm_zip2 + "/" + frm_addr1 + "/" + frm_addr2;
        win_open(url, "winZip", "left=50,top=50,width=616,height=460,scrollbars=1");
    }

    // POST 전송, 결과값 리턴
    function post_s(href, parm, del) {
        /*if (!del || confirm(  $.lang[LANG]['page.board.cts.msg.delete'] )) {
            $.post(rt_path + '/' + href, parm, function (req) {
                document.write(req);
            });
        }*/
        var confirm = false;
        var modal = $(this).showModalFlat('', $.lang[LANG]['page.board.cts.msg.delete'], true, true, function() {
            confirm = true;
            if (!del || confirm) {
                $.post(rt_path + '/' + href, parm, function(req) {
                    document.write(req);
                });
            }
        }, 'cancel', 'ok', 'cl-cmmodal cl-s-btn w560 cl-p130 cl-t80 cl-modal cl-none-title cl-close-btn', '', '', function() {
            $(document).on('keydown', function(e) {
                if (e.keyCode == 27) modal.modal('hide');
            });
        });
    }

    // POST 이동
    function post_goto(url, parm, target) {
        var f = document.createElement('form');

        var objs, value;
        for (var key in parm) {
            value = parm[key];
            objs = document.createElement('input');
            objs.setAttribute('type', 'hidden');
            objs.setAttribute('name', key);
            objs.setAttribute('value', value);
            f.appendChild(objs);
        }

        if (target)
            f.setAttribute('target', target);

        f.setAttribute('method', 'post');
        f.setAttribute('action', rt_path + '/' + url);
        document.body.appendChild(f);
        f.submit();
    }

    // POST 창
    function post_win(name, url, parm, opt) {
        var temp_win = window.open('', name, opt);
        post_goto(url, parm, name);
    }

    // 일반 삭제 검사 확인
    function del(href) {
        if (confirm("한번 삭제한 자료는 복구할 방법이 없습니다.\n\n정말 삭제하시겠습니까?"))
            document.location.href = rt_path + '/' + href;
    }

    // 플래시에 변수 추가 fh
    function flash_movie(src, ids, width, height, wmode, fh) {
        var wh = "";
        if (parseInt(width) && parseInt(height))
            wh = " width='" + width + "' height='" + height + "' ";
        return "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0' " + wh + " id=" + ids + "><param name=wmode value=" + wmode + "><param name=movie value=" + src + "><param name=quality value=high><param name=flashvars value=" + fh + "><embed src=" + src + " quality=high wmode=" + wmode + " flashvars=" + fh + " type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/shockwave/download/index.cgi?p1_prod_version=shockwaveflash' " + wh + "></embed></object>";
    }

    // 동영상 파일
    function obj_movie(src, ids, width, height, autostart) {
        var wh = "";
        if (parseInt(width) && parseInt(height))
            wh = " width='" + width + "' height='" + height + "' ";
        if (!autostart) autostart = false;
        return "<embed src='" + src + "' " + wh + " autostart='" + autostart + "'></embed>";
    }

    // 아이프레임 높이 자동조절
    function reSize(obj) {
        try {
            var objBody = frames[obj].document.body;
            var objFrame = document.getElementById(obj);
            ifrmHeight = objBody.scrollHeight + (objBody.offsetHeight - objBody.clientHeight);
            objFrame.style.height = ifrmHeight;
        } catch (e) {}
    }

    function sEncode(val) {
        return encodeURIComponent(val).replace(/%/g, '.');
    }

    // script 에서 js 파일 로드
    function importScript(FILES) {
        var _importScript = function(filename) {
            if (filename) {
                document.write('<script type="text/javascript" src="' + rt_path + '/js/' + filename + '.js"></s' + 'cript>');
            }
        };

        for (var i = 0; i < FILES.length; i++) {
            _importScript(FILES[i]);
        }
    }

    // jQuery textarea
    function txresize(tx, type, size) {
        var tx = $('#' + tx);
        if (type == 1)
            tx.animate({ 'height': '-=' + size + 'px' }, 'fast');
        else if (type == 2)
            tx.animate({ 'height': size }, 'fast');
        else if (type == 3)
            tx.animate({ 'height': '+=' + size + 'px' }, 'fast');
    }

    // 팝업 닫기
    function popup_close(id, onday) {
        if (onday) {
            var today = new Date();
            today.setTime(today.getTime() + (60 * 60 * 1000 * 24));
            document.cookie = id + "=" + escape(true) + "; path=/; expires=" + today.toGMTString() + ";";
        }

        if (window.parent.name.indexOf(id) != -1)
            window.close();
        else
            document.getElementById(id).style.display = 'none';
    }

    function checkcode(e) {
        var code = (window.event) ? event.keyCode : e.which; //IE : FF - Chrome both
        if (code > 31 && code < 45) nAllow(e);
        if (code > 45 && code < 48) nAllow(e);
        if (code > 57 && code < 65) nAllow(e);
        if (code > 90 && code < 97) nAllow(e);
        if (code > 122 && code < 127) nAllow(e);
    }

    function nAllow(e) {
        alert('특수문자 - 만 사용할수있습니다');
        if (navigator.appName != "Netscape") {
            //for not returning keycode value
            event.returnValue = false; //IE ,  - Chrome both
        } else {
            e.preventDefault(); //FF ,  - Chrome both
        }
    }

    function copyToClipboard(text) {
        if (window.clipboardData && window.clipboardData.setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            return clipboardData.setData("Text", text);

        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy"); // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }

    function copyTextToClipboard(text) {
        var copyFrom = $('<textarea class="hide"/>');
        copyFrom.text(text);
        $('body').append(copyFrom);
        copyFrom.select();
        document.execCommand('copy');
        copyFrom.remove();
    }

    function trim(str) {
        str = str.replace(/^\s*/, '').replace(/\s*$/, '');
        return str; //변환한 스트링을 리턴.
    }

    jQuery.fn.center = function() {
        this.css("position", "absolute");
        this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
        this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
        return this;
    }

    function setCookie(cookieName, cookieValue, expireDate) {
        var today = new Date();
        today.setDate(today.getDate() + parseInt(expireDate));
        document.cookie = cookieName + "=" + escape(cookieValue) + "; path=/; expires=" + today.toGMTString() + ";";
    }

    function getCookie(cookieName) {
        var search = cookieName + "=";
        var cookie = document.cookie;

        // 현재 쿠키가 존재할 경우
        if (cookie.length > 0) {
            // 해당 쿠키명이 존재하는지 검색한 후 존재하면 위치를 리턴.
            startIndex = cookie.indexOf(cookieName);

            // 만약 존재한다면
            if (startIndex != -1) {
                // 값을 얻어내기 위해 시작 인덱스 조절
                startIndex += cookieName.length;

                // 값을 얻어내기 위해 종료 인덱스 추출
                endIndex = cookie.indexOf(";", startIndex);

                // 만약 종료 인덱스를 못찾게 되면 쿠키 전체길이로 설정
                if (endIndex == -1) endIndex = cookie.length;

                // 쿠키값을 추출하여 리턴
                return unescape(cookie.substring(startIndex + 1, endIndex));
            } else {
                // 쿠키 내에 해당 쿠키가 존재하지 않을 경우
                return false;
            }
        } else {
            // 쿠키 자체가 없을 경우
            return false;
        }
    }

    function deleteCookie(cookieName) {
        var expireDate = new Date();

        //어제 날짜를 쿠키 소멸 날짜로 설정한다.
        expireDate.setDate(expireDate.getDate() - 1);
        document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
    }

    function getRandom() {
        var result = Math.floor(Math.random() * 10) + 1;
        return result;
    }

    function strpos(haystack, needle, offset) {
        // From: http://phpjs.org/functions
        // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   improved by: Onno Marsman
        // +   bugfixed by: Daniel Esteban
        // +   improved by: Brett Zamir (http://brett-zamir.me)
        // *     example 1: strpos('Kevin van Zonneveld', 'e', 5);
        // *     returns 1: 14
        var i = (haystack + '').indexOf(needle, (offset || 0));
        return i === -1 ? false : i;
    }

    function htmlEntities(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function removeEmptyLines(html) {
        return html
            .split('\n')                    
            .map(line => line.trim())       
            .filter(line => line !== '')    
            .join('\n');                    
    }
    

    function htmlspecialchars_decode(string, quote_style) {
        var optTemp = 0,
            i = 0,
            noquotes = false;
        if (typeof quote_style === 'undefined') {
            quote_style = 2;
        }
        string = string.toString()
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;lt;/g, '<')
            .replace(/&amp;gt;/g, '>');

        var OPTS = {
            'ENT_NOQUOTES': 0,
            'ENT_HTML_QUOTE_SINGLE': 1,
            'ENT_HTML_QUOTE_DOUBLE': 2,
            'ENT_COMPAT': 2,
            'ENT_QUOTES': 3,
            'ENT_IGNORE': 4
        };
        if (quote_style === 0) {
            noquotes = true;
        }
        if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
            quote_style = [].concat(quote_style);
            for (i = 0; i < quote_style.length; i++) {
                // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
                if (OPTS[quote_style[i]] === 0) {
                    noquotes = true;
                } else if (OPTS[quote_style[i]]) {
                    optTemp = optTemp | OPTS[quote_style[i]];
                }
            }
            quote_style = optTemp;
        }
        if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
            string = string.replace(/&#0*39;/g, "'"); // PHP doesn't currently escape if more than one 0, but it should
            // string = string.replace(/&apos;|&#x0*27;/g, "'"); // This would also be useful here, but not a part of PHP
        }
        if (!noquotes) {
            string = string.replace(/&quot;/g, '"');
        }
        // Put this in last place to avoid escape being double-decoded
        string = string.replace(/&amp;/g, '&');

        return string;
    }

    function explode(delimiter, string, limit) {
        //  discuss at: http://phpjs.org/functions/explode/
        // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        //   example 1: explode(' ', 'Kevin van Zonneveld');
        //   returns 1: {0: 'Kevin', 1: 'van', 2: 'Zonneveld'}

        if (arguments.length < 2 || typeof delimiter === 'undefined' || typeof string === 'undefined') return null;
        if (delimiter === '' || delimiter === false || delimiter === null) return false;
        if (typeof delimiter === 'function' || typeof delimiter === 'object' || typeof string === 'function' || typeof string ===
            'object') {
            return {
                0: ''
            };
        }
        if (delimiter === true) delimiter = '1';

        // Here we go...
        delimiter += '';
        string += '';

        var s = string.split(delimiter);

        if (typeof limit === 'undefined') return s;

        // Support for limit
        if (limit === 0) limit = 1;

        // Positive limit
        if (limit > 0) {
            if (limit >= s.length) return s;
            return s.slice(0, limit - 1)
                .concat([s.slice(limit - 1)
                    .join(delimiter)
                ]);
        }

        // Negative limit
        if (-limit >= s.length) return [];

        s.splice(s.length + limit);
        return s;
    }

    function microtime(get_as_float) {
        var now = new Date()
            .getTime() / 1000;
        var s = parseInt(now, 10);

        return (get_as_float) ? now * 1000 : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
    }

    function log(r) {
        console.log(r);
    }

    function pathinfo(path, options) {
        //        note: which makes it fully compliant with PHP syntax.
        //  depends on: basename
        //   example 1: pathinfo('/www/htdocs/index.html', 1);
        //   returns 1: '/www/htdocs'
        //   example 2: pathinfo('/www/htdocs/index.html', 'PATHINFO_BASENAME');
        //   returns 2: 'index.html'
        //   example 3: pathinfo('/www/htdocs/index.html', 'PATHINFO_EXTENSION');
        //   returns 3: 'html'
        //   example 4: pathinfo('/www/htdocs/index.html', 'PATHINFO_FILENAME');
        //   returns 4: 'index'
        //   example 5: pathinfo('/www/htdocs/index.html', 2 | 4);
        //   returns 5: {basename: 'index.html', extension: 'html'}
        //   example 6: pathinfo('/www/htdocs/index.html', 'PATHINFO_ALL');
        //   returns 6: {dirname: '/www/htdocs', basename: 'index.html', extension: 'html', filename: 'index'}
        //   example 7: pathinfo('/www/htdocs/index.html');
        //   returns 7: {dirname: '/www/htdocs', basename: 'index.html', extension: 'html', filename: 'index'}
        var opt = '',
            optName = '',
            optTemp = 0,
            tmp_arr = {},
            cnt = 0,
            i = 0;
        var have_basename = false,
            have_extension = false,
            have_filename = false;

        // Input defaulting & sanitation
        if (!path) {
            return false;
        }
        if (!options) {
            options = 'PATHINFO_ALL';
        }

        // Initialize binary arguments. Both the string & integer (constant) input is
        // allowed
        var OPTS = {
            'PATHINFO_DIRNAME': 1,
            'PATHINFO_BASENAME': 2,
            'PATHINFO_EXTENSION': 4,
            'PATHINFO_FILENAME': 8,
            'PATHINFO_ALL': 0
        };

        // PATHINFO_ALL sums up all previously defined PATHINFOs (could just pre-calculate)
        for (optName in OPTS) {
            OPTS.PATHINFO_ALL = OPTS.PATHINFO_ALL | OPTS[optName];
        }
        if (typeof options !== 'number') { // Allow for a single string or an array of string flags
            options = [].concat(options);
            for (i = 0; i < options.length; i++) {
                // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
                if (OPTS[options[i]]) {
                    optTemp = optTemp | OPTS[options[i]];
                }
            }
            options = optTemp;
        }

        // Internal Functions
        var __getExt = function(path) {
            var str = path + '';
            var dotP = str.lastIndexOf('.') + 1;
            return !dotP ? false : dotP !== str.length ? str.substr(dotP) : '';
        };

        function basename(path, suffix) {
            //  discuss at: http://phpjs.org/functions/basename/
            // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // improved by: Ash Searle (http://hexmen.com/blog/)
            // improved by: Lincoln Ramsay
            // improved by: djmix
            // improved by: Dmitry Gorelenkov
            //   example 1: basename('/www/site/home.htm', '.htm');
            //   returns 1: 'home'
            //   example 2: basename('ecra.php?p=1');
            //   returns 2: 'ecra.php?p=1'
            //   example 3: basename('/some/path/');
            //   returns 3: 'path'
            //   example 4: basename('/some/path_ext.ext/','.ext');
            //   returns 4: 'path_ext'

            var b = path;
            var lastChar = b.charAt(b.length - 1);

            if (lastChar === '/' || lastChar === '\\') {
                b = b.slice(0, -1);
            }

            b = b.replace(/^.*[\/\\]/g, '');

            if (typeof suffix === 'string' && b.substr(b.length - suffix.length) == suffix) {
                b = b.substr(0, b.length - suffix.length);
            }
            return b;
        }

        // Gather path infos
        if (options & OPTS.PATHINFO_DIRNAME) {
            var dirName = path.replace(/\\/g, '/')
                .replace(/\/[^\/]*\/?$/, ''); // dirname
            tmp_arr.dirname = dirName === path ? '.' : dirName;
        }

        if (options & OPTS.PATHINFO_BASENAME) {
            if (false === have_basename) {
                have_basename = basename(path);
            }
            tmp_arr.basename = have_basename;
        }

        if (options & OPTS.PATHINFO_EXTENSION) {
            if (false === have_basename) {
                have_basename = basename(path);
            }
            if (false === have_extension) {
                have_extension = __getExt(have_basename);
            }
            if (false !== have_extension) {
                tmp_arr.extension = have_extension;
            }
        }

        if (options & OPTS.PATHINFO_FILENAME) {
            if (false === have_basename) {
                have_basename = basename(path);
            }
            if (false === have_extension) {
                have_extension = __getExt(have_basename);
            }
            if (false === have_filename) {
                have_filename = have_basename.slice(0, have_basename.length - (have_extension ? have_extension.length + 1 :
                    have_extension === false ? 0 : 1));
            }
            tmp_arr.filename = have_filename;
        }

        // If array contains only 1 element: return string
        cnt = 0;
        for (opt in tmp_arr) {
            cnt++;
        }
        if (cnt == 1) {
            return tmp_arr[opt];
        }

        // Return full-blown array
        return tmp_arr;
    }

    function isIE() {
        userAgent = window.navigator.userAgent;
        return userAgent.indexOf("MSIE ") > -1 || userAgent.indexOf("Trident/") > -1 || userAgent.indexOf("Edge/") > -1;
    }

    function isMobile() {
        return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? true : false;
    }

    $(document).on('click', '#goto-top-m', function(e) {
        e.preventDefault();
        $('body,html').animate({ scrollTop: 0 }, 400);
    });

    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 50) {
            $('.site-cts-banner, .cl-cts-banner, #ch-plugin').addClass('up');
            $('#goto-top-m, #goto-top-s').addClass('show');
        } else {
            $('.site-cts-banner, .cl-cts-banner, #ch-plugin').removeClass('up');
            $('#goto-top-m, #goto-top-s').removeClass('show');
        }
    });

    $(document).on('click', '.tpl-share-snsPost', function(e) {
        var sns = $(this).attr('data-sns'),
            sid = (typeof SID == 'undefined') ? property.SID : SID,
            host = (typeof HOST == 'undefined') ? property.HOST : HOST,
            view = (typeof VIEW == 'undefined') ? property.VIEW : VIEW,
            page = (property.PAGE).split(','),
            hostname = (host.indexOf('addblock') > -1) ? window.location.host : window.location.hostname;
        url = window.location.protocol + '//' + hostname + '/' + page[0] + '/view/' + view,
            txt = (page[0] == 'forum') ? $('.tpl-forum-title').text() : $('[data-project-title]').text(),
            pageLang = sid.split('__');
        if (pageLang.length > 1) url = window.location.protocol + '//' + hostname + '/_lang/' + pageLang[1] + '/' + page[0] + '/view/' + view;
        sendSns(sns, url, txt);
    });

    function sendSns(sns, url, txt) {
        var img = $('meta[property="og:image"]').attr('content'),
            description = ($('meta[property="og:description"]').length > 0) ? $('meta[property="og:description"]').attr('content') : $('meta[name="description"]').attr('content');

        var o,
            _url = (typeof url == "undefined") ? encodeURIComponent("http://creatorlink.net") : encodeURIComponent(url),
            _txt = (typeof txt == "undefined") ? encodeURIComponent("Make your portfolio site as easily as stacking blocks") : encodeURIComponent(txt),
            _br = encodeURIComponent('\r\n'),
            _img = (typeof img == "undefined") ? 'https://storage.googleapis.com/i.addblock.net/config/aboutVideoImg00.png' : img,
            _kakaolinkurl = (typeof url == "undefined") ? "http://creatorlink.net" : url;

        switch (sns) {
            case 'facebook':
                o = {
                    method: 'popup',
                    url: 'https://www.facebook.com/sharer/sharer.php?u=' + _url + '&t=' + _txt
                };
                break;
            case 'twitter':
                o = {
                    method: 'popup',
                    url: 'http://twitter.com/intent/tweet?text=' + _txt + '&url=' + _url + '&source=' + _url
                };
                break;
            case 'google':
                o = {
                    method: 'popup',
                    url: 'https://plus.google.com/share?url=' + _url
                };
                break;
            case 'pinterest':
                o = {
                    method: 'popup',
                    url: 'http://pinterest.com/pin/create/button/?url=' + _url + '&media=' + _img + '&description=' + _txt
                };
                break;
            case "tumblr":
                o = {
                    method: 'popup',
                    url: 'http://www.tumblr.com/share?v=3&u=' + _url + '&t=creatorlink&s='
                };
                break;
            case "naverblog":
                o = {
                    method: 'popup',
                    url: 'http://share.naver.com/web/shareView.nhn?url=' + _url + '&title=' + _txt
                };
                break;
            case "kakaotalk":
                if (typeof property.SETTINGS.kakaolink != 'undefined') {
                    var kakaolink_key = property.SETTINGS.kakaolink_key;
                    console.log('txt: '+txt);
                    console.log('description: '+description);
                    kakaotalkShare(txt, description, _img, kakaolink_key, _kakaolinkurl);
                } else alert('카카오 API키 오류');
                o = {
                    method: ''
                };
                break;
            case "urlcopy":
                copyToUrlClipboard(url);
                o = {
                    method: ''
                };
                break;
            default:
                o = {
                    method: ''
                };
                break;
        }
        switch (o.method) {
            case "popup":
                var left = (screen.width / 2) - (575 / 2);
                var top = (screen.height / 2) - (575 / 2);
                window.open(o.url, 'Share', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, width=575, height=575, top=' + top + ', left=' + left);
                break;
            default:
                break;
        }
    }

    function kakaotalkShare(title, content, img, kakaolink_key, url) {
        Kakao.cleanup();
        Kakao.init(kakaolink_key);
        if(Kakao.isInitialized()) {
            Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                    title: title,
                    description: content,
                    imageUrl: img,
                    link: {
                        mobileWebUrl: url,
                        webUrl: url
                    }
                },
                buttons: [{
                    title: '웹으로 보기',
                    link: {
                        mobileWebUrl: url,
                        webUrl: url
                    }
                }]
            });
        }
    }

    function copyToUrlClipboard(url) {
        if (window.clipboardData && window.clipboardData.setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            return clipboardData.setData("Text", url);

        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = url;
            textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy"); // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
                alert($.lang[LANG]['config.sns.urlcopy.alert']);
            }
        }
    }

    function stripslashes(str) {
        return (str + '')
            .replace(/\\(.?)/g, function(s, n1) {
                switch (n1) {
                    case '\\':
                        return '\\';
                    case '0':
                        return '\u0000';
                    case '':
                        return '';
                    default:
                        return n1;
                }
            });
    }

    function isNumber(s) {
        s += '';
        s = s.replace(/^\s*|\s*$/g, '');
        if (s == '' || isNaN(s)) return false;
        return true;
    }

    function saveSelection() {
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                return sel.getRangeAt(0);
            }
        } else if (document.selection && document.selection.createRange) {
            return document.selection.createRange();
        }
        return null;
    }

    function restoreSelection(range) {
        if (range) {
            if (window.getSelection) {
                sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (document.selection && range.select) {
                range.select();
            }
        }
    }

    function getBytes(string) {
        if(string == '') return 0;
        var cnt = 0,
            ch = "";
        for (var i = 0; i < string.length; i++) {
            ch = string.charAt(i);
            if (escape(ch).length > 4) {
                cnt += 2;
            } else {
                cnt += 1;
            }
        }
        return cnt;
    }

    function getWidthPercent(el) {
        var width = parseFloat($(el).css('width')) / parseFloat($(el).parent().css('width'));
        return Math.round(100 * width) + '%';
    }

    // smartresize
    (function($, sr) {

        // debouncing function from John Hann
        // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
        var debounce = function(func, threshold, execAsap) {
                var timeout;

                return function debounced() {
                    var obj = this,
                        args = arguments;

                    function delayed() {
                        if (!execAsap)
                            func.apply(obj, args);
                        timeout = null;
                    };

                    if (timeout)
                        clearTimeout(timeout);
                    else if (execAsap)
                        func.apply(obj, args);

                    timeout = setTimeout(delayed, threshold || 100);
                };
            }
            // smartresize 
        jQuery.fn[sr] = function(fn) { return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

    })(jQuery, 'smartresize');

    function emailcheck(email) {
        // var regExp = /[0-9a-zA-Z][_0-9a-zA-Z-]*@[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+){1,2}$/;
        var regExp = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (email.lenght == 0) return false;
        if (!email.match(regExp)) return false;
        return true;
    }

    function shareModal() {
        var title = $('meta[property="og:title"]').attr('content'),
            description = ($('meta[property="og:description"]').length > 0) ? $('meta[property="og:description"]').attr('content') : $('meta[name="description"]').attr('content');
        $(this).showModalFlat($.lang[LANG]['config.sns-share-btn'], snsPost(), false, false, '', '', '', 'cl-modal cl-cmmodal cl-p70 cl-s-btn cl-close-btn cl-t80 w320 share-modal');
    }

    var snsPost = function() {
        str = "" +
            "   <ul class='tpl-share-sns'>";
        if (property.SETTINGS.kakaolink == 'on') {
            str += "<li class='tpl-share-snsPost' data-sns='kakaotalk' id='kakao-link-btn'><span class='share-round'><svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\"><path d=\"M12 1.89c-6.08 0-11 3.89-11 8.7 0 3.13 2.09 5.87 5.22 7.4 -0.23 0.86-0.83 3.11-0.95 3.59 -0.15 0.6 0.22 0.59 0.46 0.43 0.19-0.13 3.01-2.05 4.23-2.88 0.66 0.1 1.34 0.15 2.04 0.15 6.08 0 11-3.89 11-8.7C23 5.79 18.08 1.89 12 1.89\"/></svg></span> <span class='tpl-share-sns-name'>" + $.lang[LANG]["config.sns.kakaotalk"] + "</span></li>";
        }

        str += "<li class='tpl-share-snsPost' data-sns='facebook'><span class='share-round'><svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\"><path d=\"M15.64 4.65l2.07 0v-3.5C17.35 1.11 16.12 1 14.69 1c-2.98 0-5.03 1.82-5.03 5.17v2.88H6.29v3.91h3.38V23h4.04V12.96h3.37l0.5-3.91H13.7v-2.5C13.7 5.42 14.02 4.65 15.64 4.65z\"/></svg></span> <span class='tpl-share-sns-name'>" + $.lang[LANG]["config.sns.facebook"] + "</span></li>" +
            "       <li class='tpl-share-snsPost' data-sns='twitter'><span class='share-round'><svg viewBox=\"0 0 20 20\" width=\"20\" height=\"20\"><path d=\"M14.21 16.71h1.53L5.86 3.2H4.22l9.98 13.52Zm.97-15.13h2.76l-6.03 7.14L19 18.43h-5.55L9.1 12.54l-4.98 5.89H1.36l6.45-7.63L1 1.58h5.7l3.93 5.38 4.55-5.38Z\"/></svg></span> <span class='tpl-share-sns-name'>" + $.lang[LANG]["config.sns.twitter"] + "</span></li>" +
            "       <li class='tpl-share-snsPost' data-sns='naverblog'><span class='share-round'><svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\"><path d=\"M18.49 10.29c-0.48 0-0.87 0.39-0.87 0.87 0 0.48 0.39 0.87 0.87 0.87 0.48 0 0.87-0.39 0.87-0.87C19.36 10.68 18.97 10.29 18.49 10.29z\"/><path d=\"M13.3 10.29c-0.48 0-0.87 0.39-0.87 0.87 0 0.48 0.39 0.87 0.87 0.87 0.48 0 0.87-0.39 0.87-0.87C14.17 10.68 13.78 10.29 13.3 10.29z\"/><path d=\"M5.59 10.29c-0.48 0-0.87 0.39-0.87 0.87 0 0.48 0.39 0.87 0.87 0.87 0.48 0 0.87-0.39 0.87-0.87C6.45 10.68 6.07 10.29 5.59 10.29z\"/><path d=\"M19.53 3H4.47C2.56 3 1 4.56 1 6.49v8.27c0 1.93 1.56 3.49 3.47 3.49h5.18l1.77 2.88c0 0 0.02 0.03 0.06 0.08 0.1 0.18 0.29 0.3 0.51 0.3 0.22 0 0.41-0.12 0.51-0.29 0.04-0.05 0.06-0.09 0.06-0.09l1.77-2.88h5.18c1.92 0 3.47-1.56 3.47-3.49V6.49C23 4.56 21.44 3 19.53 3zM5.89 13.21c-0.81 0-1.13-0.58-1.13-0.58v0.44H3.39V7.46h1.35v2.14c0.54-0.53 1.14-0.53 1.14-0.53 1.83 0 1.9 2.05 1.9 2.05C7.78 13.14 5.89 13.21 5.89 13.21zM10.13 9.44v3.63h-1.3V9.75c0-1.14-0.61-1.12-0.61-1.12v-1.3C10.19 7.33 10.13 9.44 10.13 9.44zM15.58 11.16c0 2.05-2.28 2.05-2.28 2.05 -2.3 0-2.23-2.05-2.23-2.05 0-2.08 2.23-2.08 2.23-2.08C15.65 9.08 15.58 11.16 15.58 11.16zM20.61 13.01c0 2.13-1.97 2.1-1.97 2.1h-0.52v-1.19h0.32c0.95 0 0.86-0.98 0.86-0.98v-0.31c-0.42 0.54-1.18 0.51-1.18 0.51 -1.87 0-1.85-2-1.85-2 0-2.14 1.91-2.06 1.91-2.06 0.74 0 1.13 0.51 1.13 0.51V9.21h1.31V13.01z\"/></svg></span> <span class='tpl-share-sns-name'>" + $.lang[LANG]["config.sns.naverblog"] + "</span></li>" +
            "       <li class='tpl-share-snsPost' data-sns='urlcopy'><span class='share-round'><svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\"><path d=\"M8.71 18.87c-0.48 0.48-1.11 0.74-1.79 0.74s-1.31-0.26-1.79-0.74c-0.99-0.99-0.99-2.59 0-3.58l4.15-4.15c0.48-0.48 1.11-0.74 1.79-0.74 0.68 0 1.31 0.26 1.79 0.74l0.98-0.98c-0.76-0.76-1.77-1.15-2.77-1.15s-2 0.38-2.77 1.15l-4.15 4.15c-1.53 1.53-1.53 4.01 0 5.54C4.91 20.62 5.91 21 6.92 21s2-0.38 2.77-1.15l2.08-2.08 -0.98-0.98L8.71 18.87z\"/><path d=\"M19.85 4.15C19.09 3.38 18.09 3 17.08 3c-1 0-2 0.38-2.77 1.15l-2.08 2.08 0.98 0.98 2.08-2.08c0.48-0.48 1.11-0.74 1.79-0.74s1.31 0.26 1.79 0.74c0.99 0.99 0.99 2.59 0 3.58l-4.15 4.15c-0.48 0.48-1.11 0.74-1.79 0.74 -0.68 0-1.31-0.26-1.79-0.74l-0.98 0.98c0.76 0.76 1.77 1.15 2.77 1.15s2-0.38 2.77-1.15l4.15-4.15C21.38 8.16 21.38 5.68 19.85 4.15z\"/></svg></span> <span class='tpl-share-sns-name'>" + $.lang[LANG]["config.sns.urlcopy"] + "</span></li>" +
            "       <!--<li class='tpl-share-snsPost' data-sns='google'><i class='fa fa-google-plus-square'></i> <span class='tpl-share-sns-name'>" + $.lang[LANG]["config.sns.google"] + "</span></li>" +
            "       <li class='tpl-share-snsPost' data-sns='pinterest'><i class='fa fa-pinterest-square'></i> <span class='tpl-share-sns-name'>" + $.lang[LANG]["config.sns.pinterest"] + "</span></li>" +
            "       <li class='tpl-share-snsPost' data-sns='tumblr'><i class='fa fa-tumblr-square'></i> <span class='tpl-share-sns-name'>" + $.lang[LANG]["config.sns.tumblr"] + "</span></li>-->" +
            "   </ul>" +
            "";
        return str;
    }

    var displayPageToolbar = function(option, settings) {
        var deferred = $.Deferred();
        if (typeof option == 'undefined') option = '';
        if (typeof settings == 'undefined') settings = '';

        var menu_lock = (PAGE_MODE == 'c') ? '' : property.ISLOCK,
            toolbar_class = (typeof menu_lock != 'undefined' && menu_lock == 'true') ? 'hide' : '';
        var like = getLike();
        var heart = '';
        var like_id = '';
        var likeCnt = 0;
        like.done(function(data) {
            // console.log(data);
            if (typeof data.own != 'undefined' && data.own) {
                like_id = data.view;
                heart = 'active';
            }
            likeCnt = data.cnt;
        });

        if ($('.tpl-forum-list-footer').length) { //forum
            var f_lang = (typeof settings.chlang != 'undefined' && settings.chlang)? settings.chlang : LANG;
            var str = '\
                <ul class="tpl-page-toolbar ' + toolbar_class + '" data-page-option="' + option + '">' +
                '<li class="tpl-forum-toolbar-button like hide">\
                        <button type="button" class="btn btn-default btn-round ' + heart + '" data-like="' + like_id + '">\
                            <svg viewBox="0 0 28 28" width="28" height="28"><path d="m22.76 14.7-8.74 8.97-8.75-8.97m0 0c-2.31-2.32-2.37-6.14-.13-8.53 2.24-2.4 5.93-2.46 8.24-.14.23.23.44.48.63.75 1.93-2.67 5.59-3.2 8.16-1.2s3.09 5.79 1.16 8.45c-.18.24-.37.47-.58.68"></path><path d="M14.01 24.57c-.24 0-.48-.1-.64-.27l-8.74-8.97c-2.64-2.66-2.71-7.04-.15-9.78a6.576 6.576 0 0 1 4.74-2.12c1.79-.01 3.5.67 4.8 1.96a6.576 6.576 0 0 1 3.74-1.86c1.77-.25 3.54.22 4.97 1.34 2.95 2.29 3.55 6.64 1.33 9.69-.2.28-.42.54-.66.78l-.06.06-8.68 8.9c-.17.17-.4.27-.65.27zm-8.1-10.51c0 .01.01.01 0 0l8.1 8.32 8.1-8.31.06-.06c.15-.16.3-.33.43-.52 1.65-2.27 1.21-5.51-.98-7.22a4.723 4.723 0 0 0-3.61-.97c-1.31.2-2.47.91-3.27 2a.91.91 0 0 1-.73.37c-.29 0-.56-.14-.73-.38-.16-.22-.34-.44-.54-.64a4.78 4.78 0 0 0-3.49-1.43A4.83 4.83 0 0 0 5.8 6.78c-1.91 2.04-1.86 5.31.11 7.28z"></path></svg>\
                            <span class="forum-like-cnt">' + likeCnt + '</span>\
                        </button>\
                    </li>' +
                // '<li class="tpl-forum-toolbar-button"><i class="fa fa-thumb-tack"></i></li>' +
                '<li class="tpl-forum-toolbar-button share hide"><button type="button" class="btn btn-default btn-round">' + $.lang[f_lang]['board.button.share'] + '</span></button></li>\
                </ul>\
            ';
            if(settings.forum_type == 'modoo') {
              if ($('.tpl-forum-list-footer .tpl-forum-toolbar-button').length == 0) $('.tpl-forum-modoo-reply').prepend(str);
            } else {
              if ($('.tpl-forum-list-footer .tpl-forum-toolbar-button').length == 0) $('.tpl-forum-list-footer').prepend(str);
            }
        } else { //gallery
            var g_btn_prev = ($('.data-page-prev').hasClass('active')) ? 'active' : '',
                g_btn_next = ($('.data-page-next').hasClass('active')) ? 'active' : '',
                g_toolbar = '\
                    <div class="tpl-page-toolbar ' + toolbar_class + '" data-page-option="' + option + '" style="width: 100%;">\
                        <div class="pull-left tpl-forum-toolbar-button share hide">\
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="M21 17c-1.24 0-2.33.58-3.07 1.46l-7.05-3.53c.07-.3.12-.61.12-.93s-.05-.63-.12-.93l7.05-3.53c.74.88 1.83 1.46 3.07 1.46 2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4c0 .32.05.63.12.93l-7.05 3.53C9.33 10.58 8.24 10 7 10c-2.21 0-4 1.79-4 4s1.79 4 4 4c1.24 0 2.33-.58 3.07-1.46l7.05 3.53c-.07.3-.12.61-.12.93 0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4zm0-12.2c1.21 0 2.2.99 2.2 2.2s-.99 2.2-2.2 2.2-2.2-.99-2.2-2.2.99-2.2 2.2-2.2zM7 16.2c-1.21 0-2.2-.99-2.2-2.2s.99-2.2 2.2-2.2 2.2.99 2.2 2.2-.99 2.2-2.2 2.2zm14 7c-1.21 0-2.2-.99-2.2-2.2s.99-2.2 2.2-2.2 2.2.99 2.2 2.2-.99 2.2-2.2 2.2z"></path></svg>\
                        </div>\
                        <div class="pull-left tpl-forum-toolbar-button like hide ' + heart + '" data-like="' + like_id + '">\
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28">\
                                <path d="m22.76 14.7-8.74 8.97-8.75-8.97m0 0c-2.31-2.32-2.37-6.14-.13-8.53 2.24-2.4 5.93-2.46 8.24-.14.23.23.44.48.63.75 1.93-2.67 5.59-3.2 8.16-1.2s3.09 5.79 1.16 8.45c-.18.24-.37.47-.58.68"></path>\
                                <path d="M14.01 24.57c-.24 0-.48-.1-.64-.27l-8.74-8.97c-2.64-2.66-2.71-7.04-.15-9.78a6.576 6.576 0 0 1 4.74-2.12c1.79-.01 3.5.67 4.8 1.96a6.576 6.576 0 0 1 3.74-1.86c1.77-.25 3.54.22 4.97 1.34 2.95 2.29 3.55 6.64 1.33 9.69-.2.28-.42.54-.66.78l-.06.06-8.68 8.9c-.17.17-.4.27-.65.27zm-8.1-10.51c0 .01.01.01 0 0l8.1 8.32 8.1-8.31.06-.06c.15-.16.3-.33.43-.52 1.65-2.27 1.21-5.51-.98-7.22a4.723 4.723 0 0 0-3.61-.97c-1.31.2-2.47.91-3.27 2a.91.91 0 0 1-.73.37c-.29 0-.56-.14-.73-.38-.16-.22-.34-.44-.54-.64a4.78 4.78 0 0 0-3.49-1.43A4.83 4.83 0 0 0 5.8 6.78c-1.91 2.04-1.86 5.31.11 7.28z"></path>\
                            </svg>\
                            <span class="forum-like-cnt">' + likeCnt + '</span>\
                        </div>\
                        <div class="bottom-navigation hide">\
                            <div class="pull-right tpl-project-toolbar-button data-page-next ' + g_btn_next + '"><svg viewBox="0 0 24 24" width="24" height="24"><path d="M10.64 18.64l-1.28-1.28L14.73 12 9.36 6.64l1.28-1.28L17.27 12z"/></svg></div>\
                            <div class="pull-right tpl-project-toolbar-button data-page-prev ' + g_btn_prev + '"><svg viewBox="0 0 24 24" width="24" height="24"><path d="M13.36 18.64L6.73 12l6.63-6.64 1.28 1.28L9.27 12l5.37 5.36z"/></svg></div>\
                            <div class="pull-right tpl-project-toolbar-button data-page-back"><svg viewBox="0 0 24 24" width="24" height="24"><g><path d="M4 6h16v2H4zM4 11h16v2H4zM4 16h16v2H4z"/></g></svg></div>\
                        </div>\
                    </div>\
                ';

            var $wrap = $('<div class="tpl-page-footer hide">');
            $wrap.append('<div class="container"><div class="row"><div class="col-md-12 col-sm-12 col-xs-12 tpl-page-footer-wrap"></div></div></div>');
            $wrap.find('.tpl-page-footer-wrap').append(g_toolbar);
            $wrap.css({
                'background-color': 'transparent',
                'padding': '30px 0px'
            });

            if (PAGE_MODE == 'c') {
                $lastEl = ($('.el-footer_ctrl').length) ? $('.el-footer_ctrl') : $('.add-footer-information');
                $lastEl.before($wrap);
                if($('.el-fixedcontact').length) {
                    var fixedContactEL = $('.el-fixedcontact').attr('data-el');
                    $('.el-footer_ctrl').before($('.' + fixedContactEL + '_ctrl'));
                    $('.el-footer_ctrl').before($('.el-fixedcontact'));
                }
            } else {
                $('.el-footer').before($wrap);
            }

            var parentMode = (PAGE_MODE == 'c') ? PARENT.mode : property.PARENT.mode;
            var checkGalleryProjectClass = (parentMode == 'project') ? 'galProjectBg' : '';
            var g_color = (typeof $('.dsgn-body').attr('data-gcolor') != 'undefined') ? $('.dsgn-body').attr('data-gcolor') : '';
            if (g_color) {
                var galProjectCssStr = ($('.galProjectCss').length > 0) ? $('.galProjectCss').text() : '';
                galProjectCssStr += '.dsgn-body[data-gcolor="' + g_color + '"] .galProjectBg svg {fill: '+Coloris.getChangeColorVal(g_color,'a',0.6)+';}\n';
                $('.galProjectCss').text(galProjectCssStr);
            }
        }

        var f_color = ($('.forum-view').attr('data-fcolor')) ? $('.forum-view').attr('data-fcolor') : '#000000';
        $('.forum-write .tpl-forum-list-footer button').css('border-color', Coloris.getChangeColorVal(f_color,'a',0.4));
        $('.forum-write .tpl-forum-list-footer button').css('color', Coloris.getChangeColorVal(f_color,'a',0.8));

        if ($('.tpl-forum-list-footer .tpl-page-toolbar li.like').length > 0) {
            var f_like_color = ($('.forum-view').attr('data-fcolor-like')) ? $('.forum-view').attr('data-fcolor-like') : f_color;
            $('.tpl-forum-list-footer .tpl-page-toolbar li.like button').css('border-color', Coloris.getChangeColorVal(f_like_color,'a',0.4));
            $('.tpl-forum-list-footer .tpl-page-toolbar li.like button').css('color', Coloris.getChangeColorVal(f_like_color,'a',0.8));
        }

        deferred.resolve($('.tpl-page-footer'));
        return deferred.promise();
    }

    var getLike = function(view) {
        var deferred = $.Deferred();
        var lSID = (PAGE_MODE == 'c') ? SID : property.SID,
            lPARENT = (PAGE_MODE == 'c') ? PARENT : property.PARENT,
            lVIEW = (PAGE_MODE == 'c') ? VIEW : property.VIEW;
        var type = (lPARENT.mode) ? 'P' : 'F';

        if (view !== undefined && view) {
            type = 'P';
            lPARENT = '';
            lVIEW = view;
        }

        $.ajax({
            type: 'post',
            url: '/template/like/get',
            data: { type: type, view: lVIEW, sid: lSID },
            dataType: 'json',
            async: false,
            success: function(data) {
                deferred.resolve(data);
            }
        });

        return deferred.promise();
    }

    var setLike = function(el, mode) {
        if (typeof MODE !== 'undefined' && MODE == 'demo') return false;
        var umemberActivate = (PAGE_MODE == 'c') ? Number(UMEMBER_ACTIVATE) : Number(property.UMEMBER_ACTIVATE);
        var checkLogin = (PAGE_MODE == 'c') ? true : false;
        var view = (PAGE_MODE == 'c') ? VIEW : property.VIEW;
        var parent = (PAGE_MODE == 'c') ? PARENT : property.PARENT;
        var sid = (PAGE_MODE == 'c') ? SID : property.SID;

        var cm_id = '';
        var elsettings = {};
        var $this = el;

        if (PAGE_MODE == 's') {
            var umember = property.UMEMBER;
            checkLogin = umember.check_login;

            if (umemberActivate == 0 && umember.id_type == 'creatorlink') { //creatorlink login
                checkLogin = (umember.id !== undefined && umember.id) ? true : false;
            }

            if ($('#write-login').length > 0) $('#write-login').remove();

            if (parent.page) {
                elsettings = JSON.parse(parent.settings);
            } else {
                var parent_id = ($this.hasClass('gallery-like')) ? $this.closest('.blueimp-gallery').attr('id').replace('gframe-', '') : $this.closest('.element').attr('data-id');
                var el_idx = $('.element[data-id="' + parent_id + '"]').attr('data-el').replace('el_', '')
                var el_target = property.INITPAGE[el_idx];
                elsettings = JSON.parse(el_target.elsettings);
            }

            var like_level = (elsettings.like_level !== undefined && elsettings.like_level) ? elsettings.like_level : 'A';
            if (mode == 'comment') {
                like_level = (elsettings.likeComment_level !== undefined && elsettings.likeComment_level) ? elsettings.likeComment_level : 'A';
            }

            if (like_level == 'M' && checkLogin == false) {
                if (confirm($.lang[LANG]['config.like.onlylogin'])) {
                    var action = (property.VALIDTYPE == 'SM') ? '/_login' : '/_cllogin';
                    var url = $(location).attr('pathname');
                    var html = '<form name="write_login_form" id="write-login" method="post" action="' + action + '" style="display:none;">\
                                    <input type="hidden" name="status" value="like">\
                                    <input type="hidden" name="sid" value="' + property.SID + '">\
                                    <input type="hidden" name="url" value="' + url + '">\
                                </form>';
                    $('body').append(html);
                    document.write_login_form.submit();
                }
                return false;
            }
        }

        var like_id = $this.attr('data-like');
        var cnt = 0;

        if (mode == 'list') {
            like_id = $this.closest('.figure.like').attr('data-like');
        }
        $this.addClass('disabled');
        var type = (parent.mode)? 'P':'F';
        var pid = parent.pid;
        switch (mode) {
            case 'gallery':
                type = 'P';
                pid = '';
                view = $this.attr('data-seq');
                break;
            case 'list':
                type = 'P';
                pid = '';
                view = $this.closest('.gallery-item').attr('data-seq');
                break;
            case 'comment':
                type += 'C';
                view = $this.closest('.page-comments').attr('data-id');
                cm_id = $this.attr('data-id');
                break;
        }

        if (like_id !== undefined && like_id) { //delete like
            $.ajax({
                type: 'post',
                url: '/template/like/delete',
                data: { type: type, view: like_id, sid: sid, pid: pid, cm_id: cm_id },
                dataType: 'json',
                async: true,
                success: function(data) {
                    $this.removeClass('disabled');
                    switch (mode) {
                        case 'list':
                            $this.closest('.figure.like').removeClass('active').removeAttr('data-like');
                            $this.closest('.figure.like').find('.figure-like-cnt').text(data.cnt);
                            break;

                        case 'gallery':
                            $this.removeClass('active').removeAttr('data-like');
                            view = $this.attr('data-seq');
                            var $figureLike = $('.gallery-item[data-seq="' + view + '"] .figure.like');
                            cnt = $figureLike.find('.figure-like-cnt').text();
                            // console.log('$figureLike', $figureLike, cnt);
                            $figureLike.removeClass('active').removeAttr('data-like');
                            $figureLike.find('.figure-like-cnt').text(data.cnt);
                            break;

                        case 'project':
                            $this.removeClass('active').removeAttr('data-like');
                            $this.find('.forum-like-cnt').text(data.cnt);
                            break;

                        case 'forum':
                            $this.removeClass('active').removeAttr('data-like');
                            $this.find('.forum-like-cnt').text(data.cnt);

                            if ($('.page-bottomlist').length > 0) {
                                $('.tpl-forum-list-like[data-id="' + view + '"]').removeClass('active').removeAttr('data-like');
                                if ($('.tpl-forum-list-like[data-id="' + view + '"]').is('td') && $('.tpl-forum-list-like[data-id="' + view + '"] .forum-like-cnt').length == 0) {
                                    $('.tpl-forum-list-like[data-id="' + view + '"]').text(data.cnt);
                                } else {
                                    $('.tpl-forum-list-like[data-id="' + view + '"] .forum-like-cnt').text(data.cnt);
                                }
                            }
                            break;

                        case 'comment':
                            $this.removeClass('active').removeAttr('data-like');
                            $this.find('.cm-like-cnt').text(data.cnt);

                            break;

                        default:
                            break;
                    }
                }
            });
        } else { //insert like
            $.ajax({
                type: 'post',
                url: '/template/like/update',
                data: { type: type, view: view, sid: sid, pid: pid, cm_id: cm_id },
                dataType: 'json',
                async: true,
                success: function(data) {
                    $this.removeClass('disabled');
                    switch (mode) {
                        case 'list':
                            $this.closest('.figure.like').addClass('active').attr('data-like', view);
                            $this.closest('.figure.like').find('.figure-like-cnt').text(data.cnt);

                            break;

                        case 'gallery':
                            $this.addClass('active').attr('data-like', view);

                            var $figureLike = $('.gallery-item[data-seq="' + view + '"] .figure.like');
                            cnt = $figureLike.find('.figure-like-cnt').text();

                            $figureLike.addClass('active').attr('data-like', view);
                            $figureLike.find('.figure-like-cnt').text(data.cnt);

                            break;

                        case 'project':
                            $this.addClass('active').attr('data-like', view);
                            $this.find('.forum-like-cnt').text(data.cnt);
                            break;

                        case 'forum':
                            $this.addClass('active').attr('data-like', view);
                            $this.find('.forum-like-cnt').text(data.cnt);

                            if ($('.page-bottomlist').length > 0) {
                                $('.tpl-forum-list-like[data-id="' + view + '"]').addClass('active').attr('data-like', view);
                                if ($('.tpl-forum-list-like[data-id="' + view + '"]').is('td') && $('.tpl-forum-list-like[data-id="' + view + '"] .forum-like-cnt').length == 0) {
                                    $('.tpl-forum-list-like[data-id="' + view + '"]').text(data.cnt);
                                } else {
                                    $('.tpl-forum-list-like[data-id="' + view + '"] .forum-like-cnt').text(data.cnt);
                                }
                            }
                            break;

                        case 'comment':
                            $this.addClass('active').attr('data-like', view);
                            $this.find('.cm-like-cnt').text(data.cnt);

                            break;

                        default:
                            break;
                    }
                }
            });
        }
    }

    var imgPopupFrame = function (el) {
        $('#imgPopupFrame').remove();
        var href = (typeof el == 'string')? el : $(el).attr('href');
        var imgSrc = (href.indexOf('googleusercontent') > -1)? getServeImage(href, 0, '') : href;
        var str = '\
            <div id="imgPopupFrame">\
                <div class="image-popup"><img src="'+imgSrc+'" onerror="this.src=\'//storage.googleapis.com/i.addblock.net/img_broken_fill_500.png\'"></div>\
                <div class="zoomable hide"></div>\
                <a class="close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" width="22" height="22"><polygon points="22 1.06 20.94 0 11 9.94 1.06 0 0 1.06 9.94 11 0 20.94 1.06 22 11 12.06 20.94 22 22 20.94 12.06 11 "/></svg></a>\
                <a class="zoom-in" data-toggle="tooltip" data-placement="bottom" data-html="true" data-original-title="확대"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M24 22.94l-6.42-6.42C19.08 14.76 20 12.49 20 10c0-5.52-4.48-10-10-10S0 4.48 0 10s4.48 10 10 10c2.49 0 4.76-0.92 6.52-2.42L22.94 24 24 22.94zM1.5 10c0-4.69 3.81-8.5 8.5-8.5 4.69 0 8.5 3.81 8.5 8.5s-3.81 8.5-8.5 8.5C5.31 18.5 1.5 14.69 1.5 10z"/><polygon points="10.75 6 9.25 6 9.25 9.25 6 9.25 6 10.75 9.25 10.75 9.25 14 10.75 14 10.75 10.75 14 10.75 14 9.25 10.75 9.25 "/></svg></a>\
                <a class="zoom-out disabled" data-toggle="tooltip" data-placement="bottom" data-html="true" data-original-title="축소"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" width="23" height="23"><g><path d="m23 21.98-6.16-6.16a9.566 9.566 0 0 0 2.32-6.24C19.17 4.29 14.88 0 9.58 0S0 4.29 0 9.58s4.29 9.58 9.58 9.58c2.39 0 4.57-.88 6.24-2.32L21.98 23 23 21.98zM1.44 9.58c0-4.49 3.65-8.15 8.15-8.15 4.49 0 8.15 3.65 8.15 8.15s-3.65 8.15-8.15 8.15-8.15-3.66-8.15-8.15z"/><path d="M5.75 8.86h7.67v1.44H5.75z"/></g></svg></a>\
                <a class="view-original disabled" data-toggle="tooltip" data-placement="bottom" data-html="true" data-original-title="화면 크기에 맞춰 확대">\
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 27" width="27" height="27"><g><path d="M1 4.12v18.75h25V4.12H1zm23.5 17.26h-22V5.62h22v15.76z"/><path d="M8.03 18.19h1.56V8.81H6.47v1.57h1.56zM12.72 10.38h1.56v1.56h-1.56zM12.72 15.06h1.56v1.56h-1.56zM18.19 18.19h1.56V8.81h-3.13v1.57h1.57z"/></g></svg>\
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 27" width="27" height="27"><path d="M24.03 4.03 24 4V3h-1l-.03-.03-.03.03H13.5v1.5h7.94L4.5 21.44V13.5H3v9.44l-.03.03L3 23v1h1l.03.03.03-.03h9.44v-1.5H5.56L22.5 5.56v7.94H24V4.06z"/></svg>\
                </a>\
            </div>\
        ';
        
        $('.dsgn-body').append(str);

        setTimeout(function(){
            $('#imgPopupFrame').addClass('imgPopup-display');

            var currentWidth = $('#imgPopupFrame .image-popup img').width();
            if(currentWidth >= $(window).width()) {
                $('#imgPopupFrame .view-original').addClass('disabled');
            } else {
                $('#imgPopupFrame .view-original').removeClass('disabled');
            }
            setImgPopupIconTooltip($('#imgPopupFrame'));
        }, 500);
    }

    var setImgPopupIconTooltip = function(el){
        $(el).find('.zoom-in, .zoom-out, .view-original, .view-original.fullscreen').attr({
            'data-toggle': 'tooltip',
            'data-placement': 'bottom',
            'data-html': 'true',
        });

        $(el).find('.zoom-in').attr('data-original-title', $.lang[LANG]['gallery.slide.tooltip.zoom-in']);
        $(el).find('.zoom-out').attr('data-original-title', $.lang[LANG]['gallery.slide.tooltip.zoom-out']);

        $(el).find('.view-original').attr('data-original-title', $.lang[LANG]['gallery.slide.view-fullscreen']);
        if($(el).find('.view-original').hasClass('fullscreen')) {
            $(el).find('.view-original').attr('data-original-title', $.lang[LANG]['gallery.slide.tooltip.view-original']);
        } else {
            $(el).find('.view-original').attr('data-original-title', $.lang[LANG]['gallery.slide.tooltip.view-fullscreen']);
        }
    }

    var setPopupImgScale = function(el, scale) {
        var $img = el.find('img');
        var currentWidth = $img.width();
        var currentHeight = $img.height();

        var zoomable = el.find('.zoomable');

        if(zoomable.find('img').length == 0) {
            var $cloneImg = el.find('img').clone();
            $cloneImg.addClass('clone').attr('data-width', currentWidth).attr('data-height', currentHeight);
            zoomable.append($cloneImg);
        }
        var zoomableImg = zoomable.find('img');

        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        var scaledWidth = currentWidth * scale;
        var scaledHeight = currentHeight * scale;

        var scrollTop = zoomable.scrollTop();
        var scrollLeft = zoomable.scrollLeft();

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

        zoomable.removeClass('scroll');
        if(scaledWidth > windowWidth) {
            zoomable.css('width', scaledWidth);
            isScroll = true;
            offset = {top: scaledOffsetY+'px', left: 0};
        }

        if(scaledHeight > windowHeight) {
            zoomable.css('height', scaledHeight);
            isScroll = true;
            offset = {top: 0, left: scaledOffsetX+'px'};
        } 

        if(scaledWidth >= windowWidth && scaledHeight >= windowHeight) {
            offset = {top: 0, left: 0};
        }

        if(isScroll) {
            zoomable.addClass('scroll');
            var scrollOffsetX = scaledWidth - windowWidth;
            var scrollOffsetY = scaledHeight - windowHeight;
            centerX = (scrollOffsetX - 8) * 0.5;
            centerY = (scrollOffsetY - 8) * 0.5;
            
            scrollPositionX = (zoomable.attr('data-scroll-left') !== undefined)? Number(zoomable.attr('data-scroll-left')) * scrollOffsetX : centerX;
            scrollPositionY = (zoomable.attr('data-scroll-top') !== undefined)? Number(zoomable.attr('data-scroll-top')) * scrollOffsetY : centerY;
        }

        var scaleAnimation = Object.assign({}, offset, {width: scaledWidth+'px', height: scaledHeight+'px', scrollLeft: scrollPositionX, scrollTop: scrollPositionY});

        if (scale > 1) {    
            $('#imgPopupFrame a.zoom-out').removeClass('disabled');
            zoomable.removeClass('hide');
            var zoomWidth = zoomableImg.attr('data-width');
            var zoomHeight = zoomableImg.attr('data-height');
            var initialWidth = zoomableImg.width();
            var initialHeight = zoomableImg.height();

            if(Number(zoomWidth) == currentWidth) {
                zoomableImg.css({width: currentWidth+'px', height: currentHeight+'px', top: offsetY+'px', left: offsetX+'px'});
            }

            zoomable.addClass('visible');
            setTimeout(function(){
                el.addClass('fullscreen');
                
                zoomableImg.animate(scaleAnimation, 200);
                // console.log(initialWidth, scaledWidth);
                if(initialWidth < windowWidth && scaledWidth > windowWidth) {
                    scrollPositionX = centerX;
                    var scrollLeft = centerX / (scaledWidth - windowWidth);
                    zoomable.attr({'data-scroll-left': scrollLeft});
                }
                if(initialHeight < windowHeight && scaledHeight > windowHeight) {
                    scrollPositionY = centerY;
                    var scrollTop = centerY / (scaledHeight - windowHeight);
                    zoomable.attr({'data-scroll-top': scrollTop});
                }

                zoomable.animate({scrollLeft: scrollPositionX, scrollTop: scrollPositionY}, 200); //scroll

                // if(scaledWidth >= windowWidth && scaledHeight >= windowHeight) zoomable.animate({scrollLeft: scrollPositionX, scrollTop: scrollPositionY}, 500);

                zoomableImg.attr('data-scale', scale).attr('data-width', scaledWidth).attr('data-height', scaledHeight);

                var isDragging = false;
                var lastX, lastY;
                zoomable.off('mousedown mousemove mouseup scroll');
                zoomable.on("mousedown", function(e) {
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

                    zoomable.attr({'data-scroll-top': scrollTop, 'data-scroll-left': scrollLeft});
                    // console.log("가로 스크롤 좌표: " + scrollLeft);
                    // console.log("세로 스크롤 좌표: " + scrollTop);
                });

                zoomable.on('mousewheel', function(e){
                    var scrollLeft = (($(this)[0].scrollWidth - $(this)[0].clientWidth) > 0) ? $(this).scrollLeft() / ($(this)[0].scrollWidth - $(this)[0].clientWidth) : 0;  // 가로 스크롤 좌표
                    var scrollTop = (($(this)[0].scrollHeight - $(this)[0].clientHeight) > 0) ? $(this).scrollTop() / ($(this)[0].scrollHeight - $(this)[0].clientHeight) : 0;    // 세로 스크롤 좌표

                    zoomable.attr({'data-scroll-top': scrollTop, 'data-scroll-left': scrollLeft});
                    // console.log("가로 스크롤 좌표: " + scrollLeft);
                    // console.log("세로 스크롤 좌표: " + scrollTop);
                });
            }, 100);
        } else { //원본 크기
            zoomableImg.animate(scaleAnimation, 200);
            zoomable.animate({scrollLeft: scrollPositionX, scrollTop: scrollPositionY}, 200);

            $('#imgPopupFrame a.zoom-out').addClass('disabled');
            $('#imgPopupFrame a.view-original').removeClass('fullscreen');

            if(scaledWidth == $(window).width()) {
                $('#imgPopupFrame a.view-original').addClass('disabled');
            }

            setTimeout(function(){
                el.removeClass('fullscreen');
            }, 100);
            setTimeout(function(){
                zoomable.removeClass('visible').addClass('hide');
                zoomable.removeAttr('data-scroll-top data-scroll-left')
                zoomableImg.remove();
            }, 200);
        }
    
        
    }

    var drawBadgeList = function(use_badge, badge_settings) {
        var badgeList = '';
        if(typeof badge_settings == 'undefined' || !badge_settings) {
            badge_settings = {}
        }
        if(typeof use_badge != 'undefined' && use_badge) {
            var badgeCnt = use_badge.length;
            $.each(use_badge, function(idx, b){
                var bsettings = (typeof badge_settings[b] != 'undefined')? badge_settings[b] : {};
                var badgeType = (typeof bsettings.type != 'undefined' && bsettings.type)? bsettings.type : 'edit';
                var badgeStyle = (typeof bsettings.style != 'undefined' && bsettings.style)? bsettings.style : 'default-1 small';
                var badgeText = (typeof bsettings.badge_text != 'undefined' && bsettings.badge_text)? bsettings.badge_text : $.lang[LANG]['gallery.shopping.badge.'+b];
                var badgeBorderColor = (typeof bsettings.border_color != 'undefined' && bsettings.border_color)? bsettings.border_color : '';
                var badgeBackgroundColor = (typeof bsettings.background_color != 'undefined' && bsettings.background_color)? bsettings.background_color : '';
                var badgeFontColor = (typeof bsettings.font_color != 'undefined' && bsettings.font_color)? bsettings.font_color : '';
                var $badge = (badgeType == 'edit')? $('<span class="product-badge ' + badgeStyle + '">' + badgeText + '</span>') : $('<span class="product-badge"><img class="badge-img" src="' + bsettings.image_src + '"></span>');
                
                if(badgeBorderColor) $badge.css('border-color', badgeBorderColor);
                if(badgeBackgroundColor) $badge.css('background-color', badgeBackgroundColor);
                if(badgeFontColor) $badge.css('color', badgeFontColor);
                // if(typeof PAGE_MODE != 'undefined' && PAGE_MODE == 'c') $badge.attr('data-type', b);
                $badge.attr('data-type', b);

                badgeList += $badge[0].outerHTML;
            });
        }
        
        return badgeList;
    }

    var getBadgeSize = function(badge_settings) {
        var small = 0;
        var medium = 0;
        var large = 0;
        var cnt = 0;
        if(typeof badge_settings != 'undefined' && badge_settings) {
            $.each(badge_settings, function(t, b){
                if(b.type == 'edit') {
                    cnt++;
                    if(b.style.indexOf('small') > -1) small++;
                    if(b.style.indexOf('medium') > -1) medium++;
                    if(b.style.indexOf('large') > -1) large++;
                }
            });
        }
        
        var flag = false;
        if(cnt == small) flag = 'badge-small';
        if(cnt == medium) flag = 'badge-medium';
        if(cnt == large) flag = 'badge-large';

        return flag;
    }

    $(document).on('click', '#imgPopupFrame .close, #imgPopupFrame .image-popup', function(e){
        if(!$(e.target).is('img')) $('#imgPopupFrame').fadeOut(500);
    });

    $(document).on('dblclick','#imgPopupFrame .image-popup img, #imgPopupFrame .zoomable img', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $('#imgPopupFrame a.view-original').toggleClass('fullscreen');

        var el = $('#imgPopupFrame');
        var $img = $('#imgPopupFrame .image-popup img');

        if($('#imgPopupFrame a.view-original').hasClass('fullscreen')) {
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

        setImgPopupIconTooltip(el);
        setPopupImgScale(el, scale);
    });

    $(document).on('click','#imgPopupFrame a.view-original', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).toggleClass('fullscreen');

        var el = $('#imgPopupFrame');
        setImgPopupIconTooltip(el);
        $('#imgPopupFrame .view-original[data-toggle="tooltip"]').tooltip('show');

        var $img = el.find('img');
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
        setPopupImgScale(el, scale);
    });

    $(document).on('click','#imgPopupFrame a.zoom-in, #imgPopupFrame a.zoom-out', function(e) {
        e.stopPropagation();

        var scale = $('#imgPopupFrame .zoomable img').attr('data-scale');
        if(scale === undefined) scale = 1;

        if($(this).hasClass('zoom-in')) {
            $('#imgPopupFrame a.view-original').removeClass('disabled').addClass('fullscreen');

            scale = Number(scale) + 0.5;
        } else {
            if(scale > 1) scale = Number(scale) - 0.5;
            if(scale < 1) scale = 1;
            if(scale == 1) {
                $('#imgPopupFrame a.view-original').removeClass('fullscreen');
            }
        }
        
        // setImgPopupIconTooltip(el);
        setPopupImgScale($('#imgPopupFrame'), scale);
        
    });

    $(document).on('click', '.data-feed-load-more', function() {
        var feed = $(this).attr('data-feed-el');
        if ($('.' + feed + ' .listprogress').length) {
            $(this).showModalFlat('INFORMATION', 'Please wait...', true, false, '', 'ok');
            return false;
        }
        $('.' + feed + ' .social-feed-element').addClass('show-posts');
        if (typeof $('.' + feed + ' .social-feed-element:eq(0)').first().attr('social-feed-id') != 'undefined') $(this).hide();
    });

    var loadingElement = function(el, msg) {
        $('.' + el + ' .listprogress').remove();
        if ($('.' + el).find('.social-feed-container').hasClass('listprogress-end')) return false;
        msg = (typeof msg == "undefined") ? "" : msg;
        var p = (msg) ? "<p class='text-center'>" + msg + "</p>" : "";
        $('.' + el + ' .social-feed-container').append('<div class="listprogress" style="width: 100%; text-align:center; padding:50px 0;"><svg version="1.1" xmlns="http://www.w3.org/svg/2000" viewBox="0 0 30 30" width="60" style="width:20px; height: 20px;"><circle cy="15" cx="15" r="14" style="stroke:#00baff;"></circle></svg>' + p + '</div>');
    }

    var setCustomPagination = function(config) {

        var $obj = config['$obj'],
            total = config['total'],
            view = (config['view']) ? config['view'] : 10,
            page_num = (config['page_num']) ? config['page_num'] : 1,
            page_view = (config['page_view']) ? config['page_view'] : 5,
            pagingContainer = config['pagingContainer'],
            section = config['section'],
            base_url = config['base_url'];

        start = Math.floor((page_num - 1) / page_view) * page_view,
            pages = Math.ceil(total / view),
            end = (Math.floor((page_num - 1) / page_view) + 1) * page_view,
            end = (end > pages) ? pages : end,
            prev = (start > 0) ? start : 1,
            next = ((end + 1) > pages) ? pages : end + 1,
            page_class = section + '-page';

        $obj.empty();

        for (i = start; i < end; i++) {
            var active = ((i + 1) == page_num) ? "active" : "",
                pageHref = base_url + (i + 1);

            $obj.append($("<li class='" + page_class + " " + active + "' data-view='" + view + "' data-page-num='" + (i + 1) + "'><a href='" + pageHref + "'>" + (i + 1) + "</a></li>"));
        }

        var prevHref = base_url + prev,
            nextHref = base_url + next,
            firstHref = base_url + '1',
            lastHref = base_url + pages,
            $prev = "" +
            "<li class='" + page_class + " prev' data-view='" + view +
            "' data-page-num='" + (start) + "'>" +
            "<a href='" + prevHref + "' aria-label='Previous'>" +
            "<span aria-hidden='true'>" +
            "<i class='fa fa-angle-left'></i>" +
            "</span>" +
            "</a>" +
            "</li>",
            $next = "" +
            "<li class='" + page_class + " next' data-view='" + view +
            "' data-page-num='" + (i + 1) + "'>" +
            "<a href='" + nextHref + "' aria-label='Previous'>" +
            "<span aria-hidden='true'>" +
            "<i class='fa fa-angle-right'></i>" +
            "</span>" +
            "</a>" +
            "</li>",
            $first = "" +
            "<li class='" + page_class + " prev' data-view='" + view +
            "' data-page-num='1'>" +
            "<a href='" + firstHref + "' aria-label='First'>" +
            "<span aria-hidden='true'>" +
            "<i class='fa fa-angle-double-left'></i>" +
            "</span>" +
            "</a>" +
            "</li>",
            $last = "" +
            "<li class='" + page_class + " prev' data-view='" + view +
            "' data-page-num='" + pages + "'>" +
            "<a href='" + lastHref + "' aria-label='Last'>" +
            "<span aria-hidden='true'>" +
            "<i class='fa fa-angle-double-right'></i>" +
            "</span>" +
            "</a>" +
            "</li>";

        if (start != 0)
            $obj.prepend($prev);

        if (end != pages)
            $obj.append($next);

        if (pages > 5) {
            if (page_num > 5) $obj.prepend($first);
            $obj.append($last);
        }

    }

    function memberLogin() {
        location.href = "/";
    }


    Number.prototype.format = function(n, x) {
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
        return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
    };

    // 뎁스가 있는 값을 확인하기
    var checkNested = function(obj) {
        var args = Array.prototype.slice.call(arguments, 1);

        for (var i = 0; i < args.length; i++) {
            if (!obj || !obj.hasOwnProperty(args[i])) {
                return false;
            }
            obj = obj[args[i]];
        }
        return true;
    }

    Number.prototype.format = function() {
        if (this == 0) return 0;

        var reg = /(^[+-]?\d+)(\d{3})/;
        var n = (this + '');

        while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');

        return n;
    };


    String.prototype.format = function() {
        var num = parseFloat(this);
        if (isNaN(num)) return "0";

        return num.format();
    };

    function selectionRect() {
        var s = window.getSelection();
        oRange = s.getRangeAt(0); //get the text range
        oRect = oRange.getBoundingClientRect();
        return oRect;
    }

    function isHangulKey(event) {
        return (event.keyCode >= 12593 && event.keyCode <= 12622) || // 자모음 범위
        (event.keyCode >= 44032 && event.keyCode <= 55203) || // 완성형 범위
        (event.keyCode >= 12592 && event.keyCode <= 12687);
    }            

    function placeCaretAtEnd(el) {
        el.focus();
        if (typeof window.getSelection != "undefined" &&
            typeof document.createRange != "undefined") {
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange != "undefined") {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    }

    var insertVideo = function(sUrl, mode) {
        if (typeof sUrl == 'object') {
            var result = [];
            $.each(sUrl, function(i, v) {
                var r = insertVideo(v);
                if (typeof r != 'undefined') result.push(r);
            });
            return (sUrl.length == result.length) ? result : false;
        }

        sUrl = sUrl.replace('www.', '');
        var img = 'https://storage.googleapis.com/i.addblock.net/video-icon.jpg';
        // video url patterns(youtube, instagram, vimeo, dailymotion)
        var ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var ytMatch = sUrl.match(ytRegExp);

        var igRegExp = /\/\/instagram.com\/p\/(.[a-zA-Z0-9]*)/;
        var igMatch = sUrl.match(igRegExp);

        var vRegExp = /\/\/vine.co\/v\/(.[a-zA-Z0-9]*)/;
        var vMatch = sUrl.match(vRegExp);

        var vimRegExp = /\/\/(player.)?vimeo.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/;
        var vimMatch = sUrl.match(vimRegExp);

        var dmRegExp = /.+dailymotion.com\/(video|hub|embed)\/([^_]+)[^#]*(#video=([^_&]+))?/;
        var dmMatch = sUrl.match(dmRegExp);

        var mcRegExp = /\/\/metacafe.com\/watch\/(.[a-zA-Z0-9]*)\/(.[a-zA-Z0-9\-]*)\//;
        var mcMatch = sUrl.match(mcRegExp);

        var kakaoExp = /\/\/tv.kakao.com\/(channel|embed)\/([0-9]{6,11}|player)\/cliplink\/([0-9]{6,11})/;
        var kaMatch = sUrl.match(kakaoExp);

        var kakaoExp2 = /\/\/tv.kakao.com\/(v|l)\/([0-9]{6,11})/;
        var kaMatch2 = sUrl.match(kakaoExp2);

        var naverExp = /\/\/serviceapi.rmcnmv.naver.com\/(.*)/;
        var naMatch = sUrl.match(naverExp);

        var sound = sUrl.search('soundcloud.com');
        var $video, src;
        if (ytMatch && ytMatch[2].length === 11) {
            var youtubeId = ytMatch[2];
            src = '//www.youtube.com/embed/' + youtubeId;
            src = src.replace('watch?v=', 'v/');

            $video = $('<iframe>')
                .attr({ 'src': src + '?wmode=transparent', 'frameborder': '0' });
            img = '//img.youtube.com/vi/' + youtubeId + '/default.jpg';
            /*        
            } else if (igMatch && igMatch[0].length > 0) {
                $video = $('<iframe>')
                .attr('src', igMatch[0] + '/embed/')
                .attr('width', '612').attr('height', '710')
                .attr('scrolling', 'no')
                .attr('allowtransparency', 'true');
            } else if (vMatch && vMatch[0].length > 0) {
                $video = $('<iframe>')
                .attr('src', vMatch[0] + '/embed/simple')
                //.attr('width', '600').attr('height', '600')
                .attr('class', 'vine-embed');
                src = vMatch[0] + '/embed/simple';
            */
        } else if (vimMatch && vimMatch[3].length > 0) {
            $video = $('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>')
                .attr('src', '//player.vimeo.com/video/' + vimMatch[3]);
            //.attr('width', '640').attr('height', '360');
            src = '//player.vimeo.com/video/' + vimMatch[3];
            $.getJSON('https://vimeo.com/api/oembed.json?url=https://player.vimeo.com/video/' + vimMatch[3] + '&width=640', function(data) {
                if (typeof data.thumbnail_url != 'undefined' && data.thumbnail_url) {
                    img = data.thumbnail_url;
                }
            });
        } else if (dmMatch && dmMatch[2].length > 0) {
            dmMatch[2] = dmMatch[2].replace("video/", "");
            $video = $('<iframe>')
                .attr('src', '//www.dailymotion.com/embed/video/' + dmMatch[2]);
            //.attr('width', '640').attr('height', '360');
            src = '//www.dailymotion.com/embed/video/' + dmMatch[2];
            img = '//dailymotion.com/thumbnail/video/' + dmMatch[2];
        }
        /* else if (mcMatch && mcMatch[1].length > 0) {
                    $video = $('<iframe>')
                    .attr('src', 'http://www.metacafe.com/embed/' + mcMatch[1] + '/' + mcMatch[2]);
                    //.attr('width', '640').attr('height', '360');
                    src = 'http://www.metacafe.com/embed/' + mcMatch[1] + '/' + mcMatch[2];
                }*/
        else if (sound > -1) {
            $.getJSON('https://soundcloud.com/oembed?format=json&url=' + sUrl, function(data) {
                if (typeof data.html == 'undefined') {
                    alert('get Soundcloud API error');
                    return;
                }
                $video = $(data.html);
                src = $video.prop('src');
                img = data.thumbnail_url;
            }).fail(function(response) {
                console.log(response);
                alert('get Soundcloud API error');
                $video = false;
                src = false;
            });
        } else if (kaMatch && kaMatch[3].length > 0) {
            $video = $('<iframe>')
                .attr('src', '//tv.kakao.com/embed/player/cliplink/' + kaMatch[3] + '?service=kakao_tv');
            src = '//tv.kakao.com/embed/player/cliplink/' + kaMatch[3] + '?service=kakao_tv';
            // img = file_get_contents('//tv.kakao.com/v/' + kaMatch[3]);
        } else if (kaMatch2 && kaMatch2[2].length > 0) {
            var kakao_tv_iframe = {
                    'l': '//play-tv.kakao.com/embed/player/livelink?liveLinkId=',
                    'v': '//play-tv.kakao.com/embed/player/cliplink/'
                },
                kakao_tv_parameter = {
                    'l': '&service=player_share',
                    'v': '?service=player_share'
                }
            kakao_tv_src = kakao_tv_iframe[kaMatch2[1]] + kaMatch2[2] + kakao_tv_parameter[kaMatch2[1]];

            $video = $('<iframe>')
                .attr('src', kakao_tv_src)
                .attr('scrolling', 'no')
                .attr('allow', 'autoplay');
            src = kakao_tv_src;
        }
        /* else if(naMatch && naMatch[1].length > 0) {
                   $video = $('<iframe>')
                   .attr('src', '//serviceapi.rmcnmv.naver.com/' + naMatch[1]);
                   src = '//serviceapi.rmcnmv.naver.com/' + naMatch[1];
               } */
        else {
            // this is not a known video link. Now what, Cat? Now what?
        }

        if ($video) {
            $video.attr('frameborder', 0);
        }

        switch (mode) {
            case "src":
                return src;
                break;
            case "img":
                return img;
                break;
            default:
                return $video;
                break;
        }
    }

    function setForumWrap() {
        var width = $('body').width(),
            margin = 0,
            size = $('.fr-view').width(),
            sidebar = $('.dsgn-body').hasClass('sidebar');

        width = (sidebar) ? width - $('header.sidebar').width() : width;
        $.each($('.f-align-full, .f-align-wide'), function(i, v) {
            if ($(this).hasClass('f-align-full')) {
                margin = (width - size) / 2;
            } else {
                container = (size == 720) ? (size + 240) : (size + 220);
                if (width <= container) container = width;
                width = container;
                margin = (container - size) / 2;
            }
            $(this).css('cssText', 'width: ' + width + 'px !important; margin-left:-' + margin + 'px; max-width:' + width + 'px !important;');
        });
    }

    function doGetCaretPosition(oField) {

        // Initialize
        var iCaretPos = 0;

        // IE Support
        if (document.selection) {

            // Set focus on the element
            oField.focus();

            // To get cursor position, get empty selection range
            var oSel = document.selection.createRange();

            // Move selection start to 0 position
            oSel.moveStart('character', -oField.value.length);

            // The caret position is selection length
            iCaretPos = oSel.text.length;
        }

        // Firefox support
        else if (oField.selectionStart || oField.selectionStart == '0')
            iCaretPos = oField.selectionStart;


        // Return results
        return iCaretPos;
    }

    function resetForm($obj) {
        $.each($obj.find('.tpl-form-element'), function(i, v) {
            var type = $(this).prop('type');
            switch (type) {
                case 'text':
                case 'tel':
                case 'number':
                case 'textarea':
                    $(this).val('');
                    break;

                case 'radio':
                case 'checkbox':
                    $(this).prop('checked', false);
                    break;

                case 'select-one':
                case 'select-multi':
                    $(this).val('');
                    $(this)[0].selectIndex = -1;
                    break;
            }
        });
    }

    function getRecommendInfo($el, $img, mode) {
        // alert('el: ' + $el + ', img:' + $img + ', mode:' + mode);
        if (typeof mode == 'undefined' || $el.hasClass('el-footer')) mode = true;

        var width = '';
        if (mode == false) {
            width = ($('#element-display > div').is('[data-width]')) ? $('#element-display > div').attr('data-width') : $el.attr('data-width');
        } else {
            if (typeof $el.attr('data-width') != 'undefined' && $el.attr('data-type2') != 'logo') width = $el.attr('data-width');
            else if ($el.attr('data-type2') == 'logo' && $el.attr('data-case') == 'slideshow69') width = '160';
            else if ($el.attr('data-type2') == 'logo' && $el.attr('data-case') == 'slideshow68') width = '100';
            else width = 0;
        }

        var src = $img.prop('src'),
            img_resolution = '',
            img = new Image(),
            nWidth = 0,
            nHeight = 0,
            txt_img_click = (mode) ? $.lang[LANG]['editor.image.click.change'] + '<br>' : '',
            recomm_str = '',
            footerlogo = (selectEL == 'el-footer') ? $img[0].src.split(':')[1] : '',
            isfooterAttach = typeof $('img[src="' + footerlogo + '"]').is('[data-footer-attach]') == 'undefined' ? false : $('img[src="' + footerlogo + '"]').is('[data-footer-attach]');

        img.src = (typeof src == 'undefined') ? '' : src;

        if (width == 0) {

            if (selectEL == 'el-menu' || (selectEL == 'el-footer' && isfooterAttach)) {
                var el_img = $('.' + selectEL).find('img[data-attach="true"]');
                if (typeof el_img.attr('src') != "undefined" && src.match(el_img.attr('src')) !== null) {
                    // HTML[data-max-width] > CSS max-width > HTML ELEMENT width()
                    nWidth = (typeof el_img.css('max-width') != 'undefined' && el_img.css('max-width').match(/px/gi) !== null) ? el_img.css('max-width').replace('px', '') : el_img.width();
                    nHeight = (typeof el_img.css('max-height') != 'undefined' && el_img.css('max-height').match(/px/gi) !== null) ? el_img.css('max-height').replace('px', '') : el_img.height();

                    img_resolution = (typeof el_img.closest('.navbar-brand').attr('data-recommend') != 'undefined') ? el_img.closest('.navbar-brand').attr('data-recommend') : nWidth + ' X ' + nHeight;
                    // return '<div class="text-left">' + txt_img_click + '<span class="txt-recomm">' + $.lang[LANG]['editor.image.recomm.menu'] + '<br>' + img_resolution + '</span></div>';
                    return "<div class=\'text-left\'>" + txt_img_click + "</div>";
                }
            } else {
                img.onload = function() {
                    nWidth = this.width;
                    nHeight = this.height;
                    img_resolution = ((nWidth) ? nWidth : $img.width()) + ' X ' + ((nHeight) ? nHeight : $img.height());

                    recomm_str = "<div class=\'text-left\'>" + txt_img_click + "<span class=\'txt-recomm\'>" + $.lang[LANG]['editor.image.recomm'] + "<br>" + img_resolution + "</span></div>";

                    if (mode) {
                        var this_src = src.substr(src.lastIndexOf('/') + 1);
                        $('.bc-resource').find('img[src$="' + this_src + '"]').attr('data-original-title', recomm_str);
                    } else {
                        if ($('.recomm-image-text').length > 0) $('.recomm-image-text').html(recomm_str).show();
                        else $('body').append(recomm_str);
                    }
                }
                return "<div class=\'text-left\'>" + txt_img_click + "<span class=\'txt-recomm\' data-loading=\'true\'>Loading...</span></div>";
            }


            // if(mode) return '<div class="text-left">' + $.lang[LANG]['editor.image.click.change'] + '<br><span class="txt-recomm">' + $.lang[LANG]['editor.image.recomm'] + '<br>' + img_resolution + '</span></div>';
            // else return '<div class="text-left"><span class="txt-recomm">' + $.lang[LANG]['editor.image.recomm'] + '<br>' + img_resolution + '</span></div>';
        } else {
            switch (width) {
                case '1920':
                    img_resolution = '1920 X FREE';
                    break;
                case '800':
                    img_resolution = '800 X FREE';
                    break;
                case '700':
                    img_resolution = '700 X 500';
                    break;
                case '670':
                    img_resolution = '670 X 980';
                    break;
                case '650':
                    img_resolution = '650 X 370';
                    break;
                case '600':
                    img_resolution = '600 X 600';
                    break;
                case '250':
                    img_resolution = '250 X 250';
                    break;
                case '160':
                    img_resolution = '160 X 100';
                    break;
                case '100':
                    img_resolution = '100 X 100';
                    break;
                case '60':
                    img_resolution = '60 X 60';
                    break;
            }
            var gallery_check = (($el.attr('data-id') == 'all_products' || $el.attr('data-type2') == 'premium') && $el.attr('data-type') == 'gallery' && $el.find('.gjs').attr('data-js-code') == 1) ? true : false;
            if(!gallery_check) {
              if(width > 1000) {
                nWidth = this.width;
                nHeight = this.height;
                img_resolution = ((nWidth) ? nWidth : $img[0].naturalWidth) + ' X ' + ((nHeight) ? nHeight : $img[0].naturalHeight);
              } else {
                //현재 블럭의 이미지 영역의 2배 사이즈
                var $el_img = $('.' + selectEL).find('[data-attach="true"]');
                var img_width = ($el_img[0].width) ? $el_img[0].width : $el_img[0].clientWidth,
                    img_height = ($el_img[0].height) ? $el_img[0].height : $el_img[0].clientHeight;
                img_resolution = (img_width * 2) + ' X ' + (img_height * 2);
              }
            }

            return "<div class=\'text-left\'>" + txt_img_click + "<span class=\'txt-recomm\'>" + $.lang[LANG]['editor.image.recomm'] + "<br>" + img_resolution + "</span></div>";
        }

    }

    var getRatio = function(w) {
        var r = '';
        switch (w) {
            case "1920":
                r = '&w=1920&fit=crop';
                break;
            case "800":
                r = '&w=800&fit=crop';
                break;
            case "700":
                r = '&w=700&h=500&crop=face&fit=crop';
                break;
            case "670":
                r = '&w=670&h=980&crop=face&fit=crop';
                break;
            case "650":
                r = '&w=600&h=370&crop=face&fit=crop';
                break;
            case "600":
                r = '&w=600&h=600&crop=face&fit=crop';
                break;
            case "250":
                r = '&w=250&h=250&crop=face&fit=crop';
                break;
            case "60":
                r = '&w=60&h=60&crop=face&fit=crop';
                break;
            case "0":
                r = '';
                break;
        }
        return r;
    }

    var tplFormitem = function(type, idx, val) {
        var tpl = '';
        if (typeof val == 'undefined' || val == '') {
            if (type != 'file.download' && type != 'file.upload')
                val = ['A', 'B'];
        } else {
            if (type != 'file.download' && type != 'file.upload')
                val = val.split('`');
            else
                val = val.split('||');
        }

        var blang = (typeof $('.' + selectEL).attr('data-blocklang') == 'undefined') ? $('#element-display[data-ref="' + selectEL + '"]').attr('data-blocklang') : $('.' + selectEL).attr('data-blocklang'),
            sdefault = '';
        if (typeof blang == 'undefined') {
            blang = getLanguage(true);
        }

        if (blang == 'ko') {
            sdefault = '선택하세요';
            datePlaceholder = '날짜 선택';
            date2Placeholder = '날짜/시간 선택';
        } else if (blang == 'en') {
            sdefault = 'Select';
            datePlaceholder = 'Date';
            date2Placeholder = 'Date/Time';
        } else if (blang == 'ja') {
            sdefault = '選択してください';
            datePlaceholder = 'Date';
            date2Placeholder = 'Date/Time';
        } else {
            sdefault = 'Select';
            datePlaceholder = 'Date';
            date2Placeholder = 'Date/Time';
        }
        switch (type) {
            case 'text':
                tpl = '<input class="form-control" type="text">';
                break;
            case 'memo':
                tpl = '<textarea class="form-control"></textarea>';
                break;
            case 'select':
                tpl = '<select class="form-control">';
                tpl = tpl + '<option value="">' + sdefault + '</option>';
                $.each(val, function(i, v) {
                    tpl = tpl + '<option value="' + replaceQuote(v) + '">' + v + '</option>';
                });
                tpl = tpl + '</select>';
                break;
            case 'check':
                tpl = '<div>';
                $.each(val, function(i, v) {
                    tpl = tpl + '<label class="checkbox-inline"><input type="checkbox" class="forms-item-check" name="' + (type + idx) + '" value="' + replaceQuote(v) + '">' + v + '</label>';
                });
                tpl = tpl + '</div>';
                break;
            case 'radio':
                tpl = '<div>';
                $.each(val, function(i, v) {
                    tpl = tpl + '<label class="radio-inline"><input type="radio" class="forms-item-radio" name="' + (type + idx) + '" value="' + replaceQuote(v) + '">' + v + '</label>';
                });
                tpl = tpl + '</div>';
                break;
            case 'date':
                tpl = '<div>';
                tpl = tpl + '<input class="form-control form-date date-ymd" type="text" readonly placeholder="' + datePlaceholder + '"/><svg viewBox="0 0 14 16" width="14" height="16"><path d="M12 2h-1V1c0-0.55-0.45-1-1-1S9 0.45 9 1v1H5V1c0-0.55-0.45-1-1-1S3 0.45 3 1v1H2C0.9 2 0 2.9 0 4v10c0 1.1 0.9 2 2 2h10c1.1 0 2-0.9 2-2V4C14 2.9 13.1 2 12 2zM13 14c0 0.55-0.45 1-1 1H2c-0.55 0-1-0.45-1-1V6h12V14z"></path><rect x="3" y="8" width="2" height="2"></rect><rect x="6" y="8" width="2" height="2"></rect><rect x="9" y="8" width="2" height="2"></rect><rect x="3" y="11" width="2" height="2"></rect><rect x="6" y="11" width="2" height="2"></rect><rect x="9" y="11" width="2" height="2"></rect></svg>';
                tpl = tpl + '</div>';
                break;
            case 'date2':
                tpl = '<div>';
                tpl = tpl + '<input class="form-control date-ymd form-date" type="text" readonly placeholder="' + date2Placeholder + '"/><svg viewBox="0 0 14 16" width="14" height="16"><path d="M12 2h-1V1c0-0.55-0.45-1-1-1S9 0.45 9 1v1H5V1c0-0.55-0.45-1-1-1S3 0.45 3 1v1H2C0.9 2 0 2.9 0 4v10c0 1.1 0.9 2 2 2h10c1.1 0 2-0.9 2-2V4C14 2.9 13.1 2 12 2zM13 14c0 0.55-0.45 1-1 1H2c-0.55 0-1-0.45-1-1V6h12V14z"></path><rect x="3" y="8" width="2" height="2"></rect><rect x="6" y="8" width="2" height="2"></rect><rect x="9" y="8" width="2" height="2"></rect><rect x="3" y="11" width="2" height="2"></rect><rect x="6" y="11" width="2" height="2"></rect><rect x="9" y="11" width="2" height="2"></rect></svg>';
                tpl = tpl + '</div>';
                break;
            case 'file.upload':
                tpl = '<div>';
                tpl = tpl + '<input type="text" class="hide" value="" /><label class=""><input type="file" class="hide" />' + clSVG('paperclip', '16', '16', false, '') + $.lang[blang]['config.form.btn.attachment'] + ' <span class="file-uploaded-number">(0/10)</span></label><p class="file-title text">' + $.lang[blang]['config.form.file.attachment.none'] + '</p></div>';
                break;
            case 'file.download':
                tpl = '<div>';
                tpl = tpl + '<p class="file-title text">' + clSVG('paperclip', '16', '16', false, '') + (val[0] ? val[0] : $.lang[blang]['config.form.file.attachment.none']) + '</p>';
                tpl = tpl + '</div>';
                break;
        }

        return tpl;
    }

    function replaceQuote(str) {
        // str = str.replace(/\\/g, '\\\\');
        // str = str.replace(/\'/g, '\\\'');
        str = str.replace(/\"/g, '&quot;');
        // str = str.replace(/\0/g, '\\0');
        return str;
    }

    var captchaContainer = null;
    var loadCaptcha = function() {
        $('#recaptcha').attr('data-res', '');
        captchaContainer = grecaptcha.render('recaptcha', {
            'sitekey': '6LfZjyIUAAAAAIMcTzt0XriAdVXHExtrVsNUaiHz',
            'callback': loadCaptchaCallback
        });
    }
    var loadCaptchaCallback = function(res) { $('#recaptcha').attr('data-res', res); }
    var recaptchCallback = function() {}
    var checkCaptcha = function() {
        var s = $('#recaptcha').attr('data-res');
        var res = $.post('/fm/recaptcha', { r: s }, function(data) {
            return data;
        }, 'json');
        return res;
    }

    var load_kcaptcha = function() {
        $('#kcaptcha').attr('src', 'https://storage.googleapis.com/i.addblock.net/js/load_kcaptcha.gif');
        $('#kcaptcha').attr('title', $.lang[LANG]['page.reset-password.captcha-tip']);

        $.ajax({
            type: 'POST',
            url: rt_path + '/check/kcaptcha/session?_' + new Date().getTime(),
            xhrFields: { withCredentials: true },
            success: function(data) {
                md5_norobot_key = data;
                var t = (new Date).getTime();
                $('#kcaptcha').attr('src', rt_path + '/check/kcaptcha/image?_' + t);
            }
        });
    }

    var load_form_kcaptcha = function($formEL, pid) {
        $formEL.find('.kcaptcha-box img').attr('src', '//storage.googleapis.com/i.addblock.net/js/load_kcaptcha.gif');
        $.ajax({
            type: 'POST',
            url: rt_path + '/check/kcaptcha/session/' + pid + '?_' + new Date().getTime(),
            xhrFields: { withCredentials: true },
            success: function(data) {
                md5_norobot_pid = data;
                var t = (new Date).getTime();
                $formEL.find('.kcaptcha-box img').attr('src', rt_path + '/check/kcaptcha/image/' + pid + '?_' + new Date().getTime());
            }
        });
    }

    $('.element[data-type="form"] .form-group .view-privacy').live('click', function(){
        $(this).toggleClass('active');
        if($(this).hasClass('active')) {
            $(this).closest('.form-privacy').find('textarea').show();
        } else {
            $(this).closest('.form-privacy').find('textarea').hide();
        }
    });

    $('.element[data-type="contact"][data-type2="franchise bar"] .form-group .view-privacy').live('click', function(){
        let $el = $(this).closest('.element');
        let blocklang = (typeof $el.attr('data-blocklang') != 'undefined')? $el.attr('data-blocklang') : LANG;
        let slang = (typeof SLANG != 'undefined' && typeof SLANG.select_code != 'undefined' && SLANG.select_code != 'ko')? 'en' : 'ko';
        let privacyTxt = $(this).closest('.form-privacy').find('textarea').val();

        // if(PAGE_MODE == 'c') slang = LANG;
        if(!privacyTxt) privacyTxt = $.lang[blocklang]['contact.privacy.text.default'];

        let modal_content = '<div class="textarea-container">' + privacyTxt + '</div>';
        $(this).showModalFlat($.lang[blocklang]['contact.consult.privacy.view.title'], modal_content, true, false, '', $.lang[slang]['config.close'], '', 'cl-cmmodal cl-s-btn cover cl-p70 cl-t80 cl-modal w560 cl-okbtn-pbt70 cl-close-btn contact-privacy-view');
    });

    var loadMapDropdown = function ($el, selected, index) {
        if(typeof selected == 'undefined') selected = '';
        if(typeof index == 'undefined') index = 0;
        var blocklang = (typeof $el.attr('data-blocklang') != 'undefined')? $el.attr('data-blocklang') : LANG;
        var area0 = {
            [$.lang[blocklang]['contact.map.search.sido']] : '',
            [$.lang[blocklang]['contact.map.search.sido.1']]: '서울',
            [$.lang[blocklang]['contact.map.search.sido.2']]: '인천',
            [$.lang[blocklang]['contact.map.search.sido.3']]: '대전',
            [$.lang[blocklang]['contact.map.search.sido.4']]: '광주',
            [$.lang[blocklang]['contact.map.search.sido.5']]: '대구',
            [$.lang[blocklang]['contact.map.search.sido.6']]: '울산',
            [$.lang[blocklang]['contact.map.search.sido.7']]: '부산',
            [$.lang[blocklang]['contact.map.search.sido.8']]: '경기',
            [$.lang[blocklang]['contact.map.search.sido.9']]: '강원',
            [$.lang[blocklang]['contact.map.search.sido.10']]: '충북',
            [$.lang[blocklang]['contact.map.search.sido.11']]: '충남',
            [$.lang[blocklang]['contact.map.search.sido.12']]: '전북',
            [$.lang[blocklang]['contact.map.search.sido.13']]: '전남',
            [$.lang[blocklang]['contact.map.search.sido.14']]: '경북',
            [$.lang[blocklang]['contact.map.search.sido.15']]: '경남',
            [$.lang[blocklang]['contact.map.search.sido.16']]: '제주'
        };
        var areaObj = {
            area1: ["강남구","강동구","강북구","강서구","관악구","광진구","구로구","금천구","노원구","도봉구","동대문구","동작구","마포구","서대문구","서초구","성동구","성북구","송파구","양천구","영등포구","용산구","은평구","종로구","중구","중랑구"],
            area2: ["계양구","남구","남동구","동구","부평구","서구","연수구","중구","강화군","옹진군"],
            area3: ["대덕구","동구","서구","유성구","중구"],
            area4: ["광산구","남구","동구","북구","서구"],
            area5: ["남구","달서구","동구","북구","서구","수성구","중구","달성군"],
            area6: ["남구","동구","북구","중구","울주군"],
            area7: ["강서구","금정구","남구","동구","동래구","부산진구","북구","사상구","사하구","서구","수영구","연제구","영도구","중구","해운대구","기장군"],
            area8: ["고양시","과천시","광명시","광주시","구리시","군포시","김포시","남양주시","동두천시","부천시","성남시","수원시","시흥시","안산시","안성시","안양시","양주시","오산시","용인시","의왕시","의정부시","이천시","파주시","평택시","포천시","하남시","화성시","가평군","양평군","여주군","연천군"],
            area9: ["강릉시","동해시","삼척시","속초시","원주시","춘천시","태백시","고성군","양구군","양양군","영월군","인제군","정선군","철원군","평창군","홍천군","화천군","횡성군"],
            area10: ["제천시","청주시","충주시","괴산군","단양군","보은군","영동군","옥천군","음성군","증평군","진천군","청원군"],
            area11: ["계룡시","공주시","논산시","보령시","서산시","아산시","천안시","금산군","당진군","부여군","서천군","연기군","예산군","청양군","태안군","홍성군"],
            area12: ["군산시","김제시","남원시","익산시","전주시","정읍시","고창군","무주군","부안군","순창군","완주군","임실군","장수군","진안군"],
            area13: ["광양시","나주시","목포시","순천시","여수시","강진군","고흥군","곡성군","구례군","담양군","무안군","보성군","신안군","영광군","영암군","완도군","장성군","장흥군","진도군","함평군","해남군","화순군"],
            area14: ["경산시","경주시","구미시","김천시","문경시","상주시","안동시","영주시","영천시","포항시","고령군","군위군","봉화군","성주군","영덕군","영양군","예천군","울릉군","울진군","의성군","청도군","청송군","칠곡군"],
            area15: ["거제시","김해시","마산시","밀양시","사천시","양산시","진주시","진해시","창원시","통영시","거창군","고성군","남해군","산청군","의령군","창녕군","하동군","함안군","함양군","합천군"],
            area16: ["서귀포시","제주시","남제주군","북제주군"]
        };

        var areaObj_en = {
            area1: ["Gangnam District", "Gangdong District", "Gangbuk District", "Gangseo District", "Gwanak District", "Gwangjin District", "Guro District", "Geumcheon District", "Nowon District", "Dobong District", "Dongdaemun District", "Dongjak District", "Mapo District", "Seodaemun District", "Seocho District", "Seongdong District", "Seongbuk District", "Songpa District", "Yangcheon District", "Yeongdeungpo District", "Yongsan District", "Eunpyeong District", "Jongno District", "Jung District", "Jungnang District"],
            area2: ["Gyeyang District", "Nam District", "Namdong District", "Dong District", "Bupyeong District", "Seo District", "Yeonsu District", "Jung District", "Ganghwa County", "Ongjin County"],
            area3: ["Daedeok District", "Dong District", "Seo District", "Yuseong District", "Jung District"],
            area4: ["Gwangsan District", "Nam District", "Dong District", "Buk District", "Seo District"],
            area5: ["Nam District", "Dalseo District", "Dong District", "Buk District", "Seo District", "Suseong District", "Jung District", "Dalseong County"],
            area6: ["Nam District", "Dong District", "Buk District", "Jung District", "Ulju County"],
            area7: ["Gangseo District", "Geumjeong District", "Nam District", "Dong District", "Dongnae District", "Busanjin District", "Buk District", "Sasang District", "Saha District", "Seo District", "Suyeong District", "Yeonje District", "Yeongdo District", "Jung District", "Haeundae District", "Gijang County"],
            area8: ["Goyang City", "Gwacheon City", "Gawngmyeong City", "Gwangju City", "Guri City", "Gunpo City", "Gimpo City", "Namyangju City", "Dongducheon City", "Bucheon City", "Seongnam City", "Suwon City", "Siheung City", "Ansan City", "Anseong City", "Anyang City", "Yangju City", "Osan City", "Yongin City", "Uiwang City", "Uijeongbu City", "Icheon City", "Paju City", "Pyeongtaek City", "Pocheon City", "Hanam City", "Hwaseong City", "Gapyeong City", "Yangpyeong County", "Yeoju County", "Yeoncheon County"],
            area9: ["Gangneung City", "Donghae City", "Samcheok City", "Sokcho City", "Wonju City", "Chuncheon City", "Taebaek City", "Goseong County", "Yanggu County", "Yangyang County", "Yeongwol County", "Inje County", "Jeongseon County", "Cheorwon County", "Pyeongchang County", "Hongcheon County", "Hwacheon County", "Hoengseong County"],
            area10: ["Jecheon City", "Cheongju City", "Chungju City", " Goesan County", "Danyang County", "Boeun County", "Yeongdong County", "Okcheon County", "Eumseong County", "Jeungpyeong County", "Jincheon County", "Cheongwon County"],
            area11: ["Gyeryong City", "Gongju City", "Nonsan City", "Boryeong City", "Seosan City", "Asan City", "Cheonan City", "Geumsan County", "Dangjin County", "Buyeo County", "Seocheon County", "Yeongi County", "Yesan County", "Cheongyang County", "Taean County", "Hongseong County"],
            area12: ["Gunsan City", "Gimje City", "Namwon City", "Iksan City", "Jeonju City", "Jeongeup City", "Gochang County", "Muju County", "Buan County", "Sunchang County", "Wanju County", "Imsil County", "Jangsu County", "Jinan County"],
            area13: ["Gwangyang City", "Naju City", "Mokpo City", "Suncheon City", "Yeosu City", "Gangjin County", "Goheung County", "Gokseong County", "Gurye County", "Damyang County", "Muan County", "Boseong County", "Sinan County", "Yeonggwang County", "Yeongam County", "Wando County", "Jangseong County", "Jangheung County", "Jindo County", "Hampyeong County", "Haenam County", "Hwasun County"],
            area14: ["Gyeongsan City", "Gyeongju City", "Gumi City", "Gimcheon City", "Mungyeong City", "Sangju City", "Andong City", "Yeongju City", "Yeongcheon City", "Pohang City", "Goryeong County", "Gunwi County", "Bonghwa County", "Seongju County", "Yeongdeok County", "Yeongyang County", "Yecheon County", "Ulleung County", "Uljin County", "Uiseong County", "Cheongdo County", "Cheongsong County", "Chilgok County"],
            area15: ["Geoje City", "Gimhae City", "Masan City", "Miryang City", "Sacheon City", "Yangsan City", "Jinju City", "Jinhae-gu", "Changwon City", "Tongyeong City", "Geochang County", "Goseong County", "Namhae County", "Sancheong County", "Uiryeong County", "Changnyeong County", "Hadong County", "Haman County", "Hamyang County", "Hapcheon County"],
            area16: ["Seogwipo City", "Jeju City", "Namjeju County", "Bukjeju County"]
        };

        var sido = '';
        var gungu = '<li class="empty"><a href="javascript:;">' + $.lang[blocklang]['contact.map.search.gungu'] + '</a></li>';

        var idx = 0
        $.each(area0, function(k, v){
            var active = (selected == k)? 'active' : '';  
            sido += '<li class="' + active + '"><a href="javascript:;" data-idx="' + idx + '" data-val="' + v + '">' + k + '</a></li>';
            idx ++;
        });

        $el.find('.select-si-do .dropdown-menu').html(sido);

        var area = 'area' + index;
        if(index > 0) {
            var num = 0;
            $.each(areaObj[area], function(k, v) {
                let gunguTxt = (blocklang == 'en')? areaObj_en[area][k] : v;
                gungu += '<li><a href="javascript:;" data-idx="' + num + '" data-val="' + v + '">' + gunguTxt + '</a></li>';
                num ++;
            });
        }

        $el.find('.select-gun-gu .dropdown-menu').html(gungu);
    }

    var searchByStoreAddr = function ($el, val, mode) {
        if(typeof mode == 'undefined') mode = '';
        let total = 0;

        $el.find('.map-item-list .map-item-empty').remove();
        $el.find('.item').each(function(idx, v){
            if(mode == 'gungu' && $(v).hasClass('not-result')) {
                return true;
            }
            var addr = $(v).attr('data-addr');
            if(typeof addr != 'undefined' && addr.indexOf(val) === -1) {
                $(v).addClass('hide not-result');
            } else {
                $(v).removeClass('hide not-result');
                total ++;
            }
        });

        if(val) searchResultEmpty($el, total);
        if ($('body').width() <= 991) fmapMobilePaging($el);
    }

    var searchByStorename = function ($el) {
        var val = $el.find('.searchby-storename input').val().trim().toLowerCase();
        let total = 0;

        $el.find('.map-item-list .map-item-empty').remove();
        $el.find('.item').removeClass('hide not-result');
        
        if($el.find('.select-si-do .selected').length) {
            let selectedIdx1 = $el.find('.select-si-do .selected').attr('data-selected-idx');
            searchByStoreAddr($el, $el.find('.select-si-do li a[data-idx="' + selectedIdx1 + '"]').attr('data-val'));

            if($el.find('.select-gun-gu .selected').length) {
                let selectedIdx2 = $el.find('.select-gun-gu .selected').attr('data-selected-idx');
                searchByStoreAddr($el, $el.find('.select-gun-gu li a[data-idx="' + selectedIdx2 + '"]').attr('data-val'), 'gungu');
            }
        }
        
        if(typeof val != 'undefined' && val) {
            $el.find('.item').each(function(idx, v){
                if($(v).hasClass('not-result')) {
                    return true;
                }
                var itemName = $(v).find('.item-name').text().toLowerCase();
                if(typeof itemName != 'undefined' && itemName.indexOf(val) === -1) {
                    $(v).addClass('hide not-result');
                } else {
                    $(v).removeClass('hide not-result');
                    total ++;
                }
            });

            searchResultEmpty($el, total);
        }
        
        $el.find('.searchby-storename input').blur();
        if ($('body').width() <= 991) fmapMobilePaging($el);
    }

    var searchResultEmpty = function ($el, total) {
        let blocklang = ($el.attr('data-blocklang'))? $el.attr('data-blocklang') : LANG;
        let emptyHTML = '<div class="map-item-empty">' + $.lang[blocklang]['contact.map.search.results.empty'] + '</div>';
        let searchCnt = $el.find('.map-item-list .item:not(.hide)').length;

        if(total == 0) {
            $el.find('.map-item-list .map-item-empty').remove();
            $el.find('.map-item-list').append(emptyHTML);
        }
    }

    $('[data-type="contact"][data-type2="franchise map"] .select-si-do .dropdown-toggle').live('click', function(e){
        e.preventDefault();

        var $el = $(this).closest('.element');
        var $btn = $(this).find('span');
        var val = $(this).find('span').text();
        var idx = ($btn.attr('data-selected-idx'))? $btn.attr('data-selected-idx') : 0;
        loadMapDropdown($el, val, idx);
    });

    $('[data-type="contact"][data-type2="franchise map"] .select-si-do li a').live('click', function(e){
        var $el = $(this).closest('.element');
        var $btn = $(this).closest('.dropdown').find('button.dropdown-toggle > span');
        var idx = $(this).attr('data-idx');
        var val = $(this).attr('data-val');
        var valTxt = $(this).text();
        var blocklang = (typeof $el.attr('data-blocklang') != 'undefined')? $el.attr('data-blocklang') : LANG;

        $(this).closest('.map-search').find('.select-gun-gu .dropdown-toggle > span').removeClass('selected');
        $(this).closest('.map-search').find('.select-gun-gu .dropdown-toggle > span').text($.lang[blocklang]['contact.map.search.gungu']);

        $el.find('.searchby-storename input').val('');
        $btn.text(valTxt);

        $el.find('.item').removeClass('hide not-result');
        $btn.removeClass('selected');

        if(typeof val != 'undefined' && val) {
            $btn.addClass('selected');
            $btn.attr('data-selected-idx', idx);
            searchByStoreAddr($el, val);
        } else {
            $el.find('.map-item-list .map-item-empty').remove();
            $el.find('.item').removeClass('hide not-result');
            if ($('body').width() <= 991) fmapMobilePaging($el);
        }

        loadMapDropdown($el, val, $(this).attr('data-idx'));
    });

    $('[data-type="contact"][data-type2="franchise map"] .select-gun-gu .dropdown-toggle').live('click', function(e){
        e.preventDefault();

        var $el = $(this).closest('.element');
        var blocklang = (typeof $el.attr('data-blocklang') != 'undefined')? $el.attr('data-blocklang') : LANG;
        
        if($el.find('.select-si-do .selected').length == 0) {
            $el.find('.select-gun-gu .dropdown-menu').html('<li class="empty"><a href="javascript:;">' + $.lang[blocklang]['contact.map.search.gungu'] + '</a></li>');
        }
    });

    $('[data-type="contact"][data-type2="franchise map"] .select-gun-gu li a').live('click', function(e){
        var $el = $(this).closest('.element');
        var $li = $(this).closest('li');
        var $btn = $(this).closest('.dropdown').find('button.dropdown-toggle > span');
        var idx = $(this).attr('data-idx');
        var val = $(this).attr('data-val');
        var valTxt = $(this).text();

        $el.find('.searchby-storename input').val('');
        $btn.text(valTxt);
        $btn.removeClass('selected');
        // console.log('gungu', val, $el.find('.select-si-do .selected'));
        // if(typeof val != 'undefined' && val) {
        //     $btn.addClass('selected');
        //     $btn.attr('data-selected-idx', idx);
        //     searchByStoreAddr($el, val);
        // } else {
        //     if($el.find('.select-si-do .selected')) {
        //         let selectedIdx = $('.select-si-do .selected').attr('data-selected-idx');
        //         searchByStoreAddr($el, $el.find('.select-si-do li a[data-idx="' + selectedIdx + '"]').attr('data-val'));
        //     } else {
        //         $el.find('.item').removeClass('hide not-result');                
        //     }
        // }
        if($el.find('.select-si-do .selected').length) {
            let selectedIdx = $('.select-si-do .selected').attr('data-selected-idx');
            searchByStoreAddr($el, $el.find('.select-si-do li a[data-idx="' + selectedIdx + '"]').attr('data-val'));

            if(typeof val != 'undefined' && val) {
                $btn.addClass('selected');
                $btn.attr('data-selected-idx', idx);
                searchByStoreAddr($el, val, 'gungu');
            }
        } else {
            $el.find('.map-item-list .map-item-empty').remove();
            $el.find('.item').removeClass('hide not-result');
            if ($('body').width() <= 991) fmapMobilePaging($el);
        }
    });

    $('[data-type="contact"][data-type2="franchise map"] .searchby-storename input[type="text"]').live('keyup', function(e){
        if(e.keyCode == 13) {
            var $el = $(this).closest('.element');
            searchByStorename($el);
        }
    });
    $('[data-type="contact"][data-type2="franchise map"] .searchby-storename .map-search-btn').live('click', function(e){
        var $el = $(this).closest('.element');
        searchByStorename($el);
    });

    $('[data-type="contact"][data-type2="franchise map"] .map-item-list > .item:not(.selected)').live('click', function(){
        var $el = $(this).closest('.element');
        var mapKind = $(this).attr('data-map_kind');
        $el.find('.map-item-list > .item').removeClass('selected');
        $(this).addClass('selected');

        drawMap($(this), $el);

        if($el.find('.map-info').length > 0) {
            var idx = (typeof $(this).attr('data-idx') == 'undefined')? 0 : $(this).attr('data-idx');
            // console.log('idx', idx);
            $el.find('.map-info').addClass('hide');
            $el.find('.map-info[data-idx="'+idx+'"]').removeClass('hide');
        }
    });

    var drawMap = function($item, $el){
        var iVALIDPLAN = (PAGE_MODE == 'c') ? VALIDPLAN : property.VALIDPLAN;
        var id = $el.attr('data-id');
        var mapKind = $item.attr('data-map_kind');
        var zoomInOut = $item.attr('data-zoominout');
        var mapTitle = $item.attr('data-maptitle');
        var mapContent = $item.attr('data-mapcontent');
        var useTitle = $item.attr('data-usetitle');
        var useContent = $item.attr('data-usecontent');
        var lat = $item.attr("data-lat");
        var lng = $item.attr("data-lng");
        var zoom = $item.attr("data-zoom");

        if(typeof zoomInOut == 'undefined' || !zoomInOut) zoomInOut = false;
        if(typeof zoom == 'undefined' || !zoom) zoom = 17;
        if(typeof mapTitle == 'undefined' || !mapTitle) mapTitle = '';
        if(typeof mapContent == 'undefined' || !mapContent) mapContent = '';
        if(typeof useTitle == 'undefined' || !useTitle) useTitle = false;
        if(typeof useContent == 'undefined' || !useContent) useContent = false;

        zoomInOut = JSON.parse(zoomInOut);
        useTitle = JSON.parse(useTitle);
        useContent = JSON.parse(useContent);

        $el.find('.map-wrap').html('<div id="map-container-'+id+'" class="map-container"></div>')

        $el.find('.map-container').attr('data-map_kind', mapKind);
        $el.find('.map-container').attr('data-zoominout', zoomInOut);
        $el.find('.map-container').attr('data-maptitle', mapTitle);
        $el.find('.map-container').attr('data-mapcontent', mapContent);
        $el.find('.map-container').attr('data-usetitle', useTitle);
        $el.find('.map-container').attr('data-usecontent', useContent);

        var container = 'map-container-'+id;

        switch(mapKind) {
            case 'google':
                var mapUrl = $item.attr('data-map_url');
                var map_set = (mapUrl.match(/^@/) !== null) ? 'html' : 'link';
                var map_iframe = '';
                if(map_set == 'html') {
                    map_iframe = decodeURIComponent(atob(mapUrl.replace(/^@/,'')));
                    console.log(map_iframe);
                } else {
                    map_iframe = getMapURL(mapUrl, 'html');
                }
                $el.find('.map-wrap').html(map_iframe);
                break;
            case 'kakao':
                if($el.find('.map-container[data-map_kind="kakao"]').length && (typeof kakao == 'undefined' || typeof kakao.maps == 'undefined' || kakao.maps == null || iVALIDPLAN == '')) {
                    $el.find('.map-wrap').html('지도연결해제됨. Javascript키 확인');
                    $el.find('.map-wrap').html('<iframe class="google-map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.5659473821083!2d127.0282496015659!3d37.494568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca1598c361b2b%3A0xdbf9af292beff3c!2z6rCV64Ko!5e0!3m2!1sko!2skr!4v1637303748377!5m2!1sko!2skr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>');
                } else {
                    var options = { center: new kakao.maps.LatLng(lat, lng), level: 3};
                    var c_map = new kakao.maps.Map($('#' + container).get(0), options);
                    var marker = new kakao.maps.Marker({ position: new kakao.maps.LatLng(lat, lng), map: c_map});

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
                        $('#' + container).append($zoomController);
                        var zoom_slider = $zoomController.find('.zoom-control-slider').slider({
                            'orientation': 'vertical',
                            'min' : 1,
                            'max' : 14,
                            'step' : 1,
                            'value' : 3,
                            'handle' : 'square',
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
                        
                    if(useTitle == true || useContent == true) {
                        var iwContent = '';

                        if(!mapTitle) mapTitle = $.lang[LANG]['config.contact.map.placeholder.place'];
                        if(!mapContent) mapContent = $.lang[LANG]['config.contact.map.placeholder.content'];

                        if(useTitle == true) {
                            iwContent = '<div class="title">' + mapTitle + '</div>';
                        }
                        if(useContent == true) {
                            iwContent += '<div class="content">' + mapContent + '</div>';
                        }
                        // console.log('iwContent', iwContent);
                        if(iwContent) {
                            iwContent = '<div class="contact-map-info-window"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M8 0C4.69 0 2 2.69 2 6s1 4 6 10c5-6 6-6.69 6-10s-2.69-6-6-6zm0 8.3a2.3 2.3 0 1 1 0-4.6 2.3 2.3 0 0 1 0 4.6z"/></svg>' + iwContent + '</div>';
                            var infoWindow = $(iwContent);
                            $('#' + container).append(infoWindow);
                        }
                    }

                    $(window).on("resize", function() {
                        c_map.setCenter(marker.getPosition());
                    });
                    c_map.relayout();
                }
                break;
            case 'naver':
                if($el.find('.map-container[data-map_kind="naver"]').length && (typeof naver == 'undefined' || typeof naver.maps == 'undefined' || naver.maps == null || iVALIDPLAN == '')) {
                    $el.find('.map-wrap').html('지도연결해제됨. Client ID 확인');
                    $el.find('.map-wrap').html('<iframe class="google-map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.5659473821083!2d127.0282496015659!3d37.494568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca1598c361b2b%3A0xdbf9af292beff3c!2z6rCV64Ko!5e0!3m2!1sko!2skr!4v1637303748377!5m2!1sko!2skr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>');
                } else {       
                    var options = { center: new naver.maps.LatLng(lat, lng), zoom: 17};
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
                        $('#' + container).append($zoomController);
                        var zoom_slider = $zoomController.find('.zoom-control-slider').slider({
                            'orientation': 'vertical',
                            'min' : 6,
                            'max' : 21,
                            'step' : 1,
                            'value' : zoom,
                            'handle' : 'square',
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

                    if(useTitle == true || useContent == true) {
                        var iwContent = '';
                        
                        if(!mapTitle) mapTitle = $.lang[LANG]['config.contact.map.placeholder.place'];
                        if(!mapContent) mapContent = $.lang[LANG]['config.contact.map.placeholder.content'];

                        if(useTitle == true) {
                            iwContent = '<div class="title">' + mapTitle + '</div>';
                        }
                        if(useContent == true) {
                            iwContent += '<div class="content">' + mapContent + '</div>';
                        }

                        if(iwContent) {
                            iwContent = '<div class="contact-map-info-window"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M8 0C4.69 0 2 2.69 2 6s1 4 6 10c5-6 6-6.69 6-10s-2.69-6-6-6zm0 8.3a2.3 2.3 0 1 1 0-4.6 2.3 2.3 0 0 1 0 4.6z"/></svg>' + iwContent + '</div>';
                            var infoWindow = $(iwContent);
                            $('#' + container).append(infoWindow);
                            // infoWindow.css('bottom', 'calc(-100% + ' + (infoWindow.outerHeight() + 36) + 'px)');  
                        }
                    }
                    $(window).on("resize", function() {
                        c_map.setCenter(marker.getPosition());
                    });
                }
                break;
        }
    }

    var setDefaultFranchiseMap = function($el) {
        let blocklang = (typeof $el.attr('data-blocklang') != 'undefined')? $el.attr('data-blocklang') : LANG;
        $el.find('.map-search-dropdown .dropdown-menu').html('');
        $el.find('.map-search-dropdown .dropdown-toggle > span').removeClass('selected');
        $el.find('.select-si-do .dropdown-toggle > span').text($.lang[blocklang]['contact.map.search.sido']);
        $el.find('.select-gun-gu .dropdown-toggle > span').text($.lang[blocklang]['contact.map.search.gungu']);
        $el.find('.searchby-storename input').val('');

        $el.find('.map-item-list > .item').removeAttr('style');
        $el.find('.map-item-list > .item').removeClass('__matrix_focus');
        $el.find('.map-item-list > .item').removeClass('hide');
        $el.find('.map-item-list > .item').removeClass('selected');
        $el.find('.map-item-list > .item').eq(0).addClass('selected');
        $el.find('.map-item-list .map-item-empty').remove();

        if($el.find('.map-info').length > 0) {
            $el.find('.map-info').addClass('hide');
            $el.find('.map-info').eq(0).removeClass('hide');
        }

        drawMap($el.find('.map-item-list > .item').eq(0), $el);
    }

    var paginatedItems = new Array();
    var fmapMobilePaging = function($el) { //init
        var $items = $el.find('[data-fmap-loop="true"] > .item:not(.not-result)');
        var itemArr = $items.get();
        var itemsPerPage = ($('body').width() <= 767)? 3 : 8;
        // console.log('itemArr', itemArr);
        if($('body').width() <= 767) {
            if($el.find('[data-fmap-loop="true"]').attr('data-view-m')) itemsPerPage = $el.find('[data-fmap-loop="true"]').attr('data-view-m') * 1;
        } else if($('body').width() <= 991) {
            if($el.find('[data-fmap-loop="true"]').attr('data-view-t')) itemsPerPage = $el.find('[data-fmap-loop="true"]').attr('data-view-t') * 1;
        } else {
            $items.removeClass('hide');
        }
        // console.log('itemsPerPage', itemsPerPage);

        // 전체 페이지 수 계산
        var totalPages = Math.ceil(itemArr.length / itemsPerPage);

        // console.log('totalPages', totalPages);
        if ($('body').width() <= 991) {

            if(totalPages > 1) {
                // 배열을 페이지당 나누기
                var pageNumHTML = '';
                var elname = $el.attr('data-name');
                paginatedItems[elname] = [];
                // console.log(paginatedItems);
                for (var i = 0; i < totalPages; i++) {
                    var start = i * itemsPerPage;
                    var end = start + itemsPerPage;
                    // console.log(start, end);
                    paginatedItems[elname].push(itemArr.slice(start, end));
                }

                var endPage = paginatedItems[elname].length - 1;
                // console.log('paginatedItems[elname]', paginatedItems[elname]);
                $.each(paginatedItems[elname], function(idx, v){
                    var pageNum = idx + 1;
                    pageNumHTML += '<li class="' + (pageNum == 1? 'active' : (pageNum > 5? 'hide' : '')) + '" data-item-page="' + idx + '">'+pageNum+'</li>'
                });

                var paginationHTML = '\
                <ul class="display-flex align-items-center">\
                    <li class="go-start disabled" data-item-page="0"><i class="fa fa-angle-double-left" aria-hidden="true"></i></li>\
                    <li class="go-prev disabled" data-item-page="prev"><i class="fa fa-angle-left" aria-hidden="true"></i></li>\
                    ' + pageNumHTML + '\
                    <li class="go-next" data-item-page="next"><i class="fa fa-angle-right" aria-hidden="true"></i></li>\
                    <li class="go-end" data-item-page="' + endPage + '"><i class="fa fa-angle-double-right" aria-hidden="true"></i></li>\
                </ul>\
                ';

                $el.find('.m-map-pagination').html(paginationHTML);

                $items.addClass('hide');
                $.each(paginatedItems[elname][0], function(idx, v){
                    $(v).removeClass('hide');
                });
            } else {
                $el.find('.m-map-pagination').html('');
            }

            $('.m-map-pagination > ul > li:not(.disabled)').die('click');
            $('.m-map-pagination > ul > li:not(.disabled)').live('click', function(){
                let $this = (typeof isElviewPage != 'undefined' && isElviewPage === true)? $(this).closest('.el_viewblock') : $(this).closest('.element');
                let page = $(this).attr('data-item-page');
                let currentElName = $this.attr('data-name');
                let endPage = $this.find('li.go-end').attr('data-item-page') * 1;
                let activated = $this.find('.m-map-pagination > ul > li.active').attr('data-item-page') * 1;
                let currentItems = new Array();

                $this.find('.m-map-pagination > ul > li').removeClass('active');
                $this.find('.m-map-pagination > ul > li').removeClass('disabled');

                if(isNaN(activated)) activated = endPage;
                // console.log(activated, endPage, paginatedItems[currentElName]);
                switch (page) {
                    case 'prev':
                        if(activated > 0) {
                            page = activated - 1;
                        } else {
                            page = 0;
                        }
                        break;
                    case 'next':
                        if(activated < endPage) {
                            page = activated + 1;
                        } else {
                            page = endPage;
                        }
                        break;
                    default:
                        page = page * 1;
                        break;
                }

                if(page == 0) {
                    $this.find('.m-map-pagination > ul > li.go-start').addClass('disabled');
                    $this.find('.m-map-pagination > ul > li.go-prev').addClass('disabled');
                }
                if(page >= 4) {
                    $this.find('.m-map-pagination > ul > li:not(.go-start):not(.go-end):not(.go-prev):not(.go-next)').addClass('hide');
                    $this.find('.m-map-pagination > ul > li[data-item-page="' + (page - 2) + '"]').removeClass('hide');
                    $this.find('.m-map-pagination > ul > li[data-item-page="' + (page - 1) + '"]').removeClass('hide');
                    $this.find('.m-map-pagination > ul > li[data-item-page="' + page + '"]').removeClass('hide');
                    $this.find('.m-map-pagination > ul > li[data-item-page="' + (page + 1) + '"]').removeClass('hide');
                    $this.find('.m-map-pagination > ul > li[data-item-page="' + (page + 2) + '"]').removeClass('hide');
                } else {
                    $this.find('.m-map-pagination > ul > li:not(.go-start):not(.go-end):not(.go-prev):not(.go-next)').addClass('hide');
                    $this.find('.m-map-pagination > ul > li[data-item-page="0"]').removeClass('hide');
                    $this.find('.m-map-pagination > ul > li[data-item-page="1"]').removeClass('hide');
                    $this.find('.m-map-pagination > ul > li[data-item-page="2"]').removeClass('hide');
                    $this.find('.m-map-pagination > ul > li[data-item-page="3"]').removeClass('hide');
                    $this.find('.m-map-pagination > ul > li[data-item-page="4"]').removeClass('hide');
                }
                if(page == endPage) {
                    $this.find('.m-map-pagination > ul > li.go-end').addClass('disabled');
                    $this.find('.m-map-pagination > ul > li.go-next').addClass('disabled');
                }

                currentItems = paginatedItems[currentElName][page];
                // console.log('currentItems', page, currentItems);
                $this.find('[data-fmap-loop="true"] > .item').addClass('hide');
                if(typeof currentItems != 'undefined') {
                    $.each(currentItems, function(idx, v){
                        // console.log($(v));
                        $(v).removeClass('hide');
                    });
                }

                $this.find('.m-map-pagination > ul > li[data-item-page="' + page + '"]:not(.go-start):not(.go-end)').addClass('active');
            });
        }
    }

    $('#comm-name,#comm-pass').live('blur', function(e) {
        if ($(this).hasClass('guestbook-pass')) return false;
        window.scrollTo(0, 0);
    });
    var getLocation = function(url) {
        var parser = document.createElement('a');
        parser.href = url;
        parser.href = parser.href;

        if (parser.host === '') {
            var newProtocolAndHost = window.location.protocol + '//' + window.location.host;
            if (url.charAt(1) === '/') {
                parser.href = newProtocolAndHost + url;
            } else {
                var currentFolder = ('/' + parser.pathname).match(/.*\//)[0];
                parser.href = newProtocolAndHost + currentFolder + url;
            }
        }
        var properties = ['host', 'hostname', 'hash', 'href', 'port', 'protocol', 'search'];
        for (var i = 0, n = properties.length; i < n; i++) {
            this[properties[i]] = parser[properties[i]];
        }
        this.pathname = (parser.pathname.charAt(0) !== '/' ? '/' : '') + parser.pathname;
    }


    var setResizeImageFolder = function(w, content_image) {
        var magic_type = (PAGE_MODE == 'c') ? SETTINGS.magic_type : property.SETTINGS.magic_type,
            check_magic_type = (typeof magic_type != 'undefined' && magic_type == 'webp') ? true : false;
        t = (check_magic_type) ? '-rw' : '';

        var r = '';
        if (content_image && content_image.lastIndexOf('=') > -1) {
            var image_index = content_image.lastIndexOf('=');
            content_image = content_image.substr(0, image_index);

            switch (w) {

                case "0":
                    r = content_image + '=s0' + t;
                    break;
                case "60":
                    r = content_image + '=w60-h60-n' + t;
                    break;
                case "250":
                    r = content_image + '=w250-h250-n' + t;
                    break;
                case "300":
                    r = content_image + '=w300-h300-n' + t;
                    break;
                case "600":
                    r = content_image + '=w600-h600-n' + t;
                    break;
                case "650":
                    r = content_image + '=w650-h370-n' + t;
                    break;
                case "670":
                    r = content_image + '=w670-h980-n' + t;
                    break;
                case "700":
                    r = content_image + '=w700-h500-n' + t;
                    break;
                case "800":
                    r = content_image + '=w800' + t;
                    break;
                    //case "1920": break;
                default:
                    r = content_image;
                    break;
            }
        }

        return r;
    }

    function changeLanguage(code, mode) {
        var isSYNC = false;

        if (typeof mode != 'undefined' && typeof mode == 'object') isSYNC = false;
        else isSYNC = (typeof mode != 'undefined' && mode && mode.match(/^sync_/gi) !== null) ? true : false;
        var sid = (typeof SID == 'undefined') ? property.SID : SID,
            type = '';

        if (typeof mode == 'undefined') {
            type = (typeof property !== 'undefined' && property.LOAD == 'RENDER') ? 'render' : 'publish';
        } else if (typeof mode == 'object') {
            type = 'board';
        } else {
            type = 'config';

            if (isSYNC) type = mode.replace(/^sync_/gi, '');
        }

        $.post('/language/' + code, { sid: sid, type: type }, function(data) {
            if (isSYNC) {
                // console.log('change language');
                return false;
            } else {
                if (typeof mode == 'undefined') {
                    if (typeof property !== 'undefined' && property.LOAD == 'RENDER') location.href = '/render';
                    else location.href = '/';
                } else if (typeof mode == 'object') {
                    var url = $(mode).attr('data-url');
                    var checkDashboard = '/dashboard';
                    if (window.location.href.indexOf(checkDashboard) > -1) { //dashboard         
                        window.open(url, '_blank').focus();
                    } else {
                        location.href = url;
                    }
                } else {
                    if (mode == 'end_config') {
                        console.log('change language');
                        return false;
                    }
                    location.href = '/' + CONFIG_URL + 'config';
                }
            }
        }, 'json');
    }


    $(document).on('click', '.bizcommpop-open', function(e) {
        var url = 'http://www.ftc.go.kr/bizCommPop.do?wrkr_no=1148687877';
        window.open(url, 'bizCommPop', 'width=750, height=700;');
    });


    function setMadeWithCreatorlink() {
        var s_service = (typeof SERVICE == 'undefined') ? ((typeof property == 'undefined') ? '' : property.SERVICE) : SERVICE,
            s_plantype = (typeof VALIDTYPE == 'undefined') ? ((typeof property == 'undefined') ? '' : property.VALIDTYPE) : VALIDTYPE;

        var checkGabia = (s_service.indexOf('gabia') > -1) ? true : false,
            made_width = (checkGabia && LANG == 'ko') ? 'w-2' : '',
            go_to_link = (checkGabia) ? 'http://creatorlink-gabia.com' : 'http://creatorlink.net?utm_source=FreeSite&utm_medium=banner&utm_campaign=powered_by_Creatorlink&utm_term=sitebanner&utm_content=free',
            go_to_txt = (checkGabia) ? 'footer.made-mark.description.gabia' : 'footer.made-mark.description',
            made_txt = $.lang[LANG]['footer.made-mark.description.title'];
        // upgrade_href = (checkGabia) ? 'href="https://www.gabia.com/mygabia/service" target="_blank"' : 'href="/upgrade/site/"';

        if ($('.dsgn-body').find('.made-with-creatorlink').length > 0) {
            $('.dsgn-body').find('.made-with-creatorlink').show().attr('style', 'display: block!important');
        } else {
            var svg_logo = '<svg class="made-with-creatorlink-logo logo-b logo-p" alt="Creatorlink logo" role="img" viewBox="0 0 168 38"><path class="st11" d="M70.71 12.36c-3.48 0-5.9 2.19-5.9 5.34v4.11c0 3.34 2.17 5.25 5.96 5.25 2.06 0 3.98-0.58 5.41-1.64l0.14-0.11 -1.03-1.95 -0.2 0.1c-1.67 0.85-2.74 1.15-4.11 1.15 -2.23 0-3.23-0.87-3.23-2.83v-0.94h8.62v-3.08C76.37 14.13 74.52 12.36 70.71 12.36zM73.52 18.45h-5.77v-0.92c0-1.91 1.53-2.78 2.96-2.78 2.02 0 2.81 0.78 2.81 2.78V18.45z"></path><path class="st11" d="M84.38 12.36c-1.52 0-3.34 0.55-4.87 1.47l-0.17 0.1 1.11 1.95 0.19-0.1c1.41-0.69 2.48-0.98 3.59-0.98 2.22 0 2.93 0.51 2.93 2.1v1.29h-3.64c-3.09 0-4.65 1.47-4.65 4.37 0 1.22 0.39 2.33 1.09 3.12 0.76 0.85 1.84 1.3 3.12 1.3 0.09 0 0.18 0 0.26-0.01 1.37-0.06 2.71-0.51 3.97-0.99l0.04 0.79h2.76v-9.76C90.11 13.76 88.39 12.36 84.38 12.36zM87.17 23.79l-0.01 0c-0.83 0.32-1.87 0.72-3.2 0.73h-0.06c-1.46 0-2.08-0.6-2.08-2.01 0-1.37 0.55-1.92 1.89-1.92h3.47V23.79z"></path><path class="st11" d="M101.06 24.31c-0.95 0.23-1.63 0.33-2.26 0.33 -1.16 0-1.27-0.36-1.27-1.31v-8.47h3.9l0-2.22h-3.9V9.26l-2.94 0.01v3.38h-2.56v2.22h2.56v8.86c0 2.31 1.18 3.34 3.82 3.34 1.04 0 2.14-0.18 3.11-0.52l0.17-0.06 -0.4-2.23L101.06 24.31z"></path><path class="st11" d="M109.95 12.36c-3.88 0-6.11 1.96-6.11 5.36v3.97c0 3.41 2.23 5.36 6.11 5.36 3.88 0 6.11-1.96 6.11-5.36v-3.97C116.06 14.32 113.84 12.36 109.95 12.36zM113.12 21.78c0 1.89-1.04 2.8-3.17 2.8 -2.13 0-3.17-0.92-3.17-2.8v-4.14c0-1.89 1.04-2.8 3.17-2.8 2.13 0 3.17 0.92 3.17 2.8V21.78z"></path><path class="st11" d="M59.07 14.72l0.01-2.07H56.3v14.13h2.94v-9.04c1.75-1.89 4.2-3.24 4.2-3.24l-1.4-1.84C62.04 12.65 60.26 13.76 59.07 14.72z"></path><path class="st11" d="M121.93 14.72l0.01-2.07h-2.77v14.13h2.94v-9.04c1.75-1.89 4.2-3.24 4.2-3.24l-1.4-1.84C124.91 12.65 123.12 13.76 121.93 14.72z"></path><path class="st11" d="M51.54 22.93c-0.96 1.11-2.12 1.66-3.56 1.66 -2.13 0-3.17-0.92-3.17-2.8v-4.14c0-1.89 1.04-2.8 3.17-2.8 1.73 0 2.83 0.77 3.68 1.52l0.13 0.12 1.99-1.39 -0.13-0.17c-0.76-0.95-2.5-2.55-5.67-2.55 -3.88 0-6.11 1.96-6.11 5.36v3.97c0 3.41 2.23 5.36 6.11 5.36 3.03 0 4.76-1.58 5.68-2.91l0.13-0.18 -2.13-1.18L51.54 22.93z"></path><rect x="128.71" y="6.68" class="st11" width="1.2" height="20.07"></rect><rect x="134.41" y="12.69" class="st11" width="1.2" height="14.06"></rect><rect x="134.41" y="8.29" class="st11" width="1.2" height="2.18"></rect><path class="st11" d="M148.67 13.44c-1.68-0.98-5.06-0.52-7.21 0.71V12.5h-1.2v14.25h1.2V15.33c1.74-1.3 5.26-1.79 6.61-1 1.38 0.81 1.38 2.37 1.38 2.43v9.99h1.2v-9.99C150.65 16.67 150.63 14.59 148.67 13.44z"></path><polygon class="st11" points="158.27 18.97 164.05 12.69 162.6 12.69 156 19.89 156 6.68 154.8 6.68 154.8 26.75 156 26.75 156 21.44 157.54 19.77 163.6 26.75 165 26.75 "></polygon><path class="st11" d="M3 10.79L3 10.79l0 16.42 14.22 8.21 14.22-8.21V10.79L17.22 2.58 3 10.79zM26.7 13.53L26.7 13.53 26.7 13.53l-4.74 2.74h0l-4.74-2.74 -4.74 2.74v5.47l4.74 2.74 4.74-2.74 4.74 2.74 -9.48 5.47 -9.48-5.47V13.53l9.48-5.47L26.7 13.53 26.7 13.53z"></path></svg>',
                svg_logo_m = '<svg class="made-with-creatorlink-logo logo-b logo-m" alt="Creatorlink logo" viewBox="0 0 26 30" width="26" height="30"><path class="st11" d="M1 8.1L1 8.1V22l12 6.9L25 22V8.1L13 1.2 1 8.1zM21 10.5L21 10.5 21 10.5l-4 2.3 0 0 -4-2.3 -4 2.3v4.6l4 2.3 4-2.3 4 2.3 -8 4.6L5 19.7v-9.2l8-4.6L21 10.5 21 10.5z"/></svg>',
                str = '\
                    <div class="made-with-creatorlink ' + made_width + '" alt="' + made_txt + '" title="' + made_txt + '">\
                        <a class="made-creatorlink-link" href="' + go_to_link + '" target="_blank">\
                            <div class="inner-logo">' + svg_logo + svg_logo_m + '</div>\
                            <div class="inner-txt">\
                                <ul>\
                                    <li>' + $.lang[LANG][go_to_txt + '.1'] + '</li>\
                                    <li>' + $.lang[LANG][go_to_txt + '.2'] + '</li>\
                                </ul>\
                            </div>\
                            <div class="inner-btn"><span>' + $.lang[LANG]['footer.made-mark.btn'] + '</span></div>\
                        </a>\
                    </div>\
                ';
            $('.dsgn-body').append(str);

            var mwcRollingId = new Interval(mwcRollingStart, 3000);
            mwcRollingId.start();
        }
    }

    function setMadeWithCreatorlinkOld() {
        var host = (typeof SERVICE == 'undefined') ? property.SERVICE : SERVICE,
            made_width = (host.indexOf('gabia') > -1 && LANG == 'ko') ? 'w-2' : '',
            go_to_link = (host.indexOf('gabia') > -1) ? 'http://creatorlink-gabia.com' : 'http://creatorlink.net?utm_source=FreeSite&utm_medium=banner&utm_campaign=powered_by_Creatorlink&utm_term=sitebanner&utm_content=free',
            go_to_txt = (host.indexOf('gabia') > -1) ? 'footer.made-mark.description.gabia' : 'footer.made-mark.description',
            made_txt = $.lang[LANG]['footer.made-mark.description.title'];

        if ($('.dsgn-body').find('.made-with-creatorlink').length > 0) {
            $('.dsgn-body').find('.made-with-creatorlink').show().attr('style', 'display: block!important');
        } else {
            var svg_logo = '<svg class="made-with-creatorlink-logo" viewBox="0 0 26 30" width="26" height="30"><path class="st11" d="M1 8.1L1 8.1V22l12 6.9L25 22V8.1L13 1.2 1 8.1zM21 10.5L21 10.5 21 10.5l-4 2.3 0 0 -4-2.3 -4 2.3v4.6l4 2.3 4-2.3 4 2.3 -8 4.6L5 19.7v-9.2l8-4.6L21 10.5 21 10.5z"/></svg>',
                str = '\
                    <div class="made-with-creatorlink ' + made_width + '" alt="' + made_txt + '" title="' + made_txt + '">\
                        <a class="made-creatorlink-link" href="' + go_to_link + '" target="_blank">\
                            <div class="inner-logo">' + svg_logo + '</div>\
                            <div class="inner-txt">\
                                <ul>\
                                    <li>' + $.lang[LANG][go_to_txt + '.1'] + '</li>\
                                    <li>' + $.lang[LANG][go_to_txt + '.2'] + '</li>\
                                </ul>\
                            </div>\
                        </a>\
                    </div>\
                ';
            $('.dsgn-body').append(str);

            var mwcRollingId = new Interval(mwcRollingStart, 3000);
            mwcRollingId.start();
        }
    }

    function mwcRollingStart() {
        var $mwcUl = $('.made-with-creatorlink').find('ul'),
            $mwcHeight = $mwcUl.children().outerHeight(),
            $length = $mwcUl.children().length;

        $mwcUl.css('height', $mwcHeight + 'px');
        $mwcUl.animate({ top: -$mwcHeight + 'px' }, 1000, 'easeInOutQuart', function() {
            $(this).append($(this).find('li:first').clone().wrapAll('<li/>').parent().html());

            $(this).find('li:first').remove();
            $(this).css('top', 0);
        });
    }

    function Interval(fn, time) {
        var timer = false;
        this.start = function() {
            if (!this.isRunning())
                timer = setInterval(fn, time);
        };
        this.stop = function() {
            clearInterval(timer);
            timer = false;
        };
        this.isRunning = function() {
            return timer !== false;
        };
    }

    function siteNotice(fn, checkDouble, mode, sidchk) {
        var s_service = (typeof SERVICE == 'undefined') ? ((typeof property == 'undefined') ? '' : property.SERVICE) : SERVICE,
            s_plantype = (typeof VALIDTYPE == 'undefined') ? ((typeof property == 'undefined') ? '' : property.VALIDTYPE) : VALIDTYPE;

        var mode = (mode) ? mode : 'dashbord',
            checkDouble = (typeof checkDouble != 'undefined' && checkDouble) ? checkDouble : '',
            checkGabia = (s_service.indexOf('gabia') > -1 || (typeof rt_service != 'undefined' && rt_service == 'ga')) ? true : false,
            checkGabiaOther = ['manager', 'shopping', 'nickname', 'language', 'chmod', 'chmod.group', 'chmod.commentLevel', 'siteclone'],
            description_other = (checkGabia) ? (($.inArray(fn, checkGabiaOther) > -1) ? '.GA' : '') : '',
            upgrade_url = (checkGabia) ? 'https://www.gabia.com/mygabia/service" target="_blank' : ((fn == 'shopping') ? '/shoppingevent' : '/upgrade/site/'),
            sidchk = (sidchk) ? sidchk : '';

        // if(fn == 'gabia.bn.chmod') {
        //     fn = 'chmod';
        //     description_other = '.GA';
        //     upgrade_url = '/manager/member';

        var modal_title = $.lang[LANG]['dashbord.upgrade.' + fn + '.title' + description_other];
            modal_description = $.lang[LANG]['dashbord.upgrade.' + fn + '.description' + description_other],
            modal_class = 'cl-cmmodal cl-s-btn w560 cl-p130 cl-p0';

        if (fn == 'kakao_onlynumber') {
            modal_title = $.lang[LANG]['site.delete.process.end.title'];
            modal_description = $.lang[LANG]['shopping.dashboard.kakaoNotice.onlynumber'];
        }
        if (fn == 'kakao_number_length') {
            modal_title = $.lang[LANG]['site.delete.process.end.title'];
            modal_description = $.lang[LANG]['shopping.dashboard.kakaoNotice.numlength'];
        }
        if (fn == 'kakao_dupnumber') {
            modal_title = $.lang[LANG]['site.delete.process.end.title'];
            modal_description = $.lang[LANG]['shopping.dashboard.kakaoNotice.dupnumber'];
        }
        if (fn == 'notificationtalkmail') {
            modal_title = $.lang[LANG]['dashbord.upgrade.kakaoemail.title'];
            modal_description = $.lang[LANG]['dashbord.upgrade.kakaoemail.description'];
        }
        if (fn == 'notificationtalkmailgabia') {
            modal_title = $.lang[LANG]['dashbord.upgrade.kakaoemail.title'];
            modal_description = $.lang[LANG]['dashbord.upgrade.kakaoemailgabia.description'];
        }
        if (fn == 'kakaoShoppingDisable') {
            modal_title = $.lang[LANG]['dashbord.upgrade.kakaodisable.title'];
            modal_description = $.lang[LANG]['dashbord.upgrade.kakaodisable.description'];
        }
        if (fn == 'go_upgradepage') {
            modal_title = $.lang[LANG]['dashbord.upgrade.transfer.title'];
            modal_description = $.lang[LANG]['dashbord.upgrade.transfer.description'];
        }

        switch(fn) {
            case 'metaDetail':
            case 'metaPlus':
            case 'metaOnepage':
                modal_title = $.lang[LANG]['dashbord.upgrade.meta.title'];
                break;
            case 'sitelimit':
                modal_title = $.lang[LANG]['dashbord.upgrade.siteclone.title'];
                break;
            case 'chmod.group':
                if (s_plantype == 'BN') modal_description = $.lang[LANG]['dashbord.upgrade.chmod.group.description.bn'];
                break;
            case 'chmod.commentLevel':
                if (checkGabia && $('.' + selectEL).is('[data-type="gallery"]')) modal_title = $.lang[LANG]['dashbord.upgrade.chmod.commentLevel.gallery.title.GA'];
                break;
            case 'cert':
                modal_class = 'cl-cmmodal cl-s-btn w560 cl-p70 cl-p0 site-not-cert-modal';
                break;
            case 'menufixbtn':
            case 'menufixlang':
                modal_title = $.lang[LANG]['config.upgrade.'+fn+'.title'];
                modal_description = (checkGabia) ? $.lang[LANG]['config.upgrade.' + fn + '.description.gabia'] : $.lang[LANG]['config.upgrade.' + fn + '.description'];
                break;
            case 'kakao_onlynumber':
                modal_title = $.lang[LANG]['site.delete.process.end.title']; 
                modal_description = $.lang[LANG]['shopping.dashboard.kakaoNotice.onlynumber'];
                break;
            case 'kakao_number_length':
                modal_title = $.lang[LANG]['site.delete.process.end.title']; 
                modal_description = $.lang[LANG]['shopping.dashboard.kakaoNotice.numlength'];
                break;
            case 'kakao_dupnumber':
                modal_title = $.lang[LANG]['site.delete.process.end.title']; 
                modal_description = $.lang[LANG]['shopping.dashboard.kakaoNotice.dupnumber'];
                break;
            case 'notificationtalkmail':
                modal_title = $.lang[LANG]['dashbord.upgrade.kakaoemail.title']; 
                modal_description = $.lang[LANG]['dashbord.upgrade.kakaoemail.description'];
                break;
            case 'kakaoShoppingDisable':
                modal_title = $.lang[LANG]['dashbord.upgrade.kakaodisable.title']; 
                modal_description = $.lang[LANG]['dashbord.upgrade.kakaodisable.description'];
                break;
            case 'go_upgradepage':
                modal_title = $.lang[LANG]['dashbord.upgrade.transfer.title'];
                modal_description = $.lang[LANG]['dashbord.upgrade.transfer.description'];  
                break;
            default:
                break;
        }


        var btnstr = '\
                <div class="btn-box">\
                    <a href="' + upgrade_url + '" id="upgrade-usemember-link" class="btn" target="_blank">\
                    <svg viewBox="0 0 18 18" width="18" height="18"><polygon points="9 0 1 8 5 8 5 11 13 11 13 8 17 8 "/><rect x="5" y="13" width="8" height="2"/><rect x="5" y="17" width="8" height="1"/></svg>' + $.lang[LANG]['dashbord.toolbar.upgrade-site'] + '</a>\
                    <button type="button" class="btn btn-default btn-sm close-button-dialog" data-dismiss="modal">' + $.lang[LANG]['config.close'] + '</button>\
                </div>\
        ';
        if (fn == 'sitelimit') {
            btnstr = '\
                <div class="btn-box btn-closeOnly">\
                    <button type="button" class="btn btn-default btn-sm close-button-dialog" data-dismiss="modal">' + $.lang[LANG]['config.close'] + '</button>\
                </div>\
            ';
        } else if (fn == 'kakaoShoppingDisable') {
            btnstr = '\
                    <div class="btn-box">\
                        <a href="' + upgrade_url + '" id="upgrade-usemember-link" class="btn" target="">\
                        <svg viewBox="0 0 18 18" width="18" height="18"><polygon points="9 0 1 8 5 8 5 11 13 11 13 8 17 8 "/><rect x="5" y="13" width="8" height="2"/><rect x="5" y="17" width="8" height="1"/></svg>' + $.lang[LANG]['dashbord.toolbar.upgrade-site'] + '</a>\
                        <button type="button" class="btn btn-default btn-sm close-button-dialog" data-dismiss="modal">' + $.lang[LANG]['config.close'] + '</button>\
                    </div>\
            ';
        } else if (fn == 'go_upgradepage' || fn == 'siteclone') {
            btnstr = '\
                    <div class="btn-box">\
                        <a href="' + upgrade_url + sidchk + '" id="upgrade-usemember-link" class="btn" target="">\
                        <svg viewBox="0 0 18 18" width="18" height="18"><polygon points="9 0 1 8 5 8 5 11 13 11 13 8 17 8 "/><rect x="5" y="13" width="8" height="2"/><rect x="5" y="17" width="8" height="1"/></svg>' + $.lang[LANG]['dashbord.toolbar.upgrade-site'] + '</a>\
                        <button type="button" class="btn btn-default btn-sm close-button-dialog" data-dismiss="modal">' + $.lang[LANG]['config.close'] + '</button>\
                    </div>\
            ';
        } else if (fn == 'kakao_number_length' || fn == 'kakao_onlynumber' || fn == 'kakao_dupnumber') {
            btnstr = '\
                <div class="btn-box btn-closeOnly">\
                    <button type="button" class="btn btn-default btn-sm close-button-dialog" data-dismiss="modal">' + $.lang[LANG]['config.close'] + '</button>\
                </div>\
            ';
        }
        var str = '\
            <div class="site-upgrade-notice">\
                <p><span class="text-centermodal">' + modal_description + '</span></p>\
                ' + btnstr +
            '</div>\
        ';

        // $(this).showModalFlat(modal_title, str, false, false, '', '', '', modal_class, '', '', '', function() {
        //     if (checkDouble) $('.modal.modal-default.fade.in').css('zIndex', '');

        $(this).showModalFlat(modal_title, str,false,false,'','','',modal_class,'','','',function(){
            if(checkDouble) {$('.modal.modal-default.fade.in').css('zIndex','');}
        });
    }

    function hideMadeWithCreatorlink() {
        $('.goto-top').removeClass('moved');
        $('#cl-music-player-icon').removeClass('moved');
        $('.made-with-creatorlink').hide();
    }

    function sites(s) {
        var sites_deferred = $.Deferred();
        if (typeof s == 'undefined') sites_deferred.reject('sid Undefined :(');
        else {
            $.ajax({
                url: '/template/publishSites',
                data: { sid: s },
                type: 'POST',
                dataType: 'json',
                async: true,
                cashe: false,
                success: function(data) {
                    if (typeof data.error != 'undefined' && data.error) {
                        sites_deferred.reject(data.error);
                        return false;
                    }

                    sites_deferred.resolve(data);
                }
            });
        }
        return sites_deferred.promise();
    }

    function pbSite(s, onoff) {
        var pbSite_deferred = $.Deferred();
        if (typeof s == 'undefined') pbSite_deferred.reject('sid Undefined :(');
        else {
            $.ajax({
                url: '/template/publish1',
                data: { sid: s, onoff: onoff },
                type: 'POST',
                dataType: 'json',
                async: true,
                cashe: false,
                success: function(data) {
                    if (typeof data.error != 'undefined' && data.error) {
                        pbSite_deferred.reject(data.error);
                        return false;
                    }

                    pbSite_deferred.resolve(data);
                }
            });
        }
        return pbSite_deferred.promise();
    }

    function pbGallery(s, onoff, count, p, sCount, i) {
        var pbGallery_deferred = $.Deferred();
        if (typeof s == 'undefined') pbGallery_deferred.reject('sid Undefined :(');
        else {
            $.ajax({
                url: '/template/publish2',
                data: { sid: s, onoff: onoff, count: count, p: p + 1, sCount: sCount, i: i },
                type: 'POST',
                dataType: 'json',
                async: true,
                cashe: false,
                success: function(data) {
                    if (typeof data.error != 'undefined' && data.error) {
                        pbGallery_deferred.reject(data.error);
                        return false;
                    }

                    pbGallery_deferred.resolve(data);
                }
            });
        }
        return pbGallery_deferred.promise();
    }

    function pbPages(s, onoff, count, p, sCount, i) {
        var pbPages_deferred = $.Deferred();
        if (typeof s == 'undefined') pbPages_deferred.reject('sid Undefined :(');
        else {
            $.ajax({
                url: '/template/publish3',
                data: { sid: s, onoff: onoff, count: count, p: p + 1, sCount: sCount, i: i },
                type: 'POST',
                dataType: 'json',
                async: true,
                cashe: false,
                success: function(data) {
                    if (typeof data.error != 'undefined' && data.error) {
                        pbPages_deferred.reject(data.error);
                        return false;
                    }

                    pbPages_deferred.resolve(data);
                }
            });
        }
        return pbPages_deferred.promise();
    }

    function clearData(type, s, onoff, count, p) {
        return $.ajax({
            url: '/template/clear',
            data: { type: type, sid: s, count: count, p: p + 1, onoff: onoff },
            type: 'POST',
            dataType: 'json',
            async: true,
            cashe: false,
            success: function(data) {
                console.log(data);
            }
        });
    }

    function user_location() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var ip = this.responseText,
                    sid = (typeof property.SID) ? property.SID : '',
                    refer = (typeof property.VIREFER) ? property.VIREFER : '';
                if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip) && sid) {
                    $.ajax({
                        type: 'POST',
                        url: '/template/visitor/' + sid,
                        data: { ip: ip, refer: refer },
                        dataType: 'json',
                        async: true,
                        cache: false,
                        success: function(r) {
                            // console.log(r);
                        }
                    });
                }
            }
        };
        xhttp.open('GET', '//api.ip.pe.kr', true);
        // xhttp.open('GET', '//api.ipify.org', true);
        xhttp.send();
    }

    function getProgressWidth() {
        var $p = $('.progress-bar');
        return $p.width() / $p.parent().width() * 100;
    }

    var checkError = function(data) {
        if (typeof data.error != "undefined" && data.error) {
            // alert(data.error);
            if (data.error == "No user data") {
                internalLink = true;
                // location.replace('/member/login');
                if (CONFIG_URL) location.replace('/_admin');
                setTimeout(function() {
                    if (typeof hideAllModal == 'function') hideAllModal();
                    var modal = $(this).showModalFlat('<img src="https://storage.googleapis.com/i.addblock.net/modal-logo-dark.png" alt="creaotrlink logo"/>', loginForm(), true, true, function() {}, 'cancel', 'w450');
                    $('.flat-modal .modal-footer').hide();
                    $('.modal-default[id*=flat-modal] .modal-dialog .modal-body').css('margin', '55px 45px 35px');
                    $('.modal-default[id*=flat-modal]').css('z-index', '1041');
                    $('.flat-modal').next('.modal-backdrop').css('z-index', '1040');
                }, 500);
            } else {
                $.processOFF();
                alert(data.error);
            }
            return false;
        } else {
            internalLink = false;
            return true;
        }
    }

    $(document)
        .off('keypress', 'input[expComma]')
        .on('keypress', 'input[expComma]', function(e) {
            var key = (e.which) ? e.which : e.keyCode;
            if (key == 44) return false;
    });

    $(document)
        .off('blur', 'input[numberOnly]')
        .on('blur', 'input[numberOnly]', function(e) {
            var val = $(this).val();
            var r = val.replace(/[^\d,]/g, '');

            if ($(this).hasClass('isFloat')) {
                r = val.replace(/[^\d.,]/g, '');
            } else if ($(this).attr('class') && $(this).attr('class').indexOf('price') > -1) {
                r = val.replace(/[^\d.,-]/g, '');
            }

            $(this).val(r);
        });

    $(document)
        .off('keypress', 'input[numberOnly]')
        .on('keypress', 'input[numberOnly]', function(e) {
            var key = (e.which) ? e.which : e.keyCode,
                sign = ($(this).hasClass('sign')) ? true : false,
                float = $(this).hasClass('isFloat') ? true : false;
            if (key > 47 && key < 58) {
                return true;
            } else if (sign && (key == 43 || key == 45)) {
                return true;
            } else if (float && key == 46 && $(this).val().indexOf('.') == -1) {
                return true;
            } else {
                return false;
            }
        });

    $(document)
        .off('keyup', 'input[numberOnly]')
        .on('keyup', 'input[numberOnly]', function(e) {
            var n = addCommas($(this).val().replace(/[^0-9.+-]/g, ""));
            $(this).val(n);
        });

    function addCommas(x) {
        if (x.length == 0) return '';
        x = String(x);
        var l = x.split(""),
            zero = true;
        $.each(l, function(i, v) {
            if (x.charAt(0) == '+' || x.charAt(0) == '-') {
                var sign = x.charAt(0);
                if (x.charAt(1) == "0") {
                    x = x.substr(2);
                    x = sign + x;
                } else if (x.charAt(1) == '+' || x.charAt(1) == '-') {
                    x = x.substr(1);
                }
            } else if (x.charAt(0) == "0" && x.length > 1 && x.indexOf('.') == -1) {
                x = x.substr(1);
            }
        });

        if (x.length > 0 && x.indexOf('.') > -1) return x;
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function removeCommas(x) {
        if (!x || x.length == 0) return "";
        if (x == "0" || x == 0) return 0;
        else return x.split(",").join("");
    }


    function inputNumberFormat(obj) {
        obj.value = comma(uncomma(obj.value));
    }

    function comma(str) {
        str = String(str);
        return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    }

    function uncomma(str) {
        str = String(str);
        return str.replace(/[^\d]+/g, '');
    }


    function formTranslate(l) {
        if (l != 'ko') {
            $('select[form-type="select"] option:selected').text('Select');
        }
    }

    function changeFavicon(src) {
        document.head = document.head || document.getElementsByTagName('head')[0];
        var link = document.createElement('link'),
            oldLink = document.getElementById('dynamic-favicon');

        link.id = 'dynamic-favicon';
        link.type = 'image/x-icon';
        link.rel = 'icon';
        link.href = src;
        if (oldLink) {
            document.head.removeChild(oldLink);
        }
        document.head.appendChild(link);
    }

    function occurrences(string, subString, allowOverlapping) {
        string += "";
        subString += "";
        if (subString.length <= 0) return (string.length + 1);

        var n = 0,
            pos = 0,
            step = allowOverlapping ? 1 : subString.length;

        while (true) {
            pos = string.indexOf(subString, pos);
            if (pos >= 0) {
                ++n;
                pos += step;
            } else break;
        }
        return n;
    }

    function errorTag(tag) {
        var divStart = occurrences(tag, '<div', false),
            divEnd = occurrences(tag, '</div>', false);

        if (divStart != divEnd) return true;
        return false;
    }


    function errorWorkingEmojisModal(closecallback, showcallback, hidecallback) {
        if ($('.cl-cmmodal.error-emoji').length > 0) return false;

        if (typeof showcallback == 'undefined' || showcallback == '') {
            showcallback = function() {
                $('.modal-dialog.error-emoji').closest('.flat-modal').next('.modal-backdrop').attr('style', 'display: block; z-index: 1042!important;');
                $('.modal-dialog.error-emoji').closest('.modal').attr('style', 'display: block; z-index: 1043');
            }
        }

        $(this).showModalFlat($.lang[LANG]['config.information'], $.lang[LANG]['config.working.emoji'], true, false, '', 'ok', '', 'cl-cmmodal cl-s-btn w560 cl-p130 cl-p0 cl-okbtn-pbt70 error-emoji', '', closecallback, showcallback, hidecallback);
    }

    function errorEmojisModal(modal_zindex, closecallback, showcallback, hidecallback) {
        if ($('.cl-cmmodal.error-emoji').length > 0) return false;
        var modal_size = (typeof modal_zindex != 'undefined' && modal_zindex) ? 'zindex'+modal_zindex : 'zindex1043';
        $(this).showModalFlat($.lang[LANG]['config.information'], $.lang[LANG]['config.unable.emoji'], true, false, '', 'ok', '', 'cl-cmmodal cl-s-btn w560 cl-p130 cl-p0 cl-okbtn-pbt70 error-emoji '+modal_size, '', closecallback, showcallback, hidecallback);
    }

    function checkEmojis(str) {
        var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff]|&zwj;)/g;
        return regex.test(str);
    }

    function removeEmojis(str) {
        var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff]|&zwj;)/g;
        return str.replace(regex, '');
    }



    function changeEmoji(str, op, usedDeferred) {
        if (typeof op == 'undefined' || (op != 'encode' && op != 'decode')) return str;
        if (typeof usedDeferred != 'boolean') usedDeferred = false;

        if (usedDeferred) {
            var deferred = $.Deferred();
            $.post('/template/emoji', { str: str, op: op }, function(data) {
                deferred.resolve(data.str);
            }, 'json');
            return deferred.promise();
        } else {
            $.post('/template/emoji', { str: str, op: op }, function(data) {
                return data.str;
            }, 'json');
        }
    }


    function strReplace(str, searchStr, replaceStr) {
        return str.split(searchStr).join(replaceStr);
    }

    function checkBase64Encode(str) {
        var regExp = /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i;
        return (str.length % 4 == 0) && regExp.test(str);
    }

    function number_format(val) {
        let parts = val.toString().split("."); 
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
        return parts.join(".");
    }
//
    function checkTemplateSite(sid) {
        var checkTemp = (PAGE_MODE == 'c') ? CHECKTEMP : property.CHECKTEMP;
        if(typeof checkTemp == 'undefined') return false;
        if (!sid || !checkTemp) return false;
        var templates_lang = ['ko', 'en'],
            // 라이브 백업 코드 
            // templates_org = ["pardinus","otocyon","fulica","phocoena","tremarctos","mysticetus","nigripes","pteromys","guanicoe","civettina","viverra","simensis", "euryzona", "leopardus", "gryphus", "rubicola", "wintoni", "iliensis", "javan", "acinonyx", "ochotona", "tayra", "fennec", "beluga", "itatsi", "pennantii", "luscinius", "kidogo", "rourei", "graysoni", "pagensis", "lilliae", "inscinius", "diazi", "gerpi", "lutreola", "walie", "gambieri", "saola", "waldeni", "indri", "jefferyi"],        
            templates_org = [
                "aves","habroptila","vultur","pardinus","otocyon","fulica","phocoena","tremarctos","mysticetus","nigripes","pteromys","guanicoe","civettina","viverra","simensis", "euryzona", "leopardus", "gryphus", "rubicola", "wintoni", "iliensis", "javan", "acinonyx", "ochotona", "tayra", "fennec", "beluga", "itatsi", "pennantii", "luscinius", "kidogo", "rourei", "graysoni", "pagensis", "lilliae", "inscinius", "diazi", "gerpi", "lutreola", "walie", "gambieri", "saola", "waldeni", "indri", "jefferyi", "theropithecus", "pelzelni",
                "template001", "template002", "template003", "template004", "template005", "template006", "template007", "template008", "template009",
                "plutolabs","smc","cloudia","eunoia","saladly",
                "academy02","academy03","academy04","academy05",
                "company02","company03","company04","company05","company06","company07",
                "beauty01","beauty02","beauty03","beauty04","beauty05","beauty06",
                "culture01","culture02","culture03","culture05","culture06","culture07","culture08",
                "sports03","sports04",
                "cafe04","cafe05",
                "house02","house05",
                "portfolio16","portfolio06","portfolio22","portfolio23",
                "product02","franchise01","franchise02"
            ],
            // templates_org = ["aves","habroptila","vultur","pardinus","otocyon","fulica","phocoena","tremarctos","mysticetus","nigripes","pteromys","guanicoe","civettina","viverra","simensis", "euryzona", "leopardus", "gryphus", "rubicola", "wintoni", "iliensis", "javan", "acinonyx", "ochotona", "tayra", "fennec", "beluga", "itatsi", "pennantii", "luscinius", "kidogo", "rourei", "graysoni", "pagensis", "lilliae", "inscinius", "diazi", "gerpi", "lutreola", "walie", "gambieri", "saola", "waldeni", "indri", "jefferyi", "theropithecus", "pelzelni",
            //                  "template001", "template002", "template003", "template004", "template005", "template006", "template007", "template008", "template009",
            //                  "plutolabs","smc","cloudia","eunoia","saladly",
            //                  "academy02","academy03","company02","company03","company04","company05","company06","company07",
            //                  "beauty01","beauty02","beauty03","beauty04","beauty05","beauty06","sports03","sports04","cafe04","cafe05","academy04","academy05",
            //                  "culture01","culture02","culture03","culture05","culture06","culture07","culture08","product02","house02","house05","portfolio06","portfolio16"],
            templates = [],
            templates_admin = [];


        $.each(templates_org, function(i, v) {
            $.each(templates_lang, function(a, b) {
                templates_admin.push(v + '_' + b);
            });
        });

        templates = templates_admin.concat(templates_org);

        var is_templates = ($.inArray(sid.toLowerCase(), templates) > -1) ? true : false;

        return is_templates;
    }

    jQuery.fn.serializeObject = function() {
        var obj = null;
        try {
            if (this[0].tagName && this[0].tagName.toUpperCase() == "FORM") {
                var arr = this.serializeArray();
                if (arr) {
                    obj = {};
                    jQuery.each(arr, function() {
                        obj[this.name] = this.value;
                    });
                } //if ( arr ) {
            }
        } catch (e) {
            alert(e.message);
        } finally {}
        return obj;
    }

    function errorCss(css) {
        css = css.replace(/::/g, '');
        var cssStart = occurrences(css, '{', false),
            cssEnd = occurrences(css, '}', false),
            pStart = occurrences(css, ':', false),
            pEnd = occurrences(css, ';', false),
            min = occurrences(css, '(min-width', false),
            min2 = occurrences(css, '( min-width', false),
            max = occurrences(css, '(max-width', false),
            max2 = occurrences(css, '( max-width', false),
            hover = occurrences(css, ':hover', false),
            active = occurrences(css, ':active', false),
            focus = occurrences(css, ':focus', false),
            before = occurrences(css, ':before', false),
            after = occurrences(css, ':after', false),
            empty = occurrences(css, ':empty', false),
            not = occurrences(css, ':not', false),
            css_is = occurrences(css, ':is', false),
            checked = occurrences(css, ':checked', false),
            first = occurrences(css, ':first-child', false),
            last = occurrences(css, ':last-child', false),
            first_letter = occurrences(css, ':first-letter', false),
            first_line = occurrences(css, ':first-line', false),
            first_of_type = occurrences(css, ':first-of-type', false),
            nth = occurrences(css, ':nth', false),
            nth_even = occurrences(css, ':nth-child(even)', true),
            nth_odd = occurrences(css, ':nth-child(odd)', true),
            holder1 = occurrences(css, ':-webkit-input-placeholder', false),
            holder2 = occurrences(css, ':-moz-placeholder', false),
            holder3 = occurrences(css, ':-ms-input-placeholder', false),
            media_controls = occurrences(css, ':-webkit-media-controls', false),
            select_icon = occurrences(css, ':-ms-expand', false),
            scrollbar1 = occurrences(css, ':-webkit-scrollbar', false),
            scrollbar2 = occurrences(css, ':-webkit-scrollbar-track', false),
            scrollbar3 = occurrences(css, ':-webkit-scrollbar-thumbr', false),
            https = occurrences(css, 'https:', false),
            http = occurrences(css, 'http:', false);

        if (rt_admin == "admin") {
            console.log('{', cssStart);
            console.log('}', cssEnd);
            console.log(':', pStart);
            console.log(';', pEnd);
            console.log('media css', (min + min2 + max + max2));
            console.log('hover', hover);
            console.log('active', active);
            console.log('focus', focus);
            console.log('before', before);
            console.log('after', after);
            console.log('empty', empty);
            console.log('not', not);
            console.log('css_is', css_is);
            console.log('checked', checked);
            console.log('first-child', first);
            console.log('last-child', last);
            console.log('first-letter', first_letter);
            console.log('first-line', first_line);
            console.log('first-of-type', first_of_type);
            console.log('nth', nth);
            console.log('nth-even', nth_even);
            console.log('nth-odd', nth_odd);
            console.log('holder', (holder1 + holder2 + holder3));
            console.log('video-controls(::-webkit-media-controls)', media_controls);
            console.log('select-icon(::-ms-expand)', select_icon);
            console.log('scrollbar', scrollbar1);
            console.log('scrollbar-track', scrollbar2);
            console.log('scrollbar-thumb', scrollbar3);
            console.log('https:', https);
            console.log('http:', http);
        }
        if (cssStart != cssEnd) return true;
        if (pStart != (pEnd + min + min2 + max + max2 + hover + active + focus + before + after + empty + not + css_is + checked + first + last + first_letter + first_line + first_of_type + nth + holder1 + holder2 + holder3 + media_controls + select_icon + scrollbar1 + scrollbar2 + scrollbar3 + https + http)) return true;
        return false;
    }

    if (typeof(MD5_JS) == 'undefined') {
        var MD5_JS = true;
        var hexcase = 0;
        var b64pad = "";
        var chrsz = 8;

        function hex_md5(s) { return binl2hex(core_md5(str2binl(s), s.length * chrsz)); }

        function b64_md5(s) { return binl2b64(core_md5(str2binl(s), s.length * chrsz)); }

        function str_md5(s) { return binl2str(core_md5(str2binl(s), s.length * chrsz)); }

        function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }

        function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }

        function str_hmac_md5(key, data) { return binl2str(core_hmac_md5(key, data)); }

        function core_md5(x, len) {
            x[len >> 5] |= 0x80 << ((len) % 32);
            x[(((len + 64) >>> 9) << 4) + 14] = len;
            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;
            for (var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;
                a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
                d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
                d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
                b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
                a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
                a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
                a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
                d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
                c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
                a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
                d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
                a = safe_add(a, olda);
                b = safe_add(b, oldb);
                c = safe_add(c, oldc);
                d = safe_add(d, oldd);
            }
            return Array(a, b, c, d);
        }

        function md5_cmn(q, a, b, x, s, t) { return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b); }

        function md5_ff(a, b, c, d, x, s, t) { return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t); }

        function md5_gg(a, b, c, d, x, s, t) { return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t); }

        function md5_hh(a, b, c, d, x, s, t) { return md5_cmn(b ^ c ^ d, a, b, x, s, t); }

        function md5_ii(a, b, c, d, x, s, t) { return md5_cmn(c ^ (b | (~d)), a, b, x, s, t); }

        function SHA256(s) {
            var chrsz   = 8;
            var hexcase = 0;

            function safe_add (x, y) {
                var lsw = (x & 0xFFFF) + (y & 0xFFFF);
                var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                return (msw << 16) | (lsw & 0xFFFF);
            }

            function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
            function R (X, n) { return ( X >>> n ); }
            function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
            function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
            function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
            function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
            function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
            function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
            function core_sha256(m, l) {
                var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 
                    0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 
                    0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 
                    0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 
                    0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 
                    0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 
                    0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 
                    0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 
                    0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 
                    0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 
                    0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
    
                var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
    
                var W = new Array(64);
                var a, b, c, d, e, f, g, h, i, j;
                var T1, T2;
         
                m[l >> 5] |= 0x80 << (24 - l % 32);
                m[((l + 64 >> 9) << 4) + 15] = l;
         
                for ( var i = 0; i<m.length; i+=16 ) {
                    a = HASH[0];
                    b = HASH[1];
                    c = HASH[2];
                    d = HASH[3];
                    e = HASH[4];
                    f = HASH[5];
                    g = HASH[6];
                    h = HASH[7];
         
                    for ( var j = 0; j<64; j++) {
                        if (j < 16) W[j] = m[j + i];
                        else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
         
                        T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                        T2 = safe_add(Sigma0256(a), Maj(a, b, c));
         
                        h = g;
                        g = f;
                        f = e;
                        e = safe_add(d, T1);
                        d = c;
                        c = b;
                        b = a;
                        a = safe_add(T1, T2);
                    }
         
                    HASH[0] = safe_add(a, HASH[0]);
                    HASH[1] = safe_add(b, HASH[1]);
                    HASH[2] = safe_add(c, HASH[2]);
                    HASH[3] = safe_add(d, HASH[3]);
                    HASH[4] = safe_add(e, HASH[4]);
                    HASH[5] = safe_add(f, HASH[5]);
                    HASH[6] = safe_add(g, HASH[6]);
                    HASH[7] = safe_add(h, HASH[7]);
                }
                return HASH;
            }
            function str2binb (str) {
                var bin = Array();
                var mask = (1 << chrsz) - 1;
                for(var i = 0; i < str.length * chrsz; i += chrsz) {
                    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
                }
                return bin;
            }
         
            function Utf8Encode(string) {
                string = string.replace(/\r\n/g,"\n");
                var utftext = "";
         
                for (var n = 0; n < string.length; n++) {
         
                    var c = string.charCodeAt(n);
         
                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    }
                    else if((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                    else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
         
                }
         
                return utftext;
            }
         
            function binb2hex (binarray) {
                var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
                var str = "";
                for(var i = 0; i < binarray.length * 4; i++) {
                    str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
                    hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
                }
                return str;
            }
            
            s = Utf8Encode(s);
            return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
        }

        function core_hmac_md5(key, data) {
            var bkey = str2binl(key);
            if (bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);
            var ipad = Array(16),
                opad = Array(16);
            for (var i = 0; i < 16; i++) {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5C5C5C5C;
            }
            var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
            return core_md5(opad.concat(hash), 512 + 128);
        }

        function safe_add(x, y) { var lsw = (x & 0xFFFF) + (y & 0xFFFF); var msw = (x >> 16) + (y >> 16) + (lsw >> 16); return (msw << 16) | (lsw & 0xFFFF); }

        function bit_rol(num, cnt) { return (num << cnt) | (num >>> (32 - cnt)); }

        function str2binl(str) { var bin = Array(); var mask = (1 << chrsz) - 1; for (var i = 0; i < str.length * chrsz; i += chrsz) bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32); return bin; }

        function binl2str(bin) { var str = ""; var mask = (1 << chrsz) - 1; for (var i = 0; i < bin.length * 32; i += chrsz) str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask); return str; }

        function binl2hex(binarray) { var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef"; var str = ""; for (var i = 0; i < binarray.length * 4; i++) str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF); return str; }

        function binl2b64(binarray) {
            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i += 3) {
                var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
                for (var j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
                    else
                        str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
                }
            }
            return str;
        }
    }
    var Base64 = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encode: function(input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            input = Base64._utf8_encode(input);
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) { enc3 = enc4 = 64 } else if (isNaN(chr3)) { enc4 = 64 }
                output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4)
            }
            return output
        },
        decode: function(input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (i < input.length) {
                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 != 64) { output = output + String.fromCharCode(chr2) }
                if (enc4 != 64) { output = output + String.fromCharCode(chr3) }
            }
            output = Base64._utf8_decode(output);
            return output
        },
        _utf8_encode: function(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) { utftext += String.fromCharCode(c) } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128)
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128)
                }
            }
            return utftext
        },
        _utf8_decode: function(utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;
            while (i < utftext.length) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3
                }
            }
            return string
        }
    }


    /* new code 20240402 */
    var clmd5 = {
        hexcase: 0,
        b64pad: '',
        hex_md5: function(s) { return clmd5.rstr2hex(clmd5.rstr_md5(clmd5.str2rstr_utf8(s))); },
        b64_md5: function(s) { return clmd5.rstr2b64(clmd5.rstr_md5(clmd5.str2rstr_utf8(s))); },
        any_md5: function(s, e) { return clmd5.rstr2any(clmd5.rstr_md5(clmd5.str2rstr_utf8(s)), e); },
        hex_hmac_md5: function(k, d) { return clmd5.rstr2hex(clmd5.rstr_hmac_md5(clmd5.str2rstr_utf8(k), clmd5.str2rstr_utf8(d))); },
        b64_hmac_md5: function(k, d) { return clmd5.rstr2b64(clmd5.rstr_hmac_md5(clmd5.str2rstr_utf8(k), clmd5.str2rstr_utf8(d))); },
        any_hmac_md5: function(k, d, e) { return clmd5.rstr2any(clmd5.rstr_hmac_md5(clmd5.str2rstr_utf8(k), clmd5.str2rstr_utf8(d)), e); },
        rstr_md5: function(s) { return clmd5.binl2rstr(clmd5.binl_md5(clmd5.rstr2binl(s), s.length * 8)); },
        rstr_hmac_md5: function(key, data) {
            var bkey = clmd5.rstr2binl(key);
            if(bkey.length > 16) bkey = clmd5.binl_md5(bkey, key.length * 8);

            var ipad = Array(16), opad = Array(16);
            for(var i = 0; i < 16; i++)
            {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5C5C5C5C;
            }

            var hash = clmd5.binl_md5(ipad.concat(clmd5.rstr2binl(data)), 512 + data.length * 8);
            return clmd5.binl2rstr(clmd5.binl_md5(opad.concat(hash), 512 + 128));
        },
        rstr2hex: function(input) {
            try { clmd5.hexcase } catch(e) { clmd5.hexcase=0; }
            var hex_tab = clmd5.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var output = "";
            var x;
            for(var i = 0; i < input.length; i++)
            {
              x = input.charCodeAt(i);
              output += hex_tab.charAt((x >>> 4) & 0x0F)
                     +  hex_tab.charAt( x        & 0x0F);
            }
            return output;
        },
        rstr2b64: function(input) {
            try { clmd5.b64pad } catch(e) { clmd5.b64pad=''; }
            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var output = "";
            var len = input.length;
            for(var i = 0; i < len; i += 3)
            {
              var triplet = (input.charCodeAt(i) << 16)
                          | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
                          | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
              for(var j = 0; j < 4; j++)
              {
                if(i * 8 + j * 6 > input.length * 8) output += clmd5.b64pad;
                else output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
              }
            }
            return output;
        },
        rstr2any: function(input, encoding) {
            var divisor = encoding.length;
            var i, j, q, x, quotient;
          
            /* Convert to an array of 16-bit big-endian values, forming the dividend */
            var dividend = Array(Math.ceil(input.length / 2));
            for(i = 0; i < dividend.length; i++)
            {
              dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
            }
          
            /*
             * Repeatedly perform a long division. The binary array forms the dividend,
             * the length of the encoding is the divisor. Once computed, the quotient
             * forms the dividend for the next step. All remainders are stored for later
             * use.
             */
            var full_length = Math.ceil(input.length * 8 /
                                              (Math.log(encoding.length) / Math.log(2)));
            var remainders = Array(full_length);
            for(j = 0; j < full_length; j++)
            {
              quotient = Array();
              x = 0;
              for(i = 0; i < dividend.length; i++)
              {
                x = (x << 16) + dividend[i];
                q = Math.floor(x / divisor);
                x -= q * divisor;
                if(quotient.length > 0 || q > 0)
                  quotient[quotient.length] = q;
              }
              remainders[j] = x;
              dividend = quotient;
            }
          
            /* Convert the remainders to the output string */
            var output = "";
            for(i = remainders.length - 1; i >= 0; i--)
              output += encoding.charAt(remainders[i]);
          
            return output;
        },
        str2rstr_utf8: function(input) {
            var output = "";
            var i = -1;
            var x, y;
          
            while(++i < input.length)
            {
              /* Decode utf-16 surrogate pairs */
              x = input.charCodeAt(i);
              y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
              if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF)
              {
                x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
                i++;
              }
          
              /* Encode output as utf-8 */
              if(x <= 0x7F)
                output += String.fromCharCode(x);
              else if(x <= 0x7FF)
                output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                                              0x80 | ( x         & 0x3F));
              else if(x <= 0xFFFF)
                output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                                              0x80 | ((x >>> 6 ) & 0x3F),
                                              0x80 | ( x         & 0x3F));
              else if(x <= 0x1FFFFF)
                output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                                              0x80 | ((x >>> 12) & 0x3F),
                                              0x80 | ((x >>> 6 ) & 0x3F),
                                              0x80 | ( x         & 0x3F));
            }
            return output;
        },
        // str2rstr_utf16le: function(input) {
        //     var output = "";
        //     for(var i = 0; i < input.length; i++)
        //       output += String.fromCharCode( input.charCodeAt(i)        & 0xFF,
        //                                     (input.charCodeAt(i) >>> 8) & 0xFF);
        //     return output;
        // },
        // str2rstr_utf16be: function(input) {
        //     var output = "";
        //     for(var i = 0; i < input.length; i++)
        //       output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
        //                                      input.charCodeAt(i)        & 0xFF);
        //     return output;
        // },
        rstr2binl: function(input) {
            var output = Array(input.length >> 2);
            for(var i = 0; i < output.length; i++)
              output[i] = 0;
            for(var i = 0; i < input.length * 8; i += 8)
              output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (i%32);
            return output;
        },
        binl2rstr: function(input) {
            var output = "";
            for(var i = 0; i < input.length * 32; i += 8)
              output += String.fromCharCode((input[i>>5] >>> (i % 32)) & 0xFF);
            return output;
        },
        binl_md5: function(x, len) {
            /* append padding */
            x[len >> 5] |= 0x80 << ((len) % 32);
            x[(((len + 64) >>> 9) << 4) + 14] = len;
          
            var a =  1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d =  271733878;
          
            for(var i = 0; i < x.length; i += 16)
            {
              var olda = a;
              var oldb = b;
              var oldc = c;
              var oldd = d;
          
              a = clmd5.md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
              d = clmd5.md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
              c = clmd5.md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
              b = clmd5.md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
              a = clmd5.md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
              d = clmd5.md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
              c = clmd5.md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
              b = clmd5.md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
              a = clmd5.md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
              d = clmd5.md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
              c = clmd5.md5_ff(c, d, a, b, x[i+10], 17, -42063);
              b = clmd5.md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
              a = clmd5.md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
              d = clmd5.md5_ff(d, a, b, c, x[i+13], 12, -40341101);
              c = clmd5.md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
              b = clmd5.md5_ff(b, c, d, a, x[i+15], 22,  1236535329);
          
              a = clmd5.md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
              d = clmd5.md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
              c = clmd5.md5_gg(c, d, a, b, x[i+11], 14,  643717713);
              b = clmd5.md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
              a = clmd5.md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
              d = clmd5.md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
              c = clmd5.md5_gg(c, d, a, b, x[i+15], 14, -660478335);
              b = clmd5.md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
              a = clmd5.md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
              d = clmd5.md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
              c = clmd5.md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
              b = clmd5.md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
              a = clmd5.md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
              d = clmd5.md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
              c = clmd5.md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
              b = clmd5.md5_gg(b, c, d, a, x[i+12], 20, -1926607734);
          
              a = clmd5.md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
              d = clmd5.md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
              c = clmd5.md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
              b = clmd5.md5_hh(b, c, d, a, x[i+14], 23, -35309556);
              a = clmd5.md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
              d = clmd5.md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
              c = clmd5.md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
              b = clmd5.md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
              a = clmd5.md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
              d = clmd5.md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
              c = clmd5.md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
              b = clmd5.md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
              a = clmd5.md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
              d = clmd5.md5_hh(d, a, b, c, x[i+12], 11, -421815835);
              c = clmd5.md5_hh(c, d, a, b, x[i+15], 16,  530742520);
              b = clmd5.md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);
          
              a = clmd5.md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
              d = clmd5.md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
              c = clmd5.md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
              b = clmd5.md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
              a = clmd5.md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
              d = clmd5.md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
              c = clmd5.md5_ii(c, d, a, b, x[i+10], 15, -1051523);
              b = clmd5.md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
              a = clmd5.md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
              d = clmd5.md5_ii(d, a, b, c, x[i+15], 10, -30611744);
              c = clmd5.md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
              b = clmd5.md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
              a = clmd5.md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
              d = clmd5.md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
              c = clmd5.md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
              b = clmd5.md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);
          
              a = clmd5.safe_add(a, olda);
              b = clmd5.safe_add(b, oldb);
              c = clmd5.safe_add(c, oldc);
              d = clmd5.safe_add(d, oldd);
            }
            return Array(a, b, c, d);
        },
        md5_cmn: function(q, a, b, x, s, t) { return clmd5.safe_add(clmd5.bit_rol(clmd5.safe_add(clmd5.safe_add(a, q), clmd5.safe_add(x, t)), s),b); },
        md5_ff: function(a, b, c, d, x, s, t) { return clmd5.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t); },
        md5_gg: function(a, b, c, d, x, s, t) { return clmd5.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t); },
        md5_hh: function(a, b, c, d, x, s, t) { return clmd5.md5_cmn(b ^ c ^ d, a, b, x, s, t); },
        md5_ii: function(a, b, c, d, x, s, t) { return clmd5.md5_cmn(c ^ (b | (~d)), a, b, x, s, t); },
        safe_add: function(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        },
        bit_rol: function(num, cnt) { return (num << cnt) | (num >>> (32 - cnt)); }
    }

    $('.newcheckbox').live('click', function() {
        var checkCollection = $(this).parents('.collection-item').length;
        if (checkCollection < 1) {
            if ($(this).hasClass('disabled')) {
                return false;
            }
        }
    });


    var setPanelTranslate = function(obj) {
        $.each(obj.find('[data-title]'), function(i, v) {
            var el_title = $(this).attr('data-title'),
                lang_check = /[ㄱ-ㅎㅏ-ㅣ가-힣]/,
                el_title_lang = (lang_check.test(el_title)) ? 'ko' : 'en',
                arr = $.lang[el_title_lang];
            if ($(this).parent().hasClass('gallery-item')) return true;
            key = getKeyByValue(arr, el_title);

            if (key && el_title_lang != LANG) $(this).attr('data-title', $.lang[LANG][key]);
            if (typeof $.lang['en'][key] != 'undefined') $(this).attr('data-subtitle', $.lang['en'][key].toLowerCase().replace(/\s/g, '-'));
        });
    }

    var cutStrInBytes = function(str, limit) {
        var size = 0;
        for (var i = 0; i < str.length; i++) {
            size += (str.charCodeAt(i) > 128) ? 2 : 1;
            if (size > limit) return str.substring(0, i) + '...';
        }
        return str;
    }

    var refreshGalleryField = function(elObj, elsettings) {
        if (typeof elsettings == 'undefined' ||
            $.isEmptyObject(elsettings) ||
            typeof elsettings.field_disable == 'undefined' ||
            $.isEmptyObject(elsettings.field_disable)
        ) {
            return false;
        }

        var gVALIDTYPE = (PAGE_MODE == 'c') ? VALIDTYPE : property.VALIDTYPE;

        var el_mode = elObj.attr('data-mode'),
            el_seq = elObj.attr('data-id'),
            checkGalleryField = (elObj.find('h5.figure').eq(0).hasClass('title')) ? true : false;
        if (!checkGalleryField) return false;

        var gfield_all = ['brand','title','caption','price','review_cnt','review_score','comment','number','basket','like','basket'],
            gfield_oldver = (typeof elsettings.field_oldver != 'undefined' && !$.isEmptyObject(elsettings.field_oldver)) ? elsettings.field_oldver : [],
            gfield_disable = (typeof elsettings.field_disable != 'undefined' && !$.isEmptyObject(elsettings.field_disable)) ? elsettings.field_disable : [],
            gfield_listSet = (typeof el_mode != 'undefined') ? ['title', 'caption'] : [];
        if (typeof el_mode != 'undefined' && el_mode == 'shopping') {
            gfield_listSet = ['title', 'caption', 'price', 'review_cnt', 'review_score', 'basket'];
            if (typeof LUX != 'undefined' ? LUX : property.LUX) gfield_listSet.push('brand');
            if (gfield_disable.indexOf('basket') < 0 && gfield_oldver.indexOf('basket') < 0 && elObj.find('.figure.basket:not([data-oldver])').length == 0) gfield_disable.push('basket');
            if (gVALIDTYPE != 'SM' && gfield_disable.indexOf('basket') < 0)  gfield_disable.push('basket');
            if (typeof el_seq != 'undefined' && el_seq == 'all_products') gfield_disable = [];
        } else if (typeof el_mode != 'undefined' && el_mode == 'project') {
            gfield_listSet = ['title', 'caption', 'comment', 'like'];
        } else if (typeof el_mode != 'undefined' && el_mode == 'gallery') {
            gfield_listSet = ['title', 'caption', 'like'];
        }

        if (elObj.find('.figure.number').length > 0) gfield_listSet.push('number');
        if (elObj.find('.figure.like').length > 0) elObj.find('.figure.like').addClass('hide');

        $.each(gfield_all, function(g_i, g_v) {
            var onoff = ($.inArray(g_v, gfield_disable) > -1) ? false : true;
            if (onoff && $.inArray(g_v, gfield_listSet) == -1) onoff = false;
            if(g_v == 'like' && !(typeof elsettings.like_display != 'undefined' && elsettings.like_display == 'ON')) onoff = false;

            var checkReviewField = (g_v.match(/^review_/gi) !== null) ? true : false;
            if (checkReviewField) {
                elObj.find('.figure.review').attr('data-' + g_v, onoff);
            } else {
                if (onoff) {
                    elObj.find('.figure.' + g_v).each(function(i, v) {
                        if (  (g_v == 'comment' && Number($(v).find('figure-comment-cnt').text()) == 0) ||
                              (g_v == 'basket' && $(this).hasClass('cannotby'))
                        ) {
                            return true;
                        }
                        $(this).removeAttr('style');
                        $(this).removeClass('hide');
                    });
                } else {
                    elObj.find('.figure.' + g_v).each(function() { 
                        $(this).addClass('hide'); 
                    });
                }
            }
        });

        elObj.find('.grid figcaption').each(function() {
            if($(this).find('.figure:not(.hide, .review[data-review_cnt="false"][data-review_score="false"])').length > 0 && $(this).height() > 0) {
                $(this).removeClass('allhide');
            } else {
                $(this).addClass('allhide');
            }
        });
    }

    var refreshGalleryHeight = function(el) {
        if (el == 'el-menu' || el == 'el-footer') return false;
        var g_block = (typeof el != 'undefined' && el) ? '.' + el : '',
            g_block_selector = (typeof el != 'undefined' && el == 'el_display') ? '#element-display' : '.element[data-type="gallery"]' + g_block;

        $(g_block_selector).each(function() {
            if ($(this).find('.empty-txt').length > 0 || $(this).find('.grid').length == 0) return;

            var gsort = $(this).find('.goption').attr('data-gsort'),
                gh = $(this).find('.goption').attr('data-gh');
            if (typeof gh == 'undefined' || gh == 'auto') { return; }
            if (typeof gsort != 'undefined' && gsort == 'm') {
                $(this).find('.grid .g-img').removeClass('style');
                return;
            }

            var gel = $(this).find('.grid').eq(0),
                // gw = parseFloat(gel.css('width').replace(/[^0-9]/g,'')),
                gw = parseFloat(gel[0].getBoundingClientRect().width),
                gpl = parseFloat(gel.css('padding-left').replace(/[^0-9]/g, '')),
                gpr = parseFloat(gel.css('padding-right').replace(/[^0-9]/g, '')),
                g_img_height = (gw - (gpl + gpr)) * parseFloat(gh);

            $(this).find('.grid .g-img').css('height', g_img_height + 'px');
        });
    }

    var refreshGallerySwiperHeight = function(el) {
        if (typeof el == 'undefined' || !el || $(el).length == 0 || $(el).length > 1) return false;
        if ($(el).find('.empty-txt').length > 0 || $(el).find('.grid').length == 0) return false;

        var swiper_elname = $(el).attr('data-name'),
            swp_h = getComputedStyle(document.querySelector('.' + swiper_elname)).getPropertyValue('--swiper-height');
        if (typeof swp_h != 'undefined' && swp_h) {
            var gel = $(el).find('.grid').eq(0),
                gw = parseFloat(gel[0].getBoundingClientRect().width),
                gpl = parseFloat(gel.css('padding-left').replace(/[^0-9]/g, '')),
                gpr = parseFloat(gel.css('padding-right').replace(/[^0-9]/g, ''));

            if ($(el).is('.reorderBlock')) {
                gw = parseFloat(gw * 5);
                gpl = parseFloat(gpl * 5);
                gpl = parseFloat(gpl * 5);
            }
            var swp_wrap_h = (gw - (gpl + gpr)) * parseFloat(swp_h);
            $(el).find('.swiper-wrapper').css('height', parseFloat(swp_wrap_h) + 'px');
        }
    }


    var getGalleryCategoryBlockNav = function(elid, elsettings) {
        var g_mode = $('.element[data-id="' + elid + '"]').attr('data-mode');
        var gallery_category_home = (typeof elsettings.category_home == 'undefined') ? 'All' : elsettings.category_home,
            gallery_settings_category = (typeof elsettings.category == 'undefined') ? '' : elsettings.category.replace(/\|/g, '').replace(/\,/g, ', '),
            gallery_settings_category_color = (typeof elsettings.category_color_type != 'undefined' && elsettings.category_color_type) ? elsettings.category_color_type : '',
            category_nav_list = '',
            g_category = (gallery_settings_category) ? gallery_settings_category.split(',') : ['category1', 'category2', 'category3'];
        var category_display = (typeof elsettings.category_display == 'undefined') ? 'OFF' : elsettings.category_display;
        var product_orderby = (typeof elsettings.product_orderby == 'undefined') ? 'OFF' : elsettings.product_orderby;
        var mode = (elsettings.category_sticky == 'ON') ? 'float' : '';
        var sticky_style = (elsettings.category_sticky == 'ON') ? '' : 'nosticky';
        var str = '<div class="gallery-category-wrap goption-container '+ mode +' '+ sticky_style +'">',
            ssid = (typeof property != 'undefined') ? property.SID : SID;

        if(category_display == 'ON') {
            if (!gallery_settings_category) {
                elsettings = {
                    category: '|category1|,|category2|,|category3|',
                    category_home: 'All'
                };

                $.post('/template/settings', { sid: ssid, settings: JSON.stringify(elsettings), el: elid }, function(data) {
                    checkError(data);
                }, 'json');
            }

            var active_arr = [],
                cookie_gallery_category = $.cookie('gallery-category-' + elid);

            $.each(g_category, function(i, v) {
                var active = (v.trim() == cookie_gallery_category) ? 'active' : '';
                active_arr.push(active);
                if (v) category_nav_list = category_nav_list + '\
                    <li class="' + active + '"><a href="javascript:;" data-idx="' + (i + 1) + '">' + v.trim() + '</a></li>\
                ';
            });

            var active_empty = ($.inArray('active', active_arr) == -1) ? 'active' : '',
                active_home = (typeof elsettings.category_home_hide != 'undefined' && (elsettings.category_home_hide == 'true' || elsettings.category_home_hide === true)) ? ' hide' : '';
            str += '\
                    <ul class="gallery-category-nav goption-row" data-category-color="' + gallery_settings_category_color + '">\
                        <li class="' + active_empty + active_home + '"><a href="javascript:;" data-idx="0">' + gallery_category_home + '</a></li>\
                        ' + category_nav_list + '\
                    </ul>\
                ';
        }
        
        if(product_orderby == 'ON' && g_mode == 'shopping') {
            var cookie_gallery_orderby = $.cookie('gallery-orderby-' + elid);
            if(!cookie_gallery_orderby) cookie_gallery_orderby = 'recent';
            var g_orderby = {
                'recent': $.lang[LANG]['gallery.shopping.orderby.recent'],
                // 'sales': '판매 인기순',
                'lowprice': $.lang[LANG]['gallery.shopping.orderby.lowprice'],
                'highprice': $.lang[LANG]['gallery.shopping.orderby.highprice'],
                'discount': $.lang[LANG]['gallery.shopping.orderby.discount'],
                'review_cnt': $.lang[LANG]['gallery.shopping.orderby.review_cnt']
            };
            var orderby_nav_list = '';
            var active_orderby = (typeof cookie_gallery_orderby != 'undefined' && cookie_gallery_orderby)? g_orderby[cookie_gallery_orderby] : '신상품순';
            // var gallery_settings_sort_color = (typeof elsettings.product_sort_color_type != 'undefined') ? elsettings.product_sort_color_type : (typeof elsettings['product_sort_color_type'] != 'undefined' && elsettings['product_sort_color_type']) ? elsettings['product_sort_color_type'] : '';

            var i = 0;
            $.each(g_orderby, function(k, v) {
                var active = (k == cookie_gallery_orderby) ? 'active' : '';
                orderby_nav_list += '\
                    <li class="' + active + '"><a href="javascript:;" data-idx="' + i + '" data-orderby="' + k + '">' + v + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 10" width="13" height="10"><path d="m5 9.71-5-5 1.41-1.42L5 6.88 11.59.29 13 1.71z"/></svg></a></li>\
                ';
                i++;
            });
            str += '\
                    <div class="gallery-sort-nav goption-row" data-sort-lang="' + LANG + '">\
                        <div class="toggle-dropdown display-flex space-between align-items-center">\
                            <span class="active-sort">' + active_orderby + '</span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="m8 11.35-6-6 .71-.7L8 9.94l5.29-5.29.71.7z"/></svg>\
                        </div>\
                        <ul>\
                        ' + orderby_nav_list + '\
                        </ul>\
                    </div>\
                ';
        }

        str += '</div>';

        return str;
    }

    var loadGalleryCategoryBlock = function(gc_el, gc_id, gc_elsettings) {
        var $gc_el = gc_el;
        if ($gc_el.length == 0) {
            console.log('undefined Gallery Block..');
            return false;
        }

        var gc_deferred = $.Deferred();
        if (typeof isElviewPage != 'undefined' && isElviewPage === true) {
            gc_elsettings = {};
        } else if (typeof gc_elsettings == 'undefined' && typeof gc_id != 'undefined' && gc_id) {
            $.getJSON('/template/element/type/get/seq/' + gc_id, function(data) {
                checkError(data);
                gc_elsettings = (typeof data[0] != 'undefined' && typeof data[0].elsettings != 'undefined' && data[0].elsettings == '') ? $.parseJSON(data[0].elsettings) : {};
                gc_deferred.resolve(gc_elsettings);
            });
        } else gc_deferred.resolve(gc_elsettings);


        gc_deferred.promise().then(function(settings) {
            if (typeof settings == 'undefined') settings = {};

            var margin_val = $gc_el.find('[data-loop="true"]').css('margin-left'),
                padding_val = $gc_el.find('.grid').first().css('padding-left'),
                gc = (typeof settings.category_display != 'undefined' && settings.category_display == 'ON') ? true : false,
                gs = (typeof settings.product_orderby != 'undefined' && settings.product_orderby == 'ON') ? true : false,
                checkLUX = (typeof settings.lux_category_no != 'undefined' && settings.lux_category_no) ? true : false;

            if (checkLUX && $gc_el.is('[data-mode="shopping"]')) gc = false;
            if (gc || gs) {
                var checkMsny = ($gc_el.is('[data-msny="true"]')) ? true : false,
                    checkPremium = ($gc_el.is('[data-type2="premium"]')) ? true : false,
                    checkGjs = ($gc_el.has('input.gjs').length) ? true : false,
                    checkGalleryCate = ((checkMsny && $gc_el.children('.gallery-category-wrap').length > 0) ||
                        (!checkMsny && $gc_el.find('.container .gallery-category-wrap').length > 0)
                    ) ? true : false,
                    gallery_category_html = getGalleryCategoryBlockNav(gc_id, settings);

                if (checkGalleryCate) $gc_el.find('.gallery-category-wrap').replaceWith(gallery_category_html);
                else {
                    $gc_el.find('.gallery-category-wrap').remove();
                    if (checkMsny) {
                        if ($gc_el.find('.goption').length > 0) $gc_el.find('.goption').after(gallery_category_html);
                        else $gc_el.prepend(gallery_category_html);
                    } else if (checkPremium || checkGjs) {
                        var gcate_position = (typeof getGalleryCateNavPosition == 'function') ? getGalleryCateNavPosition($gc_el) : '';
                        if (gcate_position) $gc_el.find(gcate_position).before(gallery_category_html);
                    } else {
                        $gc_el.find('[data-loop="true"]').before(gallery_category_html);
                    }
                }

                if ($gc_el.find('[data-loop="true"]').find('.emptyGalleryItem').length > 0 && $gc_el.find('.gallery-category-nav .active').index() == 0) {
                    $gc_el.find('.gallery-category-nav').addClass('empty');
                } else $gc_el.find('.gallery-category-nav').removeClass('empty');

            } else {
                $gc_el.find('.gallery-category-wrap').remove();
            }

            var checkGalleryPadding = ($gc_el.find('.goption[data-gpd]').length > 0) ? true : false;
            if (checkGalleryPadding) {} else {
                // before Ver
                if ($('body').width() <= 768) {
                    if (!$gc_el.find('.container').hasClass('full-width')) padding_val = '15px';
                    if ($gc_el.find('input[data-js="fixedscroll"][data-js-code="4"]').length > 0) padding_val = '0px';
                }
                if($gc_el.find('.gallery-category-wrap').width() < $gc_el.width()) {
                    padding_val = '0px';
                }

                $gc_el.find('.gallery-category-wrap').css({ 'margin-left': margin_val, 'margin-right': margin_val });
                // $gc_el.find('.gallery-category-nav').css({ 'padding-left': padding_val, 'padding-right': padding_val });
                $gc_el.find('.gallery-category-nav').css({ 'padding-left': '10px', 'padding-right': '10px' });
                $gc_el.find('.gallery-sort-nav').css({ 'padding-left': padding_val, 'padding-right': padding_val });

                var gc_width_control = ($gc_el.find('.container').hasClass('full-width')) ? true : false;
                if (typeof $gc_el.attr('data-msny') != 'undefined' && $gc_el.attr('data-msny') == 'true' || gc_width_control) {
                    var width = (gc_width_control && $gc_el.find('.container').css('margin') == '0px') ? $gc_el.find('.container').outerWidth() - 40 : $gc_el.find('.container').outerWidth();
                    // $gc_el.find('.gallery-category-wrap').css({ 'width': width, 'margin': '0 auto' });
                }
            }

            if ($gc_el.find('[data-loop="true"]').css('overflow') == 'hidden') $gc_el.find('[data-loop="true"]').css('overflow', 'visible');
            if (checkPremium && $gc_el.is('[data-feature*=fixedscroll]')) {
                setTimeout(function() {
                    gjs01SetFixedscroll($gc_el);
                }, 300);
            }
        });
    }


    var getEventObject = function(type, price, quantity, step, explan, lang, href) {
        var prod_position = {
                "LK": 0,
                "BS": 0,
                "BN": 1,
                "SM": 2
            },
            prod_type = {
                "LK": $.lang[LANG]['pay.plan.LK.name'],
                "BS": $.lang[LANG]['pay.plan.BS.name'],
                "BN": $.lang[LANG]['pay.plan.BN.name'],
                "SM": $.lang[LANG]['pay.plan.SM.name']
            },
            prod_brand = (lang == 'ko') ? '크리에이터링크' : 'creatorlink',
            prod_currency = (lang == 'ko') ? 'KRW' : 'USD',
            prod_action = '',
            prod_step = 1;

        if (explan.length == 0) {
            prod_action = '신규결제';
        } else if (explan == type) {
            prod_action = '요금제 연장';
        } else if ((explan.length && type.length) && (explan != type)) {
            prod_action = '요금제 변경';
        }

        var charge = price + (price * 0.1);
        return {
            'name': prod_type[type],
            'price': charge,
            'brand': prod_brand,
            'category': prod_action,
            'variant': quantity,
            'position': prod_position[type],
            'explan': explan,
            'plan': type,
            'step': step,
            'currency': prod_currency,
            'href': href
        }
    }


    /* 동영상블럭 갤러리타입 **************************************/
    var getGalleryVideoType = function(val) {
        var videoTypeArray = ['youtube', 'vimeo', 'soundcloud', 'youtu.be'],
            videoType = '';

        $.each(videoTypeArray, function(i, v) {
            if (val.indexOf(v) > -1) {
                videoType = v;
            }
        });

        return videoType;
    }

    var getGalleryVideoData = function(videoUrl) {
        var videoId = '',
            videoThumb = '',
            videoType = '',
            check_video = false;

        videoType = getGalleryVideoType(videoUrl);

        switch (videoType) {
            case 'youtube':
            case 'youtu.be':
                var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,
                    match = videoUrl.match(regExp);

                if (match && match[2].length === 11) {
                    var videoId = match[2],
                        videoThumb = '//img.youtube.com/vi/' + videoId + '/0.jpg',
                        aType = "text/html",
                        src = '//www.youtube.com/embed/' + videoId;

                    check_video = true;
                    src = src.replace('watch?v=', 'v/');
                }

                break;

            case 'vimeo':
                var regExp = /\/\/(player.)?vimeo.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/,
                    match = videoUrl.match(regExp);

                if (match && match[3].length > 0) {
                    var videoId = match[3],
                        aType = "text/html",
                        src = '//player.vimeo.com/video/' + videoId;

                    var vidx = ($('#el-blockConfig .bg-video-wrap .input-group.active').length > 0) ? $('#el-blockConfig .bg-video-wrap .input-group.active').attr('id').replace(/[^0-9]/gi, '') : 0,
                        vgrid = $('.'+selectEL).find('.grid').eq(vidx),
                        w = (vidx && vgrid.length > 0) ? vgrid.width() + 100 : 1024,
                        h = (vidx && vgrid.length > 0) ? vgrid.height() + 100 : 1024,
                        size = (w > h) ? '&height='+h : '&width='+w;
                    $.getJSON('https://vimeo.com/api/oembed.json?url=https://player.vimeo.com/video/' + videoId + size, function(data) {
                        if (typeof data.thumbnail_url != 'undefined' && data.thumbnail_url) {
                            videoThumb = data.thumbnail_url;
                        }
                    });

                    check_video = true;
                }


                break;

            case 'soundcloud':
                var videoId = '',
                    aType = "";

                videoUrl = (videoUrl.indexOf('https') > -1) ? videoUrl : 'https://' + videoUrl;

                $.getJSON('https://soundcloud.com/oembed?format=json&url=' + videoUrl, function(data) {
                    if (typeof data.html == 'undefined') { return; }
                    $video = $(data.html);
                    src = $video.prop('src');
                    videoThumb = data.thumbnail_url;
                    check_video = true;
                }).fail(function(response) {
                    console.log(response);
                    return;
                });

                break;
            default:

                break;
        }

        var videoData = {
            check_video: check_video,
            videoType: videoType,
            videoId: videoId,
            videoUrl: videoUrl,
            aType: aType,
            poster: videoThumb,
            iframe_src: src
        }

        return videoData;
    }

    // $('.video-content > svg').live('click', function() {
    //     if($(this).parents('.el_viewblock').length>0) return false;

    //     $.loadingOn($(this).parents('.video-content')); 

    //     var vd_src = $(this).parents('.video-content').attr('data-url'),
    //         vd_height = $(this).parents('.video-content').css('height').replace('px',''),
    //         vd_data = getGalleryVideoData(vd_src),
    //         vd_mode = $(this).parents('.element').attr('data-mode'),
    //         vd_id = $(this).parents('.element').attr('data-id'),
    //         vd_mute = (vd_src.indexOf('vimeo')>-1) ? '&muted=1' : '&mute=1',
    //         vd_content_new = '<iframe class="video-iframe hide" height="'+vd_height+'" src="'+vd_data.iframe_src+'?wmode=transparent&amp;autoplay=1'+vd_mute+'" allow="autoplay""></iframe>';

    //     if(vd_mode!='zoom') {
    //         //if(isThumnailv_type) {
    //             $(this).parents('.video-content').append(vd_content_new);
    //             $(this).parents('.video-content').find('.ly-img').remove();
    //             $(this).remove();

    //             setTimeout(function(){
    //                 $('.video-iframe').removeClass('hide');
    //                 $('.dsgn-body').fitVids();
    //                 $.loadingOFF();

    //             },300);
    //         //}
    //     }   
    // });

    function setSnsJoinConvertScript(snstype) {
        console.log('setSnsJoinConvertScript');
        snstype = (typeof snstype != 'undefined') ? snstype : 'naver';
        var scriptStr = '\
            <script type="text/javascript" src="https://wcs.naver.net/wcslog.js"></script>\
            <script type="text/javascript" class="snsjoin_convert">\
            if(typeof(wcs) != "undefined") {\
                if(!wcs_add) var wcs_add={};\
                wcs_add["wa"]="s_48e853d9cc7e";\
                var _nasa={};\
                _nasa["cnv"] = wcs.cnv("2","1");\
                wcs_do(_nasa);\
                console.log("naver 전환");\
            }\
            </script>\
            <script type="text/javascript" charset="UTF-8" src="//t1.daumcdn.net/kas/static/kp.js"></script>\
            <script type="text/javascript" class="snsjoin_convert">\
                kakaoPixel("6608645775572775786").pageView();\
                kakaoPixel("6608645775572775786").completeRegistration();\
                console.log("kakao 전환");\
            </script>\
            <script type="text/javascript" class="snsjoin_convert">\
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?\
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;\
                n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;\
                t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,\
                document,"script","https://connect.facebook.net/en_US/fbevents.js");\
                fbq("init", "256796588050321");\
                fbq("track", "PageView");\
                fbq("trac", "CompleteRegistration");\
                console.log("facebook 전환");\
            </script>\
        ';

        switch (snstype) {
            case 'naver':
                scriptStr += '\
                    <script class="snsjoin_convert" async src="https://www.googletagmanager.com/gtag/js?id=G-JT83EQYG01"></script>\
                    <script class="snsjoin_convert">\
                    window.dataLayer = window.dataLayer || [];\
                        function gtag(){dataLayer.push(arguments);}\
                        gtag("js", new Date());\
                        gtag("config", "G-JT83EQYG01");\
                        gtag("event", "네이버_소셜_회원가입_완료", {\
                        "Social_Button" : "네이버 아이콘",\
                    });\
                    </script>\
                ';
                break;

            case 'kakao':
                scriptStr += '\
                <script class="snsjoin_convert" async src="https://www.googletagmanager.com/gtag/js?id=G-JT83EQYG01"></script>\
                <script class="snsjoin_convert">\
                    window.dataLayer = window.dataLayer || [];\
                    function gtag(){dataLayer.push(arguments);}\
                    gtag("js", new Date());\
                    gtag("config", "G-JT83EQYG01");\
                    gtag("event", "카카오_소셜_회원가입_완료", {\
                    "Social_Button" : "카카오 아이콘",\
                    });\
                </script>\
                ';
                break;
                
            case 'fb':
                scriptStr += '\
                <script class="snsjoin_convert" async src="https://www.googletagmanager.com/gtag/js?id=G-JT83EQYG01"></script>\
                <script class="snsjoin_convert">\
                console.log(\'sss\');\
                window.dataLayer = window.dataLayer || [];\
                    function gtag(){dataLayer.push(arguments);}\
                    gtag("js", new Date());\
                    gtag("config", "G-JT83EQYG01");\
                    gtag("event", "페이스북_소셜_회원가입_완료", {\
                    "Social_Button" : "페이스북 아이콘",\
                });\
                ';
            break;

            default:
                break;
        }
        $('.snsjoin_convert').remove();
        $('body').append(scriptStr);
    }

    function kakaoLogin() {
        if(window.Kakao) {
            const kakao = window.Kakao;
            if(!kakao.isInitialized()) {
                kakao.init('85677ffc26b1bca1130b866859031c06');
            }

            Kakao.Auth.authorize({
                redirectUri: document.location.protocol + '//' + getServiceHost() + '/oauth_kakao',
                scope: 'account_email,profile',
                state: document.getElementById( "modoo_url" ).value
            });
        }
    }

    /*
    function kakaoLogin(ip) {
        Kakao.Auth.login({
            success: function(response) {
                //사용자 정보 가져오기
                Kakao.API.request({
                    url: '/v2/user/me', //계정 정보를 가져오는 request url
                    success: function(data) {
                        var user = data.kakao_account, //카카오 계정 정보
                            accessToken = Kakao.Auth.getAccessToken();

                        Kakao.Auth.setAccessToken(accessToken);

                        var checkObj = { userinfo: data, id: user.email, snsType: 'kakao', ip: ip };
                        if (typeof $.cookie('land_join') != 'undefined' && $.cookie('land_join')) {
                            checkObj['land_join'] = $.cookie('land_join');
                            $.removeCookie('land_join', { path: '/' });
                        }
                        $.post('/template/snsloginCheck', checkObj, function(data) {
                            if (data.login) {
                                if (data.join) setSnsJoinConvertScript(); //sns 회원가입 전환 스크립트 

                                if (typeof data.url != 'undefined' && data.url) location.href = data.url;
                                else location.replace('/');
                                self.close();
                            } else {
                                alert(data.msg);
                                opener.location.reload();
                                self.close();
                            }
                        }, 'json');
                    },
                    fail: function(error) {
                        console.log('카카오톡과 연결이 완료되지 않았습니다.');
                    },
                })
            },
            fail: function(error) {
                console.log('카카오톡과 연결 실패하였습니다.');
            },
        })
    }
    */

    function snsLogout() {
        var sid = (typeof SID != 'undefined' && SID) ? SID : '';

        if(window.Kakao) {
            Kakao.init('85677ffc26b1bca1130b866859031c06');
            Kakao.isInitialized();
    
            if (Kakao.Auth.getAccessToken()) {
                Kakao.Auth.logout()
                    .then(function(response) {
                        // console.log(Kakao.Auth.getAccessToken());
                    })
                    .catch(function(error) {
                        // console.log('Not logged in.');
                    });
            }
        }

        window.fbAsyncInit = function() {
            FB.init({
                version : 'v19.0',
                appId : '590704662264509',		// [ creatorlink ] Facebook App
                // appId : '398865637129551',	// [ creatorlinkdev ] Facebook Test App
                status	: true,		//check login status
                cookie	: true,
                xfbml	: true
            });

            FB.getLoginStatus(function(response) {
                if (response.status == 'connected') {
                    FB.logout(function(response) {
                        FB.Auth.setAuthResponse(null, 'unknown');
                        console.log('logged out~');
                    });
                }
            });
        };

        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s);
            js.id = id;
            js.async = true;
            js.src = 'https://connect.facebook.net/en_KR/all.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        if (typeof sid != 'undefined' && sid) {
            if ($.cookie('domainSet-next-' + sid) !== undefined) $.removeCookie('domainSet-next-' + sid, { path: '/' });
        }

        location.href = '/member/login/out';
    }

    function disableScrolling() {
        var x = window.scrollX;
        var y = window.scrollY;
        window.onscroll = function() { window.scrollTo(x, y); };
    }

    function enableScrolling() {
        window.onscroll = function() {};
    }

    var hexToRgba = function(hex) {
        if (hex.lastIndexOf('#') > -1) {
            hex = hex.replace(/#/, '0x');
        } else {
            hex = '0x' + hex;
        }
        var r = hex >> 16;
        var g = (hex & 0x00FF00) >> 8;
        var b = hex & 0x0000FF;
        return rgb = { r: r, g: g, b: b };
    }

    var rgbaToOpacity = function(rgba) {
        if (typeof rgba == 'undefined') rgba = 'rgba(255,255,255,1)';
        //rgba = rgba.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+(\.\d{1,2}))[\s+]?/i);
        var r = [],
            rgba = rgba.replace(/^(rgb|rgba)\(/, '').replace(/\)$/, '').replace(/\s/g, '').split(',');

        r.r = rgba[0], r.g = rgba[1], r.b = rgba[2], r.a = rgba[3];
        return r;
    }

    var setGalleryProjectCss = function(parent, elcss) {
        var pr_css = CSSJSON.toJSON(elcss)['children'],
            galProjectCssStr = '',
            pr_settings = (typeof parent.settings != 'undefined' && parent.settings) ? $.parseJSON(parent.settings) : {},
            pr_gallery_colorSet = (typeof pr_settings.gallery_color != 'undefined' && pr_settings.gallery_color) ? pr_settings.gallery_color : '';

        $('body').find('.galProjectCss').remove();

        var isElview = ($('.elviewcss').length > 0) ? true : false;
        if (isElview) $('.elviewcss').after('<style class="galProjectCss"></style>');
        else $('#dsgn-body').after('<style class="galProjectCss"></style>');

        var body_selector = (isElview) ? 'body' : 'body > .dsgn-body';
        if (pr_css.hasOwnProperty('.' + parent.element + ' .galProjectBg')) {
            pr_css = pr_css['.' + parent.element + ' .galProjectBg']['attributes'];
            pr_Array = {};
            pr_Array = setGalleryProjectBgCss(body_selector, pr_css);

            galProjectCssStr += '\
                ' + body_selector + ' {\
                    background-color: ' + pr_Array.pr_bgColor + ';\
                    background-image: ' + pr_Array.pr_bgImage + ';\
                    background-position: ' + pr_Array.pr_bgPosition + ';\
                    background-repeat: ' + pr_Array.pr_bgRepeat + ';\
                    background-size: ' + pr_Array.pr_bgSize + ';\
                    height:auto;\
                    /*overflow: auto;\
                    overflow-x: hidden;*/\
                }\
            ';
        }

        if (pr_gallery_colorSet) {
            var pr_rgba = hexToRgba(pr_gallery_colorSet);
            $(body_selector).attr('data-gcolor', pr_gallery_colorSet);
            galProjectCssStr += body_selector + '[data-gcolor="' + pr_gallery_colorSet + '"] .element .p_nsvg .btn-box .active svg,\n\ ' + body_selector + '[data-gcolor="' + pr_gallery_colorSet + '"] .element .data-page-back,\n\
                                ' + body_selector + '[data-gcolor="' + pr_gallery_colorSet + '"] .element .data-page-back svg, ' + body_selector + '[data-gcolor="' + pr_gallery_colorSet + '"] .element .data-page-back span,\n\
                                ' + body_selector + '[data-gcolor="' + pr_gallery_colorSet + '"] .element .btn-box .active, ' + body_selector + '[data-gcolor="' + pr_gallery_colorSet + '"] .element .btn-box .active .btn-nav {\n\ fill: rgba(' + pr_rgba.r + ',' + pr_rgba.g + ',' + pr_rgba.b + ',1);\n\ color: rgba(' + pr_rgba.r + ',' + pr_rgba.g + ',' + pr_rgba.b + ',1);\n\}\n\
                                ' + body_selector + '[data-gcolor="' + pr_gallery_colorSet + '"] .element .btn-box svg,\n\
                                ' + body_selector + '[data-gcolor="' + pr_gallery_colorSet + '"] .element .btn-box .btn-nav-svg,\n\
                                ' + body_selector + '[data-gcolor="' + pr_gallery_colorSet + '"] .element .btn-box .btn-nav {\n\ fill: rgba(' + pr_rgba.r + ',' + pr_rgba.g + ',' + pr_rgba.b + ',0.4);\n\ color: rgba(' + pr_rgba.r + ',' + pr_rgba.g + ',' + pr_rgba.b + ',0.4);\n\ }\n';
        }

        $('.galProjectCss').append(galProjectCssStr);
    }

    var setGalleryProjectBgCss = function(pr_selector, pr_css) {
        var dsgnBody_bgColor = (typeof $(pr_selector).css('background-color') != 'undefined') ? $(pr_selector).css('background-color') : '',
            dsgnBody_bgImage = (typeof $(pr_selector).css('background-image') != 'undefined') ? $(pr_selector).css('background-image') : '',
            dsgnBody_bgPosition = (typeof $(pr_selector).css('background-position') != 'undefined') ? $(pr_selector).css('background-position') : '',
            dsgnBody_bgRepeat = (typeof $(pr_selector).css('background-repeat') != 'undefined') ? $(pr_selector).css('background-repeat') : '',
            dsgnBody_bgSize = (typeof $(pr_selector).css('background-size') != 'undefined') ? $(pr_selector).css('background-size') : '',
            pr_Array = {};

        pr_Array = {
            pr_bgColor: (typeof pr_css['background-color'] != 'undefined') ? pr_css['background-color'] : '',
            pr_bgImage: (typeof pr_css['background-image'] != 'undefined') ? pr_css['background-image'] : ((typeof pr_css['background-color'] != 'undefined' && pr_css['background-color']) ? 'none' : ''),
            pr_bgPosition: (typeof pr_css['background-position'] != 'undefined') ? pr_css['background-position'] : '',
            pr_bgRepeat: (typeof pr_css['background-repeat'] != 'undefined') ? pr_css['background-repeat'] : '',
            pr_bgSize: (typeof pr_css['background-size'] != 'undefined') ? pr_css['background-size'] : '',
        }

        var prbg_Array = getRgbaValArray(pr_Array['pr_bgColor']);

        if ((pr_Array.pr_bgColor == 'transparent' && pr_Array.pr_bgImage == 'none') || (prbg_Array['rgba']['a'] == '0' && pr_Array.pr_bgImage == 'none')) {
            pr_Array['pr_bgColor'] = dsgnBody_bgColor;
            pr_Array['pr_bgImage'] = dsgnBody_bgImage;
            pr_Array['pr_bgPosition'] = dsgnBody_bgPosition;
            pr_Array['pr_bgRepeat'] = dsgnBody_bgRepeat;
            pr_Array['pr_bgSize'] = dsgnBody_bgSize;
        }

        return pr_Array;
    }

    var onlyUnique = function(value, index, self) {
        return self.indexOf(value) === index;
    }

    var arrayDuplicates = function(arr) {
        var duplicates = {};
        for (var i = 0; i < arr.length; i++) {
            if (duplicates.hasOwnProperty(arr[i])) {
                duplicates[arr[i]].push(i);
            } else if (arr.lastIndexOf(arr[i]) !== i) {
                duplicates[arr[i]] = [i];
            }
        }

        return duplicates;
    }

    var arrayLastItem = function(arr) {
        if (Array.isArray(arr))
            return arr.pop();
        else return "";
    }

    var getLang = function(selectorTag, SID) {
        var ch_lang = '';
        if (typeof selectorTag.attr('data-blocklang') != 'undefined') { ch_lang = selectorTag.attr('data-blocklang'); } else {
            if ($('.menu-' + SID + ' .siteLANG').length > 0)
                ch_lang = ($('.menu-' + SID + ' .siteLANG').find('li.active a').attr('data-code') == 'ko') ? 'ko' : 'en';
            else ch_lang = LANG;
        }

        return ch_lang;
    }

    function templateModeChange(e) {
        $('.template-mode').removeClass('active');
        $(e).addClass('active');
        $('#template-site .modal-dialog .modal-content').find('.load-template').css('display', 'block');
        $.processON();

        // var widthSize = ($(e).attr('class').indexOf('desktop') > -1) ? '100%' : '100%';
        // widthSize = ($(e).attr('class').indexOf('tablet') > -1) ? ($(e).attr('class').indexOf('mobile') > -1 ? '360px' : '770px') : widthSize;

        var widthSize = '';
        if($(e).attr('class').indexOf('desktop') > -1) widthSize = '100%';
        else if($(e).attr('class').indexOf('tablet') > -1) widthSize = '785px';
        else  widthSize = '433px';

        $('#template-site .modal-dialog .modal-content').css({
            'max-width': 'unset',
            'width': widthSize,
            'height': '86.5%'
        });
        setTimeout(function() {
            $.processOFF();
            $('#template-site .modal-dialog .modal-content').find('.load-template').fadeOut(200);
        }, 650);
        setTimeout(function() { // aos height resize
            $('#template-site .modal-dialog .modal-content').css('height', '86.6%');
        }, 800);
    }



    function previewModeChange1(e) {

        var hashId = $(e).attr('id');
        location.hash = hashId;

        $('.template-mode').removeClass('active');
        $(e).addClass('active');
        $('#previewmain .modal-content-pre').find('.load-template').css('display', 'block');
        $.processON('Loading...');

        var widthSize = '';
        if ($(e).attr('class').indexOf('desktop') > -1) widthSize = '100%';
        else if ($(e).attr('class').indexOf('tablet') > -1) widthSize = '785px';
        else widthSize = '431px';
        $('#previewmain .modal-content-pre').css({
            'max-width': 'unset',
            'width': widthSize
        });

        // setTimeout(function(){          
        //     $.processOFF();     
        //     $('#previewmain .modal-content-pre').find('.load-template').fadeOut(200);
        // },650);  

        //0206라이브 업뎃 복원용 
        //$("#iframe1").get(0).contentDocument.location.reload();

        //0206 업뎃 후 문제 시 삭제 
        $("#iframe1").get(0).contentWindow.location.reload();

        $("#iframe1").off('load').on('load', function(e) {
            $.processOFF();
            $('#previewmain .modal-content-pre').find('.load-template').fadeOut(200);
        });
    }

    function templateModeDefault(width) {
        var widthSize = '';
        if (width > 1199) {
            widthSize = '100%';
        } else if (width <= 1199 && width >= 768) {
            widthSize = '785px';
        } else if (width <= 767) {
            widthSize = '431px';
        }

        $('#template-site .modal-dialog .modal-content').css({
            'max-width': 'unset',
            'width': widthSize
        });

    }

    // 인증창 호출 함수
    function auth_type_check(outside) {
        if (typeof outside === 'undefined' || !outside) outside = false;

        var auth_form = document.form_auth;

        if (auth_form.ordr_idxx.value == "") {
            alert("요청번호는 필수 입니다.");
            return false;
        } else {
            var hostname = window.location.hostname;
            var checkDomain = !(hostname.includes('creatorlink') || hostname.includes('addblock'));

            if (checkDomain && window.location.protocol == 'http:') {
                alert($.lang[LANG]['manager.cert.disable.domain']);
                return false
            }

            if( navigator.userAgent.indexOf("Android") > - 1 || navigator.userAgent.indexOf("iPhone") > - 1 )
            {
                auth_form.target = "kcp_cert";
            }
            else // 스마트폰이 아닌경우
            {
                var return_gubun;
                var width = 410;
                var height = 500;

                var leftpos = screen.width / 2 - (width / 2);
                var toppos = screen.height / 2 - (height / 2);

                var winopts = "width=" + width + ", height=" + height + ", toolbar=no,status=no,statusbar=no,menubar=no,scrollbars=no,resizable=no";
                var position = ",left=" + leftpos + ", top=" + toppos;
                var AUTH_POP = window.open('', 'auth_popup', winopts + position);

                auth_form.target = "auth_popup"; // !!주의 고정값 ( 리턴받을때 사용되는 타겟명입니다.)
            }

            auth_form.method = "post";

            // 인증창 호출 및 결과값 리턴 페이지 주소
            if(window.location.pathname.includes('/upgrade') || window.location.pathname.includes('/mypage') || window.location.pathname.includes('/dashboard')) {
                auth_form.action = '/upgrade/cert_req';
            } else {
                auth_form.action = "/cert_req";
            }

            if (outside) {
                auth_form.submit();
                return false;
            } else {
                return true;
            }
        }
    }

    // 요청번호 생성 예제 ( up_hash 생성시 필요 ) 
    function init_orderid() {
        var today = new Date();
        var year = today.getFullYear();
        var month = today.getMonth() + 1;
        var date = today.getDate();
        var time = today.getTime();

        if (parseInt(month) < 10) {
            month = "0" + month;
        }

        var vOrderID = year + "" + month + "" + date + "" + time;

        if (document.form_auth !== undefined) {
            document.form_auth.ordr_idxx.value = vOrderID;
        }

        return vOrderID;
    }

    // 인증창 종료후 인증데이터 리턴 함수
    function auth_data(frm) {
        var auth_form = document.form_auth;
        // var nField        = frm.elements.length;
        // var response_data = "";

        // // up_hash 검증 
        if (frm.up_hash != auth_form.veri_up_hash.value) {
            alert("up_hash 변조 위험있음");
        }

        //스마트폰 처리
        if( navigator.userAgent.indexOf("Android") > - 1 || navigator.userAgent.indexOf("iPhone") > - 1 )
        {
            let iframe = document.getElementById("kcp_cert");
            if (iframe) iframe.parentNode.removeChild(iframe);
            // document.getElementById("kcp_cert").style.display = "none";
        }
        /* 리턴 값 모두 찍어보기 (테스트 시에만 사용) */
        // var form_value = "";

        // for ( i = 0 ; i < frm.length ; i++ )
        // {
        //     form_value += "["+frm.elements[i].name + "] = [" + frm.elements[i].value + "]\n";
        // }
        // console.log(form_value);
        if (frm.res_cd == '0000' && frm.birth_day !== undefined) {
            var yyyy = frm.birth_day.substr(0, 4);
            var mm = frm.birth_day.substr(4, 2);
            var dd = frm.birth_day.substr(6, 2);
        }

        switch (frm.start_page) {
            case 'register':
            case 'myinfo':
                if (frm.res_cd == '0000') {
                    $('button.btn-cert').text($.lang[LANG]['siteum.regexp.complete.cert']).prop('disabled', true);
                    if (frm.start_page == 'register') loadRegisterField();
                } else {
                    if (frm.res_cd == 'exist') {
                        var error_title = '';
                        var error_msg = '';
                        var find_btn = $.lang[LANG]['siteum.forgot.id.link'];
                        if (frm.um_id != '') {
                            if (frm.start_page == 'register') {
                                error_title = $.lang[LANG]['siteum.cert.already.registered'];
                                error_msg = $.lang[LANG]['siteum.cert.already.registered.txt'] + '<div class="user-id">' + frm.um_id + '</div>';
                            } else {
                                error_title = $.lang[LANG]['siteum.cert.already.cert'];
                                error_msg = $.lang[LANG]['siteum.cert.already.cert.txt'] + '<div class="user-id">' + frm.um_id + '</div>';
                            }

                            find_btn = $.lang[LANG]['siteum.forgot.pw.link'];
                        }
                        $(this).showModalFlat(error_title, error_msg, true, true, function() {
                            $('input[name="sns_key"]').val('');
                            console.log($('input[name="sns_key"]'));
                            $.getJSON('/umember/login/out', function(r) {
                                // if (frm.start_page == 'myinfo') {
                                //     if ($.cookie('cert_popup') !== undefined) {
                                //         $.removeCookie('cert_popup', true, { path: '/', expires: 12 * 60 * 60 * 1000 });
                                //     }
                                // }
                                location.href = '/_login';
                            }, 'json');
                        }, 'close', $.lang[LANG]['siteum.cert.login'], 'modal-dialog cl-cmmodal cl-s-btn w560 cl-p70 cl-modal cl-close-btn user-exist-modal', '');
                    } else if (frm.res_cd == 'not_adult') {
                        $(this).showModalFlat($.lang[LANG]['siteum.cert.adult.cannot.complete'], $.lang[LANG]['siteum.cert.adult.cannot.complete.txt'], true, false, '', 'ok', '', 'modal-dialog cl-cmmodal cl-s-btn w560 cl-p70 cl-modal cl-close-btn');
                    }

                    return false;
                }
                var sid = frm.sid;
                var gender = (frm.sex_code !== undefined && frm.sex_code) ? ((frm.sex_code == '01') ? '남' : '여') : '';
                $('#input-name').val(frm.user_name).addClass('has-value');
                $('#input-birth').val(yyyy + '-' + mm + '-' + dd).addClass('has-value');
                $('#input-tel').val(frm.phone_no).addClass('has-value');
                $('#input-gender').val(frm.sex_code).addClass('has-value');
                $('.certified-info .input-name').text(frm.user_name);
                $('.certified-info .input-birth').text(yyyy + '. ' + mm + '. ' + dd + '.');
                $('.certified-info .input-tel').text(frm.phone_no.replace(/^(\d{3})(\d{3,4})(\d{4})$/, '$1-$2-$3'));
                $('.certified-info .input-gender').text(gender);
                $('#cert_data').val(frm.cert_data);
                $('#cert_no').val(frm.cert_no);
                // $('#up_hash').val(frm.up_hash);
                // $('#ci_url').val(frm.ci_url);
                // $('#di_url').val(frm.di_url);
                $('.cl-s-register-btn').removeClass('hide');
                $('.cl-s-cert').addClass('hide');
                if (frm.start_page == 'myinfo') {
                    var formData = $("form[name='myinfo_form']").serializeObject();
                    $.ajax({
                        url: '/_myinfo_proc',
                        data: { sid: sid, data: JSON.stringify(formData) },
                        dataType: 'json',
                        type: 'POST',
                        async: false,
                        cache: false,
                        success: function(data) {
                            // console.log(data);
                            location.reload();
                        }
                    });
                }
                break;
            case 'find_id':
                if (frm.res_cd == '0000') {
                    $('.cl-s-forgot-box').addClass('hide');
                    $('.forgot-result').removeClass('hide');
                    $('.forgot-result .user-id').text(frm.um_id);
                } else {
                    $(this).showModalFlat($.lang[LANG]['siteum.forgot.id.invalid'], $.lang[LANG]['siteum.forgot.id.invalid.txt'], true, true, function() {
                        location.href = '/_register';
                    }, 'close', $.lang[LANG]['siteum.forgot.id.register'], 'modal-dialog cl-cmmodal cl-s-btn w560 cl-p70 cl-modal cl-close-btn', '');
                    return false;
                }
                break;
            case 'sitelock':
                break;
        }
    }

    var iconShowHide = function() {
        var body_w = $('body').width();
        $('.template-mode').removeClass('active');
        if (body_w >= 1200) {
            $('.template-desktop, .template-tablet, .template-mobile').show();
            $('.template-desktop').addClass('active');
        } else if (body_w <= 1199 && body_w >= 768) {
            $('.template-desktop').hide();
            $('.template-tablet, .template-mobile').show();
            $('.template-tablet').addClass('active');
        } else if (body_w <= 767) {
            $('.template-desktop, .template-tablet').hide();
            $('.template-mobile').show().addClass('active');
        }
    }

    var checkOS = function() {
        var os, ua = navigator.userAgent;
        if (ua.match(/Win(dows )?NT 6\.0/)) {
            os = "Windows Vista";
        } else if (ua.match(/Win(dows )?(NT 5\.1|XP)/)) {
            os = "Windows XP";
        } else {
            if ((ua.indexOf("Windows NT 5.1") != -1) || (ua.indexOf("Windows XP") != -1)) {
                os = "Windows XP";
            } else if ((ua.indexOf("Windows NT 7.0") != -1) || (ua.indexOf("Windows NT 6.1") != -1)) {
                os = "Windows 7";
            } else if ((ua.indexOf("Windows NT 8.0") != -1) || (ua.indexOf("Windows NT 6.2") != -1)) {
                os = "Windows 8";
            } else if ((ua.indexOf("Windows NT 8.1") != -1) || (ua.indexOf("Windows NT 6.3") != -1)) {
                os = "Windows 8.1";
            } else if ((ua.indexOf("Windows NT 10.0") != -1) || (ua.indexOf("Windows NT 6.4") != -1)) {
                os = "Windows 10";
            } else if ((ua.indexOf("iPad") != -1) || (ua.indexOf("iPhone") != -1) || (ua.indexOf("iPod") != -1)) {
                os = "Apple iOS";
            } else if (ua.indexOf("Android") != -1) {
                os = "Android OS";
            } else if (ua.match(/Win(dows )?NT( 4\.0)?/)) {
                os = "Windows NT";
            } else if (ua.match(/Mac|PPC/)) {
                os = "Mac OS";
            } else if (ua.match(/Linux/)) {
                os = "Linux";
            } else if (ua.match(/(Free|Net|Open)BSD/)) {
                os = RegExp.$1 + "BSD";
            } else if (ua.match(/SunOS/)) {
                os = "Solaris";
            }
        }
        if (os.indexOf("Windows") != -1) {
            if (navigator.userAgent.indexOf('WOW64') > -1 || navigator.userAgent.indexOf('Win64') > -1) {
                os += ' 64bit';
            } else {
                os += ' 32bit';
            }
        }
        return os;
    }

    var checkBrowser = function() {
        var agt = navigator.userAgent.toLowerCase();
        if (agt.indexOf("chrome") != -1) return 'Chrome';
        if (agt.indexOf("opera") != -1) return 'Opera';
        if (agt.indexOf("staroffice") != -1) return 'Star Office';
        if (agt.indexOf("webtv") != -1) return 'WebTV';
        if (agt.indexOf("beonex") != -1) return 'Beonex';
        if (agt.indexOf("chimera") != -1) return 'Chimera';
        if (agt.indexOf("netpositive") != -1) return 'NetPositive';
        if (agt.indexOf("phoenix") != -1) return 'Phoenix';
        if (agt.indexOf("firefox") != -1) return 'Firefox';
        if (agt.indexOf("safari") != -1) return 'Safari';
        if (agt.indexOf("skipstone") != -1) return 'SkipStone';
        if (agt.indexOf("netscape") != -1) return 'Netscape';
        if (agt.indexOf("mozilla/5.0") != -1) return 'Mozilla';
        if (agt.indexOf("msie") != -1) {
            let rv = -1;
            if (navigator.appName == 'Microsoft Internet Explorer') {
                let ua = navigator.userAgent;
                var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                if (re.exec(ua) != null)
                    rv = parseFloat(RegExp.$1);
            }
            return 'Internet Explorer ' + rv;
        }
    }

    /**************************************************************************************** Change Profile */
    $('.change-profile, .profile_left').live('click', function(e) {
        if ($('script[src="/js/jquery.fileupload.js"]').length == 0) $('head').append('<script type="text/javascript" src="/js/jquery.fileupload.js"></script>');

        if($(this).hasClass('signinwrap_logo')) return;

        var name = ($(this).attr('class').indexOf('change-profile') > -1) ? $('.site-username').attr('data-user-name') : $('.profile_left').find('.m-profile').text().trim(),
            img = ($(this).attr('class').indexOf('change-profile') > -1) ? $('svg.change-profile').attr('data-user-img') : $('label.m-profile').attr('data-user-img'),
            paid = ($(this).attr('class').indexOf('change-profile') > -1) ? $('svg.change-profile').attr('data-user-plan') : $('label.m-profile').attr('data-user-plan'),
            check_um = ($(this).attr('class').indexOf('change-profile') > -1) ? $('svg.change-profile').attr('data-user-um') : $('label.m-profile').attr('data-user-um');
        if (check_um == 'um-profile') {
            //var mypageModal = $.umember.showMypageModal('<?=$mb["sid"]?>');
            var url = '/_myinfo';
            location.href = url;
        } else if (paid == 'true') {
            img = (typeof img == 'undefined' || img == '') ? 'https://storage.googleapis.com/i.addblock.net/member/profile_default.jpg' : img + '?_' + new Date().getTime();
            var str = '\
                <div class="dashboard-profile">\
                    <div class="dashboard-userimg dashboard-user-wrap">\
                        <svg viewBox="0 0 110 110" >\
                            <pattern id="dashboard-image-popup" patternUnits="userSpaceOnUse" width="120" height="120">\
                                <image xlink:href="' + img + '" x="0" width="110" height="110" />\
                            </pattern>\
                            <circle cx="55" cy="56" r="54" fill="url(#dashboard-image-popup)" stroke="#eeeff0"></circle>\
                        </svg>\
                    </div>\
                    <span class="fileinput-button profile-text-box">\
                        <label for="siteProfilefileupload">' + $.lang[LANG]['siteum.mypage.change.image'] + '</label>\
                        <input id="siteProfilefileupload" class="modal-upload-button site-profile-upload-btn" type="file" name="files[]">\
                    </span>\
                    <p class="p-text">' + $.lang[LANG]['dash.siteprofile.modal.nickname'] + $.lang[LANG]['account.modal.edit-image.size'] + '</p>\
                    <div class="section-username">\
                        <div class="input-group cl-common-form-wrap mypage-cl-form-wrap">\
                            <div class="cl-common-form-group cl-userNick-wrap">\
                                <input type="text" class="input-userNickname" name="usernick_name" required="required"  value="' + name + '">\
                                <label for="input" id="username-label" class="cl-common-control-label change-username-label">' + $.lang[LANG]['account.modal.edit-image.nickname'] + '</label>\
                            </div>\
                        </div>\
                        <p class="siteprofileImg_notice"><span class="profilenotice_icon">※</span><span class="profilenotice_txt">' + $.lang[LANG]['dash.siteprofile.modal.nickname.notice'] + '</span</p>\
                    </div>\
                    <ul class="hide uploadfiles"></ul>\
                </div>\
            ';

            if ($(this).hasClass('profile_left')) $('.m-header_user.menu, .btn-box.m-headerClose.in ').css('zIndex', '1010');

            var modal = $(this).showModalFlat($.lang[LANG]['dash.siteprofile.modal.title'], str, true, true, function() {
                var modal_id = $(this).closest('.modal').attr('id'),
                    $nick = $('.input-userNickname'),
                    org = $('.site-username').attr('data-user-name'),
                    sid = SID,
                    settings = {
                        site_nick: $nick.val().trim()
                    },
                    special_pattern = /[~!@\#$%<>^&*\()\-=+_\’'"]/gi,
                    uploadimg = $('#dashboard-image-popup1 image').attr('xlink:href'),
                    nouploadimg = $('#dashboard-image-top image').attr('xlink:href'),
                    profileimg = ($('label.change-profile').hasClass('um-profile')) ? 'profileimg_um' : 'profileimg_site';

                if ($('#dashboard-image-popup1').length > 0) {
                    $.post('/template/resource/upload-saveprofile', { uploadimg: uploadimg, profileimg: profileimg }, function(data) {
                        if (typeof data.error != "undefined" && data.error) {
                            $(this).showModalFlat('ERROR', data.error, true, false, '', 'ok');
                            return false;
                        }
                        $('svg.change-profile').attr('data-user-img', uploadimg);
                        $('label.m-profile').attr('data-user-img', uploadimg);
                        $('#dashboard-image-top image').attr('xlink:href', uploadimg);
                        $('#m-dashboard-image-top image').attr('xlink:href', uploadimg);

                        modal.modal('hide');
                    }, 'json');
                }

                $nick.removeClass('has-error');
                if (!$nick.val().trim()) {
                    $nick.addClass('has-error');
                    alert($.lang[LANG]['dashbord.settings.info.site-nick.edit-info']);
                    return false;
                } else if ($nick.val().trim() == org) {
                    modal.modal('hide');
                    return false;
                } else if (checkEmojis($nick.val().trim())) {
                    errorEmojisModal();
                    return false;
                }

                if ((special_pattern.test($nick.val().trim()) == true)) {
                    alert($.lang[LANG]['dashbord.settings.info.site-nick.edit-spec']);
                    return false;
                }

                $.post('/template/settings', {
                    'sid': sid,
                    'settings': JSON.stringify(settings),
                    'el': ''
                }, function(data) {
                    if (typeof data.error != 'undefined' && data.error) {
                        $nick.addClass('has-error');
                        alert(data.error);
                        return false;
                    }

                    $('.m-text-size').text(data.data.site_nick).attr('data-user-name', data.data.site_nick);
                    $('.site-username').attr('data-user-name', data.data.site_nick);
                    $('.mb-nickname').text(data.data.site_nick);
                    $('#register-nickname input.edit-input').attr('value', data.data.site_nick);

                    $('.cl-changePro-modal ul.uploadfiles').empty();
                    modal.modal('hide');
                }, 'json');
            }, 'cancel', 'config.change', 'cl-cmmodal cl-s-btn w560 cl-p130 cl-p0 cl-changePro-modal', true, function() {
                //console.log('showCallback-cancel');
                var imgfile = $('.cl-changePro-modal .uploadfiles li').attr('data-source'),
                    files = [];

                $('.cl-changePro-modal .uploadfiles li').each(function() {
                    files.push($(this).attr('data-source'));
                });

                $('.cl-changePro-modal .uploadfiles').empty();
                if ($('#dashboard-image-popup1').length > 0) {
                    $.processON($.lang[LANG]['dash.siteprofile.modal.deleteimg']);
                    $.ajax({
                        type: 'POST',
                        url: '/template/resource/delete-gcloud',
                        data: { s: files },
                        dataType: 'json',
                        async: true,
                        success: function(data) {
                            if (typeof data.error != "undefined" && data.error) {
                                $(this).showModalFlat('ERROR', data.error, true, false, '', 'ok');
                                return false;
                            }
                            $.processOFF();
                        }
                    });
                }
            }, function() {
                $(document).on('click', '.site-profile-upload-btn', function() {
                    $(this).fileupload({
                            url: '/template/resource/upload-myimage-file',
                            dataType: 'json',
                            async: true,
                            pasteZone: null,
                            add: function(e, data) {
                                $('#loading').css('left', '-100%');
                                $.processON();
                                data.submit();
                            },
                            done: function(e, data) {
                                if (typeof data.result.error != 'undefined' && data.result.error) {
                                    alert(data.result.error);
                                    $('.progress .progress-bar').css('width', '0%');
                                    $.processOFF();
                                    return;
                                }

                                if (data.result.src) {
                                    var src1 = '<svg viewBox="0 0 110 110" ><pattern id="dashboard-image-popup1" patternUnits="userSpaceOnUse" width="120" height="120"><image xlink:href="' + data.result.src + '" x="0" width="110" height="110"></image></pattern><circle cx="55" cy="56" r="54" fill="url(#dashboard-image-popup1)" stroke="#eeeff0"></circle></svg>\
                                    ',
                                        src2 = '<svg viewBox="0 0 110 110" ><pattern id="dashboard-image-popup2" patternUnits="userSpaceOnUse" width="120" height="120"><image xlink:href="' + data.result.src + '" x="0" width="110" height="110"></image></pattern><circle cx="55" cy="56" r="54" fill="url(#dashboard-image-popup2)" stroke="#eeeff0"></circle></svg>\
                                        ',
                                        read_upload_file = '<li data-source="' + data.result.file_name + '"><img src="' + data.result.src + '"></li>';

                                    $('.dashboard-userimg').html(src1);
                                    $('.cl-changePro-modal ul.uploadfiles').append(read_upload_file);
                                    //$('label.change-profile').html(src2).attr('data-user-img',data.result.src);
                                    //$('.dashboard-userimg').attr('data-imgsave',data.result.path+'/'+data.result.raw_name);

                                }
                                $.processOFF();
                                $('#loading').css('left', '50%');
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
                });
            }, function() {
                $('.m-header_user.menu, .btn-box.m-headerClose.in ').css('zIndex', '');
            });
        } else {
            siteNotice('nickname');
        }

    });

    /***********************************************************************************************************************************************/

    var setLayoutHeight = function(el) {
        if(typeof el != 'undefined' && $.inArray(el, ['el-menu','el-footer']) > -1) return false;

        var block_selector = (typeof el != 'undefined' && el == 'el_display') ? '#element-display' : '.element[data-layout]';
        if($(block_selector).length == 0) return false;

        $(block_selector).each(function() {
            if($(this).is('[data-mode="thumb"]') || $(this).find('.layout-grid').length ==0) return;

            var lyh = (typeof $(this).find('.lyoption').attr('data-lyh') != 'undefined') ? $(this).find('.lyoption').attr('data-lyh') : 0.6;
            if (typeof lyh == 'undefined' || lyh == 'auto') return;

            var el = $(this).find('.layout-grid').eq(0),
                bl_w = Math.round(parseFloat(el[0].offsetWidth)),
                bl_pl = (el.css('padding-left')) ? Math.round(parseFloat(el.css('padding-left').replace(/[^0-9]/g, ''))) : 15,
                bl_pr = (el.css('padding-right')) ? Math.round(parseFloat(el.css('padding-right').replace(/[^0-9]/g, ''))) : 15,
                bl_w_pd = bl_w - (bl_pl + bl_pr),
                bl_ly_height = Math.round(bl_w_pd * parseFloat(lyh));

            $(this).find('.row .video-content').css('height', bl_ly_height + 'px');
            $(this).find('.ly-img').css('height', bl_ly_height + 'px');
            // if ($(this).attr('data-mode') == 'thumb' && $(this).attr('data-playtype') == 'true') $(this).find('iframe').css('height', bl_ly_height + 'px');

            var bl_svg_val = (bl_w_pd < 233) ? Math.round(parseFloat(bl_w_pd * 0.25)) : 58;
            $(this).find('.playbtn').attr('width', bl_svg_val).attr('height', bl_svg_val);
            $(this).css('overflow', 'hidden');
        });

    }

    var getLayoutData = function(tag) {
        var tag_ly_arr = [],
            tag_pd = (typeof tag.find('.lyoption').attr('data-lypd') != 'undefined' && tag.find('.lyoption').attr('data-lypd')) ? tag.find('.lyoption').attr('data-lypd') : '15',
            tag_pc = (typeof tag.find('.lyoption').attr('data-lycol') != 'undefined' && tag.find('.lyoption').attr('data-lycol')) ? tag.find('.lyoption').attr('data-lycol') : '4',
            tag_t = (typeof tag.find('.lyoption').attr('data-lycol-t') != 'undefined' && tag.find('.lyoption').attr('data-lycol-t')) ? tag.find('.lyoption').attr('data-lycol-t') : '2',
            tag_m = (typeof tag.find('.lyoption').attr('data-lycol-m') != 'undefined' && tag.find('.lyoption').attr('data-lycol-m')) ? tag.find('.lyoption').attr('data-lycol-m') : '2',
            tag_lyw = (typeof tag.find('.lyoption').attr('data-lyw') != 'undefined' && tag.find('.lyoption').attr('data-lyw')) ? tag.find('.lyoption').attr('data-lyw') : (tag_pc == '1' ? '100' : 'auto'),
            tag_lyh = (typeof tag.find('.lyoption').attr('data-lyh') != 'undefined' && tag.find('.lyoption').attr('data-lyh')) ? tag.find('.lyoption').attr('data-lyh') : '0.6',
            tag_orgw = (typeof tag.find('.lyoption').attr('data-org-width') != 'undefined' && tag.find('.lyoption').attr('data-org-width')) ? tag.find('.lyoption').attr('data-org-width') : ''

        var bl_cont = tag.find('.container'),
            bl_cont_w = parseFloat(bl_cont[0].offsetWidth),
            layout_grid = $('.' + selectEL).find('.layout-grid').eq(0),
            bl_w = parseFloat(layout_grid[0].offsetWidth),
            bl_pl = (layout_grid.css('padding-left')) ? parseFloat(layout_grid.css('padding-left').replace(/[^0-9]/g, '')) : 15,
            bl_pr = (layout_grid.css('padding-right')) ? parseFloat(layout_grid.css('padding-right').replace(/[^0-9]/g, '')) : 15,
            bl_lyw = (tag_pc == '1') ? Number(tag_lyw) : '',
            bl_lyw_dot = (tag_pc == '1') ? bl_lyw / 100 : '',
            bl_cont_w_re = (tag_pc == '1') ? (bl_cont_w - (bl_pl + bl_pr)) * bl_lyw_dot : '';

        tag_ly_arr['pc'] = tag_pc;
        tag_ly_arr['t'] = tag_t;
        tag_ly_arr['m'] = tag_m;
        tag_ly_arr['lyw'] = tag_lyw;
        tag_ly_arr['pd'] = tag_pd;
        tag_ly_arr['lyh'] = tag_lyh;
        tag_ly_arr['bl_cont_w'] = bl_cont_w;
        tag_ly_arr['bl_w'] = bl_w;
        tag_ly_arr['bl_pl'] = bl_pl;
        tag_ly_arr['bl_pr'] = bl_pr;
        tag_ly_arr['bl_lyw_dot'] = bl_lyw_dot;
        tag_ly_arr['bl_cont_w_re'] = bl_cont_w_re;

        return tag_ly_arr;
    }


    $(document).on('click', '.guestbook-fr-35, .btn-ico-right', function(e) {
        $(this).prev().click();
    });
    $(document).on('click', '.tpl-forum-toolbar-button.share', function(e) {
        var option = $(this).closest('.tpl-page-toolbar').attr('data-page-option');
        if (option == 'S') {
            $(this).showModalFlat('INFORMATION', $.lang[LANG]['config.gallery.share.cannot.secret-post'], true, false, '', 'ok', '', 'cl-cmmodal cl-s-btn w560 cl-p130 cl-t80 cl-modal cl-none-title');
            return false;
        }
        if (typeof MODE == 'undefined' && property.PUBLISH) shareModal();
        else $(this).showModalFlat($.lang[LANG]['config.information'], $.lang[LANG]['config.gallery.share.publish'], true, false, '', 'ok', '', 'cl-cmmodal cl-s-btn w560 cl-p130 cl-p0 cl-okbtn-pbt70');
    });

    $(document).on('click', '.tpl-forum-toolbar-button.like', function(e) {
        var page = (PAGE_MODE == 'c') ? PAGE : property.PAGE;
        if (page.indexOf(',') > -1) {
            var page = (PAGE_MODE == 'c') ? PAGE.split(',') : (property.PAGE).split(',');
            var npage = (page[0] == 'forum') ? 'forum' : 'project';
            var $el = (npage == 'forum') ? $(this).find('button') : $(this);
            setLike($el, npage);
        } else {
            return false;
        }
    });
    $(document).on('click', 'a.gallery-like', function(e) {
        setLike($(this), 'gallery');
    });
    $(document).on('click', '.figure.like > *', function(e) {
        var $this = $(this).closest('.figure.like');
        if ($this.closest('.emptyGallery').length > 0) return false;
        setLike($this, 'list');
    });
    // $(document).on('click','.element[data-type2="qna"] .tpl-forum-list-like, .element[data-type2="faq"] .tpl-forum-list-like, .element[data-type2="guestbook"] .tpl-forum-list-like', function(e) {
    //     var $this = $(this);
    //     setLike($this, 'flist');
    // });
    $(document).on('click', '.element a[data-popup][data-popup-name]', function(e){
        e.preventDefault();
        e.stopPropagation();
        var iVALIDPLAN = (PAGE_MODE == 'c') ? VALIDPLAN : property.VALIDPLAN;
        var iVALIDTYPE = (PAGE_MODE == 'c') ? VALIDTYPE : property.VALIDTYPE;
        if(iVALIDPLAN && iVALIDTYPE != 'PK') imgPopupFrame($(this));
    });

    var checkUseCommentFunc = function(mode, eltag) {
        var check = false;
        if (mode == 'project') {
            var notUseComment = ['gallery_38', 'gallery_37', 'gallery_36', 'gallery_28', 'gallery_25', 'gallery_22', 'gallery_21', 'gallery_8', 'gallery_6'];
            var $eltag = $(htmlspecialchars_decode(eltag, 'ENT_QUOTES'));
            var tplImg = $eltag.find('img').attr('src');
            var notUseCommentCnt = 0;
            $.each(notUseComment, function(i, v) {
                if (typeof tplImg !== 'undefined' && tplImg.indexOf(v) > -1) {
                    notUseCommentCnt++;
                    return false;
                }
            });
            check = ($eltag.find('h5.figure').eq(0).hasClass('only-sh') || !$eltag.find('h5.figure').eq(0).hasClass('title') || !$eltag.find('p.figure').eq(0).hasClass('caption') || notUseCommentCnt > 0) ? false : true;
        }

        return check;
    }

    var checkUseLikeFunc = function(mode, eltag) { //like
        var check = false;
        var notUseLike = ['gallery_38', 'gallery_37', 'gallery_36', 'gallery_28', 'gallery_25', 'gallery_22', 'gallery_21', 'gallery_8', 'gallery_6'];
        // var umemberActivate = (PAGE_MODE == 'c')? UMEMBER_ACTIVATE : property.UMEMBER_ACTIVATE;
        // if(umemberActivate == 0) {
        //     return false;
        // }
        var lVALIDPLAN = (PAGE_MODE == 'c') ? VALIDPLAN : property.VALIDPLAN;
        if (!lVALIDPLAN) return false;
        switch (mode) {
            case 'project':
            case 'gallery':
                var $eltag = $(htmlspecialchars_decode(eltag, 'ENT_QUOTES'));
                var tplImg = $eltag.find('img').attr('src');
                var notUseLikeCnt = 0;
                $.each(notUseLike, function(i, v) {
                    if (typeof tplImg !== 'undefined' && tplImg.indexOf(v) > -1) {
                        notUseLikeCnt++;
                        return false;
                    }
                });
                check = ($eltag.find('h5.figure').eq(0).hasClass('only-sh') || !$eltag.find('h5.figure').eq(0).hasClass('title') || !$eltag.find('p.figure').eq(0).hasClass('caption') || notUseLikeCnt > 0) ? false : true;

                break;
        }

        return check;
    }

    var getRgbaValArray = function(bg_color, opacity_val) {
        var bgColorArr = [],
            setColorArr = [],
            opacity_val = (typeof opacity_val != 'undefined' && opacity_val) ? opacity_val : '';

        if (typeof bg_color == 'undefined') return;
        if (bg_color == 'transparent' || !bg_color || bg_color == 'none') opacity_val = '0';
        bg_color = (bg_color == 'transparent' || !bg_color || bg_color == 'none') ? 'rgba(255,255,255,' + opacity_val + ')' : bg_color;

        if (bg_color.indexOf('#') > -1) {
            if (bg_color.length < 5) {
                var str_color = bg_color.substring(1, bg_color.length);
                bg_color += str_color;
            }

            var bgColorArr_re = Object.values(hexToRgba(bg_color));
            setColorArr['r'] = bgColorArr_re['0'].toString();
            setColorArr['g'] = bgColorArr_re['1'].toString();
            setColorArr['b'] = bgColorArr_re['2'].toString();
            setColorArr['a'] = '1';
        } else setColorArr = rgbaToOpacity(bg_color);

        bg_color = 'rgb(' + setColorArr.r + ',' + setColorArr.g + ',' + setColorArr.b + ')'
        if (opacity_val != '' && (setColorArr.a != opacity_val)) setColorArr.a = opacity_val;

        bgColorArr['rgba'] = setColorArr;
        bgColorArr['val'] = bg_color;
        bgColorArr['rgba_txt'] = 'rgba(' + setColorArr.r + ',' + setColorArr.g + ',' + setColorArr.b + ',' + setColorArr.a + ')';

        return bgColorArr;
    }

    var getColorAndOpacity = function(bc_selector, css, css_change_opt, change_color_array) {
        var bg_info = {},
            bg_opt_color = (typeof change_color_array == 'undefined' && !change_color_array) ? getColor(bc_selector, css, css_change_opt) : change_color_array,
            bg_opt_color_val = bg_opt_color['val'],
            bg_transparent_class = (bg_opt_color_val == 'transparent' || !bg_opt_color_val) ? ' transparent' : '',
            bg_opt_opacity_percent = (bg_opt_color_val == 'transparent' || !bg_opt_color_val) ? 0 : (bg_opt_color['rgba']['a'] * 100),
            bg_opt_opacity_dot = (bg_opt_color_val == 'transparent' || !bg_opt_color_val) ? 0 : (bg_opt_opacity_percent / 100);


        if (css_change_opt == 'background-color' &&
            typeof css['children'][bc_selector] != 'undefined' &&
            typeof css['children'][bc_selector]['attributes'] != 'undefined' &&
            typeof css['children'][bc_selector]['attributes']['opacity'] != 'undefined'
        ) {
            var this_opacity = css['children'][bc_selector]['attributes']['opacity'];
            if (this_opacity == '1' && css['children'][bc_selector]['attributes']['background-color'] == 'transparent') {
                bg_opt_opacity_dot = 0;
                bg_opt_opacity_percent = 0;
            } else {
                if (this_opacity.match(/^[0-9\.]*$/g) !== null) {
                    bg_opt_opacity_dot = this_opacity;
                    bg_opt_opacity_percent = this_opacity * 100;
                }
            }

        }

        bg_info = {
            color: bg_opt_color,
            trans: bg_transparent_class,
            op_percent: bg_opt_opacity_percent,
            op_dot: bg_opt_opacity_dot,
        }

        return bg_info;
    }

    var getLoadBlockScript = function(blocks) {
        if (typeof blocks == 'undefined' || blocks.toString().length == 0) return { total: 0, list: {} };

        var script_names = {
                'gallery'   : ['comments','bottomlist'],
                'forum'     : ['forum','comments','bottomlist'],
                'latest'    : ['forum','latest'],
                'sns'       : ['socialfeed'],
                // 'contact'   : ['jqueryFileupload'],
                'countdown' : ['jqueryCountdown'],
                'shopping'  : ['shopping'],
                'review'    : ['reviewContents'],
            },
            script_path = {
                //'loadScript-???' : 'script path', 
                'aos'       : 'https://unpkg.com/aos@2.3.1/dist/aos.js',
                'shopping'  : '/js/shopping.js',
                'forum'     : '/js/module/forum.js',
                'latest'    : '/js/module/latest.js',
                'reviewContents'    : '/js/module/review_contents.js',
                'comments'  : '/js/module/comments.js',
                'bottomlist'    : '/js/module/bottomlist.js',
                'socialfeed'    : '/js/feed/socialfeed.js',
                // 'jqueryFileupload'  : '/js/jquery.fileupload.js',
                'jqueryCountdown'   : '/js/jquery.countdown.js',
            },
            script_total = 0,
            script_result = {};

        $.each(blocks, function(i, v) {
            if (v === false) return true;

            var sct_names = (typeof script_names[i] != 'undefined' && script_names[i]) ? script_names[i] : [];
            $.each(sct_names, function(idx, val) {
                if (typeof script_path[val] != 'undefined' && script_path[val]) {
                    if (typeof script_result[val] == 'undefined') script_total++;
                    script_result[val] = script_path[val];
                }
            })
        });

        return { total: script_total, list: script_result };
    }

    var loadingScript = function(r) {
        var deferred = $.Deferred();
        var script_r = getLoadBlockScript(r),
            script_total = (typeof script_r.total != 'undefined') ? script_r.total : 0,
            script_load = 0;

        if (script_total == 0) deferred.resolve();
        $.each(script_r.list, function(s_n, s_p) {
            if ($('.loadScript-' + s_n).length == 0) {
                $.ajax({
                    async: false,
                    url: s_p,
                    dataType: 'script',
                    success: function(data) {
                        $('head').append('<input type="hidden" class="loadScript-' + s_n + '" value="' + s_p + '">');
                        script_load++;
                    },
                    error: function(request, status, error) {
                        // console.log("code: " + request.status);
                        // console.log("message: " + request.responseText);
                        // console.log("error: " + error);
                    }
                }).done(function() {
                    if (script_load == script_total) deferred.resolve();
                });
            } else {
                script_load++;
                if (script_load == script_total) deferred.resolve();
            }
        });

        return deferred.promise();
    }

    var checkAosForParallax = function(siteSettings, blockSettings, $tag) {
            if ($tag.is('[data-type="gallery"][data-type2="premium"]') || $tag.has('input.gjs').length) {
                $tag.attr('data-aosinfo', false);
                return false;
            }

            var block_aos_site = (typeof siteSettings.block_aos != 'undefined' && siteSettings.block_aos) ? siteSettings.block_aos : {},
                block_aosAll_site = (typeof block_aos_site['all'] != 'undefined' && block_aos_site['all']) ? block_aos_site['all'] : {},
                aos_time_site = (typeof block_aosAll_site.t != 'undefined' && block_aosAll_site.t) ? block_aosAll_site.t : '',
                aos_motion_site = (typeof block_aosAll_site.m != 'undefined' && block_aosAll_site.m) ? block_aosAll_site.m : '',
                aos_duration_site = (typeof block_aosAll_site.d != 'undefined' && block_aosAll_site.d) ? block_aosAll_site.d : '700';

            var block_aos_page = (typeof blockSettings.block_aos != 'undefined' && blockSettings.block_aos) ? blockSettings.block_aos : {},
                aos_time_page = (typeof block_aos_page.t != 'undefined' && block_aos_page.t) ? block_aos_page.t : '',
                aos_motion_page = (typeof block_aos_page.m != 'undefined' && block_aos_page.m) ? block_aos_page.m : '',
                aos_duration_page = (typeof block_aos_page.d != 'undefined' && block_aos_page.d) ? block_aos_page.d : '700';


            if (block_aos_site && (aos_time_site > aos_time_page) && aos_motion_site != 'no-motion' &&
                $('body').find('.menu-lock-block').length < 1 && $('body').find('.site-lock-block').length < 1) {
                $tag.attr('data-aosinfo', true);
            } else {
                if ($.isEmptyObject(block_aos_page) == false && (aos_time_site < aos_time_page) && aos_motion_page != 'no-motion' &&
                    $('body').find('.menu-lock-block').length < 1 && $('body').find('.site-lock-block').length < 1) {
                    $tag.attr('data-aosinfo', true);
                } else {
                    $tag.attr('data-aosinfo', false);
                }
            }
        }
        // lux shopping
    var ChooseFilters = function(brand, search, mode) {
        var min = (mode == true) ? getProductParams('min_price') : getSearchURL('min_price'),
            max = (mode == true) ? getProductParams('max_price') : getSearchURL('max_price'),
            price = [10, 30, 50, 70, 100, 150, 200, 300, 500];
        s = '';
        if (typeof search == 'undefined') {
            s = '\
            <div class="prod-search-brand"><input type="text" class="search-brand-input" placeHolder="브랜드 검색" enterkeyhint="search">\
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>\
            </div>\
            ';
        }
        if (brand) {
            s = s + '\
            <button type="button" class="btn-v2 recommend-filter brand" data-key="brand" data-val="B00000IP">톰포드</button>\
            <button type="button" class="btn-v2 recommend-filter brand" data-key="brand" data-val="B00000DM">마크 제이콥스</button>\
            <button type="button" class="btn-v2 recommend-filter brand" data-key="brand" data-val="B00000BO">생로랑</button>\
            <button type="button" class="btn-v2 recommend-filter brand" data-key="brand" data-val="B00000BQ">버버리</button>\
            <button type="button" class="btn-v2 recommend-filter brand" data-key="brand" data-val="B000000C">구찌</button>\
            ';
        }

        s = s + '\
        <div class="filter-buttons">\
            <div class="btn-group product_type">\
                <button type="button" class="dropdown-toggle recommend-filter list-filter dropdown-button" data-toggle="dropdown">\
                    <span class="type_trend">상품유형</span>\
                    <svg width="12" height="12" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">\
                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"></path>\
                    </svg>\
                </button>\
                <ul class="dropdown-menu">\
                    <li data-key="trend" data-val="T0000000">브랜드홈</li>\
                    <li data-key="trend" data-val="T00000CQ">편집샵</li>\
                    <li data-key="trend" data-val="T00000CS">국내배송</li>\
                    <li data-key="trend" data-val="T00000HO">도매부티크</li>\
                </ul>\
            </div>\
            <div class="btn-group">\
                <button type="button" class="dropdown-toggle recommend-filter list-filter dropdown-button" data-toggle="dropdown">\
                    <span class="type_discount_rate">할인율</span>\
                    <svg width="12" height="12" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">\
                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"></path>\
                    </svg>\
                </button>\
                <ul class="dropdown-menu">\
                    <li data-key="discount_rate" data-val="sp">특가세일</li>\
                    <li data-key="discount_rate" data-val="10off">10off이하</li>\
                    <li data-key="discount_rate" data-val="10n30">10n30off</li>\
                    <li data-key="discount_rate" data-val="30n50">30n50off</li>\
                    <li data-key="discount_rate" data-val="50off">50off이상</li>\
                </ul>\
            </div>\
            <div class="btn-group">\
                <button type="button" class="dropdown-toggle recommend-filter list-filter dropdown-button" data-toggle="dropdown">\
                    <span class="type_min_price">최저가</span>\
                    <svg width="12" height="12" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">\
                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"></path>\
                    </svg>\
                </button>\
                <ul class="dropdown-menu">\
                    <li data-key="min_price" data-val="">선택안함</li>\
                    ' + setPriceHtml(price, 'min_price', max) + '\
                </ul>\
            </div>\
            <div class="btn-group">\
                <button type="button" class="dropdown-toggle recommend-filter list-filter dropdown-button" data-toggle="dropdown">\
                    <span class="type_max_price">최고가</span>\
                    <svg width="12" height="12" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">\
                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"></path>\
                    </svg>\
                </button>\
                <ul class="dropdown-menu">\
                    ' + setPriceHtml(price, 'max_price', min) + '\
                    <li data-key="max_price" data-val="">선택안함</li>\
                </ul>\
            </div>\
        </div>\
        ';
        return s;
    }

    var setPriceHtml = function(price, type, selected_price) {
        var s = '';
        $.each(price, function(i, v) {
            var active = '';
            if (type == 'min_price') {
                if (Number(selected_price) > 0 && v >= Number(selected_price)) {
                    active = 'disabled';
                }
            } else {
                if (Number(selected_price) > 0 && v <= Number(selected_price)) active = 'disabled';
            }
            // if(v == Number(getSearchURL(type))) active = 'active';
            s = s + '<li class="' + active + '" data-key="' + type + '" data-val="' + v + '">' + v + '만원</li>';
        });
        return s;
    }

    var lux_all_category;
    var getAllCategory = function(select, category, list, idx, no) {
        $.processON();
        $.ajax({
            type: 'POST',
            url: '/template/lux_category_all',
            data: { sid: SID },
            dataType: 'json',
            async: true,
            cache: false,
            success: function(r) {
                lux_all_category = r.root;
                $.processOFF();
                var html = setSelectCategoryHTML(r, true);
                if (typeof select != 'undefined') {
                    var $html = $(html);

                    $html.find('li').addClass('disable').css('display', 'none');
                    $html.find('li[data-category="' + select + '"]').removeClass('disable').addClass('active').css('display', '').empty().append(category);
                    $html.find('li.click-off').removeClass('disable');
                    if (Number(select) > 1000000) {
                        $html.find('.add-user-category').css('display', '');
                        $html.find('.input-user-category').css('display', 'none');
                    }
                    var s = (list.length == 1) ? displaySubCategoryList(lux_all_category[list[0]]['sub']) : displaySubCategoryList(lux_all_category[list[0]]['sub'][list[1]]['sub'], true);
                    $html.find('.add-user-category').before(s);
                    html = $html.outerHTML();
                }
                var modal = $(this).showModalFlat('상품연결', html, true, true, function() {
                    var choose = $('.choose-select-category li.active').attr('data-category');
                    if (typeof choose == 'undefined') {
                        alert('선택된 카테고리가 없습니다');
                        return false;
                    }
                    var s = '<ul class="active" data-sid="' + SID + '" data-no="' + ((typeof no != 'undefined') ? no : '') + '">',
                        $items = $('.choose-select-category li.active span'),
                        add = [],
                        updated = [];
                    $.each($items, function(i, v) {
                        s += '<li class="' + (($items.length == i + 1) ? 'last' : '') + '" data-category-no="' + $(this).attr('data-category') + '" data-seq="' + ((typeof $(this).attr('data-seq') == 'undefined') ? '' : $(this).attr('data-seq')) + '"><span class="user-category-text">' + $(this).text().trim() + '</span></li>\n';
                        add.push($(this).attr('data-category'));
                        updated.push((typeof $(this).attr('data-seq') == 'undefined') ? '' : $(this).attr('data-seq'));
                    });
                    s += '<div class="user-selected-category-delete" data-no=""><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path></svg></div>';
                    s += '</ul>';

                    // 기존 카테고리 
                    var selected = [];
                    $.each($('#lux-category-text ul'), function(i, v) {
                        var sub_selected = [];
                        $.each($(this).find('li'), function(a, b) {
                            sub_selected.push($(this).attr('data-category-no'));
                        });
                        selected.push(sub_selected.join());
                    });

                    var duplicates = false;
                    $.each(selected, function(i, v) {
                        if (v.indexOf(add.join()) > -1) {
                            alert('이미 추가된 카테고리입니다');
                            duplicates = true;
                        }
                        if (duplicates) return false;
                    });

                    if (duplicates) return false;

                    // 상위 카테고리 중복 제거
                    var depth_arr = []
                    $.each(add, function(i, v) {
                        depth_arr.push(v);
                        var remove_idx = selected.indexOf(depth_arr.join());
                        if (remove_idx > -1) {
                            var $remove_category = $('#lux-category-text ul').eq(remove_idx),
                                remove_deleted = [];
                            $.each($remove_category.find('li'), function(a, b) {
                                if (typeof $(this).attr('data-seq') != 'undefined' && $(this).attr('data-seq') != '')
                                    remove_deleted.push($(this).attr('data-seq'));
                            });
                            var d = $('#category-deleted').val(),
                                deleted = (d.length) ? (d || '').split(',') : [];

                            if (remove_deleted.length) {
                                deleted.push(...remove_deleted);
                                r = deleted.join();
                                $('#category-deleted').val(r);
                            }
                            $('#lux-category-text ul').eq(remove_idx).remove();
                            alert('기존에 선택한 상위 카테고리는 중복으로 제거 됩니다.');
                        }
                    });

                    if (typeof idx != 'undefined') {
                        $('#lux-category-text ul').eq(idx).remove();
                        idx = idx - 1;
                        if (idx > -1) {
                            $('#lux-category-text ul').eq(idx).after(s);
                        } else {
                            $('#lux-category-text').append(s);
                        }
                    } else {
                        $('#lux-category-text').append(s);
                    }

                    // 삭제된 카테고리 처리
                    var prev_category = $('#category-update-deleted').val();
                    if (prev_category.length) {
                        var prev_arr = prev_category.split(',');
                        if (updated.length) {
                            $.each(updated, function(i, v) {
                                if (v.length) prev_arr = arrayRemove(prev_arr, v);
                            });
                        }
                        $('#category-deleted').val(prev_arr.join());
                    }
                    modal.modal('hide');
                }, 'config.close', 'config.ok', 'cl-cmmodal cl-s-btn w700 cl-p70 cl-p0 noActive-domain-check h800', true, function() {
                    // close callback
                    $('#category-update-deleted').val('');
                });
            },
            error: function(xhr, status, error) {
                $.processOFF();
                alert("Error " + xhr.status + " : 관리자에게 문의");
            }
        });
    }

    $(document)
        .on('touchstart', '.carousel', function(e) {
            if(typeof PAGE_MODE != 'undefined' && PAGE_MODE == 'c') return false;

            const slideshow_xClick = e.originalEvent.touches[0].pageX;
            $(this).one('touchmove', function(event){
                const slideshow_xMove = event.originalEvent.touches[0].pageX;
                const slideshow_sensitivityInPx = 5;

                if( Math.floor(slideshow_xClick - slideshow_xMove) > slideshow_sensitivityInPx ){
                    $(this).carousel('next');
                }
                else if( Math.floor(slideshow_xClick - slideshow_xMove) < -slideshow_sensitivityInPx ){
                    $(this).carousel('prev');
                }
            });
            $(this).on('touchend', function(){
                $(this).off('touchmove');
            });
        });


    $(document)
        .off('click', '#lux-category-text ul')
        .on('click', '#lux-category-text ul', function(e) {
            var $selected = $(this),
                s = '',
                first = 0,
                l = [],
                i = $(this).index(),
                u = [],
                no = $(this).attr('data-no');
            if ($(this).attr('data-sid') == 'mlux') return;
            if ($selected.find('li').length) {
                $.each($selected.find('li'), function(i, v) {
                    if (i == 0) first = $(this).attr('data-category-no');
                    s += '<span class="selected" data-category="' + $(this).attr('data-category-no') + '" data-seq="' + $(this).attr('data-seq') + '">' + $(this).text() + ' <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path></svg></span>';
                    l.push($(this).attr('data-category-no'));
                    u.push($(this).attr('data-seq'));
                });
            }
            $('#category-update-deleted').val(u.join());
            getAllCategory(first, s, l, i, no);
        });

    $(document)
        .off('click', '.user-selected-category-delete')
        .on('click', '.user-selected-category-delete', function(e) {
            e.stopPropagation();
            if (confirm('카테고리를 삭제하시겠습니까?')) {
                var selected_category = $(this).parent().find('li'),
                    user_deleted = [];

                $.each(selected_category, function(i, v) {
                    if (typeof $(this).attr('data-seq') != 'undefined' && $(this).attr('data-seq') != '')
                        user_deleted.push($(this).attr('data-seq'));
                });

                var unique = [...new Set(user_deleted)],
                    d = $('#category-deleted').val(),
                    deleted = (d.length) ? (d || '').split(',') : [];
                $(this).parents('ul').remove();
                if (unique.length) {
                    deleted.push(...unique);
                    r = deleted.join();
                    $('#category-deleted').val(r);
                }
            }
        });

    $(document)
        .off('click', '.lux-category-add')
        .on('click', '.lux-category-add', function(e) {
            getAllCategory();
        });

    $(document)
        .off('click', '.choose-select-category.add li .lux-category-modify, .sub-category-item .lux-category-modify')
        .on('click', '.choose-select-category.add li .lux-category-modify, .sub-category-item .lux-category-modify', function(e) {
            e.stopPropagation();
            var category_name = $(this).parent().text().trim(),
                seq = $(this).parent().attr('data-category');

            $('li.orig').addClass('hide');
            $('.sub-category-item').addClass('hide');
            $('.input-user-category').addClass('active').css('display', 'block');
            $('.modal-footer .ok-button-dialog').addClass('disabled');
            $('#input-user-category').val(category_name).attr('data-modify', 'true').attr('data-category', seq);
        });

    $(document)
        .off('click', '.choose-select-category.add li .lux-category-delete, .sub-category-item .lux-category-delete')
        .on('click', '.choose-select-category.add li .lux-category-delete, .sub-category-item .lux-category-delete', function(e) {
            e.stopPropagation();
            var depth = $('.choose-select-category.add li.active .selected').length,
                category_no = $(this).parent().attr('data-category'),
                parent = $('.choose-select-category.add li.active .selected:nth-child(1)').attr('data-category'),
                sub = $('.choose-select-category.add li.active .selected:nth-child(2)').attr('data-category');
            var agree = (confirm('선택하신 카테고리를 삭제하시겠습니까?')) ? true : false;
            if ($('#lux-category-text').find('[data-category-no="' + category_no + '"]').length && agree == true) {
                alert('현재 상품에 적용된 카테고리입니다.');
                agree = false;
            }
            if (agree == false) return;
            $.processON();
            $.ajax({
                type: 'POST',
                url: '/template/lux_category_delete',
                data: { sid: SID, category_no: category_no, depth: depth },
                dataType: 'json',
                async: true,
                cache: false,
                success: function(r) {
                    $.processOFF();
                    if (typeof r.error != 'undefined' && r.error) {
                        alert(r.error);
                        return false;
                    }
                    lux_all_category = r.all_category;
                    if (depth == 0) {
                        $('.choose-select-category li[data-category="' + r.category_no + '"]').remove();
                    } else if (depth == 1) {
                        $('.sub-category-item div[data-category="' + r.category_no + '"]').remove();
                        displaySubCategoryList(lux_all_category[parent]['sub']);
                    } else {
                        $('.sub-category-item div[data-category="' + r.category_no + '"]').remove();
                        displaySubCategoryList(lux_all_category[parent]['sub'][sub]['sub'], true);
                    }
                },
                error: function(xhr, status, error) {
                    $.processOFF();
                    $('.input-user-category.active').removeClass('spinner');
                    alert("Error " + xhr.status + " : 관리자에게 문의");
                }
            });
        });

    $(document)
        .off('click', '.choose-select-category.add li')
        .on('click', '.choose-select-category.add li', function(e) {
            if ($(this).hasClass('click-off')) return;
            var id = $(this).attr('data-category'),
                selected = $(this).text();
            if ($(this).find('.selected').length) return false;
            $('.choose-select-category.add li.orig:not([data-category="' + id + '"]').fadeOut(0).addClass('disable');

            if (Number(id) > 1000000000) {
                if ($('.input-user-category').hasClass('active')) {
                    $('.input-user-category').removeClass('active').hide();
                    $('.modal-footer .ok-button-dialog').removeClass('disabled');
                }
                // addInputCategoryClose(0);
                enableCategoryButton();
            } else addInputCategoryClose(0);

            $('.sub-category-item').removeClass('active').remove();
            $('.choose-select-category.add li').removeClass('active');
            $(this).addClass('active').html('<span class="selected" data-category="' + id + '">' + selected + ' <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg></span>');

            displaySubCategoryList(lux_all_category[id]['sub']);
        })
        .off('hover', '.choose-select-category.add li')
        .on('hover', '.choose-select-category.add li', function(e) {
            var id = $(this).attr('data-category');
            if ($(this).find('.selected').length) return;
            if (Number(id) > 1000000000 && $(this).find('.lux-category-delete').length == 0) {
                $(this).append('<span class="lux-category-delete"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg></span>');
                $(this).append('<span class="lux-category-modify"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg></span>');
            }
        });

    $(document)
        .off('hover', '.sub-category-item > div')
        .on('hover', '.sub-category-item > div', function(e) {
            var id = $(this).attr('data-category');
            if ($(this).find('.selected').length) return;
            if (Number(id) > 1000000 && $(this).find('.lux-category-delete').length == 0) {
                $(this).append('<span class="lux-category-delete"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg></span>');
                $(this).append('<span class="lux-category-modify"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg></span>');
            }
        });

    $(document)
        .off('click', '.choose-select-category.add li.add-user-category')
        .on('click', '.choose-select-category.add li.add-user-category', function(e) {
            var depth = $('.choose-select-category.add .selected').length,
                root = '',
                parent = '';

            $('#input-user-category').attr('data-category', '').attr('data-modify', '');
            if (depth > 0) {
                root = $('.choose-select-category.add .selected').first().attr('data-category');
                parent = $('.choose-select-category.add .selected').last().attr('data-category');
            }
            depth++;

            $('#input-user-category').attr('data-depth', depth).attr('data-parent', parent).attr('data-root', root);
            $(this).fadeOut(0).addClass('disable');
            setTimeout(function() {
                $('.input-user-category').fadeIn(0).addClass('active');
                $('.modal-footer .ok-button-dialog').addClass('disabled');
                $('#input-user-category').focus();
                $('.sub-category-item').addClass('hide');
            }, 0);
        });

    $(document)
        .off('click', '.input-user-category-close svg')
        .on('click', '.input-user-category-close svg', function(e) {
            if ($(this).parent().prev().attr('data-modify') == 'true') {
                $('li.orig').removeClass('hide');
                addInputCategoryClose(0);
            } else {
                addInputCategoryClose(0);
            }
        });

    $(document)
        .off('keyup', '#input-user-category')
        .on('keyup', '#input-user-category', function(e) {
            var key = (e.which) ? e.which : e.keyCode,
                category_no = $(this).attr('data-category'),
                depth = $(this).attr('data-depth'),
                parent = $(this).attr('data-parent'),
                root = $(this).attr('data-root'),
                full_no = [],
                full_name = [],
                val = $(this).val().trim();

            $.each($('.choose-select-category.add .selected'), function(i, v) {
                full_no.push($(this).attr('data-category'));
                full_name.push($(this).text().trim());
            });

            if (key == 13 && val != '') {
                $('.input-user-category.active').addClass('spinner');
                $.ajax({
                    type: 'POST',
                    url: '/template/lux_category_add',
                    data: { val: val, depth: depth, parent_no: parent, root: root, sid: SID, full_no: full_no, full_name: full_name, category_no: category_no },
                    dataType: 'json',
                    async: true,
                    cache: false,
                    success: function(r) {
                        $('.input-user-category.active').removeClass('spinner');
                        if (typeof r.error != 'undefined' && r.error) {
                            alert(r.error);
                            return false;
                        }
                        lux_all_category = r.all_category.all;
                        $('.input-user-category > input').val('');
                        $('.input-user-category').fadeOut(200).removeClass('active');
                        $('.modal-footer .ok-button-dialog').removeClass('disabled');
                        $('.sub-category-item').removeClass('hide');
                        if (category_no.length) {
                            if (r.depth == 1) {
                                $('.choose-select-category li.orig[data-category="' + category_no + '"]').html('<span class="user-category-text">' + val + '</span> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path></svg>');
                            } else {
                                $('.sub-category-item div[data-category="' + category_no + '"]').html('<span class="user-category-text">' + val + '</span><span class="lux-category-delete"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path></svg></span><span class="lux-category-modify"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"></path></svg></span>');
                            }
                            $('li.orig').removeClass('hide');
                            $('.sub-category-item').removeClass('hide');
                        } else {
                            if (depth == 1) {
                                $('.add-user-category').before('<li class="orig" data-category="' + r.insert_no + '">' + val + '</li>');
                            } else if (depth == 2) {
                                $('.sub-category-item').removeClass('active').remove();
                                displaySubCategoryList(lux_all_category[parent]['sub']);
                            } else {
                                $('.sub-category-item').removeClass('active').remove();
                                displaySubCategoryList(lux_all_category[root]['sub'][parent]['sub'], true);
                            }
                            enableCategoryButton();
                        }

                    },
                    error: function(xhr, status, error) {
                        $('.input-user-category.active').removeClass('spinner');
                        alert("Error " + xhr.status + " : 관리자에게 문의");
                    }
                });
            }
        });

    $(document)
        .off('click', '.sub-category-item div')
        .on('click', '.sub-category-item div', function(e) {
            var id = $(this).attr('data-category'),
                sub = $(this).attr('data-sub'),
                selected = $(this).text();

            $('.choose-select-category.add li.active').append('<span class="selected" data-category="' + id + '">' + selected + ' <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg></span>');
            if ($(this).hasClass('last')) {
                $('.sub-category-item').removeClass('active').remove();
                if ($('.choose-select-category.add .selected').length == 3) $('.add-user-category').addClass('disable');
                return;
            } else $('.sub-category-item').removeClass('active').remove();

            displaySubCategoryList(lux_all_category[sub]['sub'][id]['sub'], true);
        });

    $(document)
        .off('click', '.choose-select-category.add li > .selected')
        .on('click', '.choose-select-category.add li > .selected', function(e) {
            e.stopPropagation();
            if ($('.input-user-category').hasClass('active')) {
                $('.input-user-category').removeClass('active').hide();
                $('.modal-footer .ok-button-dialog').removeClass('disabled');
            }
            $('.sub-category-item').removeClass('active').remove();
            var category_no = Number($(this).attr('data-category'));
            switch ($(this).index()) {
                case 0:
                    $(this).parent().removeClass('active');
                    $(this).parent().text($(this).text());
                    // $('.add-user-category').addClass('disable').fadeOut(200);
                    // setTimeout(function() {
                    $('.choose-select-category.add li.disable').fadeIn(200).removeClass('disable');
                    // },200);
                    break;
                case 1:
                    $(this).parent().html($('.choose-select-category.add li > .selected').first().outerHTML());
                    var id = $('.choose-select-category.add li > .selected').last().attr('data-category');
                    displaySubCategoryList(lux_all_category[id]['sub']);
                    if (category_no > 1000000000) setTimeout(function() { enableCategoryButton(); }, 500);
                    break;
                case 2:
                    $(this).remove();
                    var id = $('.choose-select-category.add li > .selected').last().attr('data-category'),
                        sub = $('.choose-select-category.add li > .selected').first().attr('data-category');
                    displaySubCategoryList(lux_all_category[sub]['sub'][id]['sub'], true);
                    if (category_no > 1000000000) setTimeout(function() { enableCategoryButton(); }, 500);
                    break;
            }
        });

    var addInputCategoryClose = function(out) {
        $('.sub-category-item').removeClass('hide');
        $('.input-user-category > input').val('');
        $('.input-user-category').removeClass('active').fadeOut(out, function() {
            if (out > 0) $('.choose-select-category.add li.add-user-category').removeClass('disable');
            $('.modal-footer .ok-button-dialog').removeClass('disabled');
        });
    }

    var enableCategoryButton = function() {
        $('.choose-select-category.add li.add-user-category').removeClass('disable').show();
    }

    var displaySubCategoryList = function(o, last, out) {
        $('.sub-category-item').remove();
        var s = '<div class="sub-category-item">';
        $.each(o, function(i, v) {
            s += '<div class="' + ((last) ? 'last' : '') + '" data-category="' + v.category_no + '" data-sub="' + v.parent_category_no + '"><span class="user-category-text">' + v.category_name + '</span></div>';
        });
        s += '</div>';
        $('.add-user-category').before(s);
        // setTimeout(function() {
        $('.sub-category-item').addClass('active');
        // },200);
        if (typeof out != 'undefined') return s;
    }

    var setSelectCategoryHTML = function(r, add) {
        var category_add = (typeof add != 'undefined' && add == true) ? ' add' : '',
            li = '',
            active = '',
            prev_str = '',
            used = [];

        $.each(r.use_category, function(i, v) {
            used.push(v);
        });

        $.each(r.root, function(i, v) {
            var disabled = (used.indexOf(Number(v.category_no)) > -1) ? ' disabled' : '';
            if (typeof r.use_category[Number(selectID)] != 'undifined' && r.use_category[Number(selectID)] == v.category_no) {
                disabled = '';
            }

            active = (v.category_no == r.category_no) ? 'active' : '';
            if (active == 'active') prev_str = v.category_no + ',' + v.category_name;
            if (v.count == -1) v.count = 0;
            li += '<li class="' + active + disabled + ' orig" data-category="' + v.category_no + '"><span class="user-category-text">' + v.category_name + ((add) ? '</span> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>' : '</span><span class="count">' + number_format(v.count) + '</span></li>');
        });

        var s = '<ul class="choose-select-category' + category_add + '" data-prev="' + prev_str + '">' + li;
        if (add == true) {
            s += '<li class="click-off add-user-category orig"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/></svg> 카테고리 추가</li>';
            s += '<li class="click-off input-user-category" data-depth="1"><input type="text" id="input-user-category" maxlength="20" placeholder="카테고리명을 입력하세요"><span class="input-user-category-close"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"></path></svg></span></li>';
            s += '';
        }
        s += '</ul>';
        return s;
    }

    var selectShoppingCategory = function(seq, mode, r, replace) {
        var modal = $(this).showModalFlat('상품 연결', setSelectCategoryHTML(r), true, true, function() {
            modal.modal('hide');

            var choose = $('.choose-select-category li.active').attr('data-category');
            if (typeof choose == 'undefined') {
                alert('선택된 카테고리가 없습니다');
                return false;
            }
            $.modalON();
            setTimeout(function() {
                $('.gallerytype-choose').modal('hide');
                if (replace == true) selectGalleryTypeNreloadList(seq, mode, choose);
                else selectGalleryElement(seq, mode, choose);
            }, 500);
        }, 'config.close', 'config.ok', 'cl-cmmodal cl-s-btn w700 cl-p70 cl-p0 noActive-domain-check,zindex', true, '', '', function() {
            $('.flat-modal.zindex').remove();
            $('.choose-gallery-type li[data-gallery-type]').attr('style', '');
        });
    }

    $(document).on({
        mouseenter: function(e) {
            $(this).parent().addClass('show-category');
        },
        mouseleave: function(e) {
            $(this).parent().removeClass('show-category');
        }
    }, ".cl-s-product-lux-info .lux-category-wrap");

    $(document).on('click', '.choose-select-category li:not(.click-off)', function(e) {
        if ($(this).hasClass('disabled')) return false;
        $('.choose-select-category li').removeClass('active');
        $(this).addClass('active');
    });

    $(document)
        .off('click', '.shop-filter-header .recommend-filter ~ .dropdown-menu li, .shop-filter-header .recommend-filter.brand')
        .on('click', '.shop-filter-header .recommend-filter ~ .dropdown-menu li, .shop-filter-header .recommend-filter.brand', function(e) {
            var key = $(this).attr('data-key'),
                val = $(this).attr('data-val'),
                selected_param = ($('.gallery-modal').length) ? localStorage.getItem(key) : getSearchURL(key);
            if ($(this).hasClass('disabled')) return;

            if ($(this).hasClass('active')) {
                val = ($('.gallery-modal').length) ? removeParameter(key, val, true) : removeParameter(key, val);
            } else {
                if (key == 'brand' || key == 'trend' || key == 'discount_rate') {
                    if ((selected_param || '').indexOf(val) < 0) {
                        val = (selected_param) ? selected_param + ',' + val : val;
                    } else {
                        val = ($('.gallery-modal').length) ? removeParameter(key, val, true) : removeParameter(key, val);
                    }
                }
            }

            if ($('.gallery-modal').length) {
                localStorage.setItem(key, val);
                $.gallery.show($.gallery.block_id, 1);
            } else {
                $.processON();
                location.href = setSearchURL(key, val);
            }
        });

    $(document)
/* head
        .off('click', '.shop-filter-header .checked-filters .item-filter .dropdown-menu li')
        .on('click', '.shop-filter-header .checked-filters .item-filter .dropdown-menu li', function(e) {
            var key = $(this).attr('data-key'),
                val = $(this).attr('data-val');

            if ($('.gallery-modal').length) {
                localStorage.setItem(key, val);
                $.gallery.show($.gallery.block_id, 1);
            } else {
                location.href = setSearchURL(key, val);
            }
        });

    $(document)
        .off('click', '.shop-filter-header .checked-filters li svg')
        .on('click', '.shop-filter-header .checked-filters li svg', function(e) {
            e.stopPropagation();
            var key = $(this).parent().attr('data-key'),
                val = $(this).parent().attr('data-val');

            val = ($('.gallery-modal').length) ? removeParameter(key, val, true) : removeParameter(key, val);
            if ($('.gallery-modal').length) {
                localStorage.setItem(key, val);
                $.gallery.show($.gallery.block_id, 1);
            } else {
                location.href = setSearchURL(key, val);
            }
        });
================================================================        
*/
    .off('click','.shop-filter-header .item-filter .dropdown-menu li')
    .on ('click','.shop-filter-header .item-filter .dropdown-menu li', function(e) {
        var key = $(this).attr('data-key'),
            val = $(this).attr('data-val');

        if($('.gallery-modal').length) { 
            localStorage.setItem(key,val);
            $.gallery.show($.gallery.block_id,1);
        } else {
            location.href = setSearchURL(key,val);
        }
    });

    $(document)
    .off('click','.shop-filter-header .checked-filters .user-checked svg')
    .on ('click','.shop-filter-header .checked-filters .user-checked svg', function(e) {
        e.stopPropagation();
        var key = $(this).parent().attr('data-key'),
            val = $(this).parent().attr('data-val');

        val = ($('.gallery-modal').length) ? removeParameter(key,val,true) : removeParameter(key,val);
        if($('.gallery-modal').length) { 
            localStorage.setItem(key,val);
            $.gallery.show($.gallery.block_id,1);
        } else {
            location.href = setSearchURL(key,val);
        }
    });
/* ============================================================ */

    $(document)
        .off('click', '.shop-filter-header .sub-category, .shop-filter-header .selected-category-item')
        .on('click', '.shop-filter-header .sub-category, .shop-filter-header .selected-category-item', function(e) {
            var key = $(this).attr('data-key'),
                val = $(this).attr('data-val');

            if ($('.gallery-modal').length) {
                localStorage.setItem(key, val);
                $.gallery.show($.gallery.block_id, 1);
            } else {
                location.href = setSearchURL(key, val);
            }
        });

    $(document)
        .off('keyup', '.product-name-input')
        .on('keyup', '.product-name-input', function(e) {
            var key = (e.which) ? e.which : e.keyCode,
                search_name = $(this).val().trim();
            if (key == 13) {
                if (search_name.indexOf(',') > -1 || search_name.indexOf('"') > -1 || search_name.indexOf('%') > -1) {
                    alert('\, \% \" 검색어에 포함될 수 없습니다');
                    return false;
                }
                
                searchProductName($(this));
            }
        });

    $(document)
        .off('click','.search-product-cancel')
        .on ('click','.search-product-cancel', function(e) {
            if($(this).prev().val().trim() == '') return;
            localStorage.removeItem('product_name');
            $('.product-name-input').val('');
            $.processON();
            ($('.gallery-modal').length) ? 
                $.gallery.show($.gallery.block_id,1) :
                location.href = setSearchURL('product_name','');
        });

    $(document)
        .off('click', '.search-product-remove')
        .on('click', '.search-product-remove', function(e) {
            if ($(this).prev().val().trim() == '') return;
            localStorage.removeItem('product_name');
            $('.product-name-input').val('');
            $.processON();
            ($('.gallery-modal').length) ?
                $.gallery.show($.gallery.block_id, 1):
                location.href = setSearchURL('product_name', '');
        });
    /*
        $(document)
        .off('keyup','.prod-search-brand .search-brand-input')
        .on ('keyup','.prod-search-brand .search-brand-input', function(e) {
            var key = (e.which) ? e.which : e.keyCode,
                search_brand = $(this).val().trim(),
                brand_code = '';
            if(key == 13) {
                $.each(product_brand_list, function(i,v) {
                    if(v.brand_name == search_brand) {
                        brand_code = v.brand_code;
                        return false;
                    }
                });
                if(brand_code) {
                    if($('.gallery-modal').length) {
                        localStorage.setItem('brand',brand_code);
                        $.gallery.show(selectID,1);
                    } else location.href = setSearchURL('brand',brand_code);
                }
            }
        });
    */
    function searchProductName($input) {
        var params = getProductParams(),
            stx = $input.val().trim();

        if (stx.length) {
            if ($('.gallery-modal').length) {
                localStorage.setItem('product_name', stx);
                $.gallery.show($.gallery.block_id, 1);
            } else {
                $.processON();
                location.href = setSearchURL('product_name', stx);
            }
        }
    }

    function removeElementByIndex(array, index) {
        if (index > -1) { // 제거할 인덱스가 배열 범위 내에 있는 경우
            array.splice(index, 1); // 해당 인덱스의 원소를 제거
        }
        return array;
    }

    function getAddSearches() {
        var searches = (localStorage.getItem('searches_' + $.lux.select_type) === null || localStorage.getItem('searches_' + $.lux.select_type) == '[null]') ? [] : JSON.parse(localStorage.getItem('searches_' + $.lux.select_type)),
            sort = $('.lux-product-search .sort-filter .type_filter').attr('data-val');
        sort = (sort) ? sort : 'new';
        $.each(searches, function(i,v) {
            if(v == null) return true;            
            searches[i]['sort'] = sort;
        });        
               
        return searches;
    }

    function resetAddSearches() {
      var s = getAddSearches();
      localStorage.removeItem('searches_' + $.lux.select_type);
    }

    function defaultProductParams() {
        return {
            'category_no': '',
            'brand': '',
            'trend': '',
            'discount_rate': '',
            'min_sale': '',
            'max_sale': '',
            'min_price': '',
            'max_price': '',
            'filter': '',
            'product_name': '',
            'sort': '',
            'prod_case': ''
        }
    }

    function getStorageItem(key) {
        if(typeof key == 'undefined' || key == '') return '';

        $default_val = '';
        switch(key) {
            case 'gallery-product-filter':  $default_val = 'all'; break;
            case 'gallery-product-view':    $default_val = 0; break;
            case 'gallery-product-page':    $default_val = 1; break;
            default:                        $default_val = ''; break;
        }

        return (localStorage.getItem(key) === null) ? $default_val : localStorage.getItem(key);
    }

    function getProductParams(key) {
        var r = {
            'category_no': (localStorage.getItem('category_no') === null) ? '' : localStorage.getItem('category_no'),
            'brand': (localStorage.getItem('brand') === null) ? '' : localStorage.getItem('brand'),
            'trend': (localStorage.getItem('trend') === null) ? '' : localStorage.getItem('trend'),
            'discount_rate': (localStorage.getItem('discount_rate') === null) ? '' : localStorage.getItem('discount_rate'),
            'min_sale': (localStorage.getItem('min_sale') === null) ? '' : localStorage.getItem('min_sale'),
            'max_sale': (localStorage.getItem('max_sale') === null) ? '' : localStorage.getItem('max_sale'),
            'min_price': (localStorage.getItem('min_price') === null) ? '' : localStorage.getItem('min_price'),
            'max_price': (localStorage.getItem('max_price') === null) ? '' : localStorage.getItem('max_price'),
            'filter': (localStorage.getItem('filter') === null) ? '' : localStorage.getItem('filter'),
            'product_name': (localStorage.getItem('product_name') === null) ? '' : localStorage.getItem('product_name'),
            'sort': (localStorage.getItem('sort') === null) ? '' : localStorage.getItem('sort'),
            'prod_case': (localStorage.getItem('prod_case') === null) ? '' : localStorage.getItem('prod_case'),
        }
        if (typeof key != 'undefined') return r[key];
        else {
            var isNull = true;
            $.each(r, function(i, v) {
                if (v.length) isNull = false;
            });
            if (isNull) return null;
            else return r;
        }
    }

    function setSearchesIndexValue(key, value) {
        var idx = $('.search-list .search-group.active').index(),
            searches = getAddSearches();

        if (idx < 0 || typeof key == 'undefined') return false;

        // var o = searches[idx][key];
        // if(o.length) {
        //     o+= ',' + value;
        // } else o = value;
        if (searches.length == 0 || searches === null || searches[0] == null) {
            searches = [];
            searches.push(defaultProductParams());
            searches[idx][key] = value;
        } else {
            searches[idx][key] = value;
        }

        // localStorage.setItem('searches', JSON.stringify(searches));
        localStorage.setItem('searches_' + $.lux.select_type, JSON.stringify(searches));        
        resetLocalStorageSearch();
        return true;
    }

    function setProductParams(params) {
        $.each(params, function(k, v) {
            if (v.length) {
                localStorage.setItem(k, v);
            }
        });
    }

    function resetProductParams() {
        localStorage.removeItem('category_no');
        localStorage.removeItem('brand');
        localStorage.removeItem('trend');
        localStorage.removeItem('discount_rate');
        localStorage.removeItem('min_sale');
        localStorage.removeItem('max_sale');
        localStorage.removeItem('min_price');
        localStorage.removeItem('max_price');
        localStorage.removeItem('filter');
        localStorage.removeItem('product_name');
        localStorage.removeItem('sort');
        localStorage.removeItem('prod_case');
        localStorage.removeItem('add_search');
        localStorage.removeItem('searches');
    }

    function resetLocalStorageSearch() {
        localStorage.removeItem('category_no');
        localStorage.removeItem('brand');
        localStorage.removeItem('trend');
        localStorage.removeItem('discount_rate');
        localStorage.removeItem('min_sale');
        localStorage.removeItem('max_sale');
        localStorage.removeItem('min_price');
        localStorage.removeItem('max_price');
        localStorage.removeItem('filter');
        localStorage.removeItem('product_name');
        localStorage.removeItem('sort');
        localStorage.removeItem('prod_case');
    }

    function resetSearches() {
        localStorage.removeItem('searches_lux');
        localStorage.removeItem('searches_shopping');
        localStorage.removeItem('searches_project');
        localStorage.removeItem('searches_gallery');
    }

    function removeParameter(key, remove, mode) {
        var param = (mode == true) ? localStorage.getItem(key) : getSearchURL(),
            s = (mode == true) ? param : param[key],
            val = (s || '').split(',');

        var r = arrayRemove(val, remove);
        return (r.length) ? r.join(',') : '';
    }

    function getSearchURL(key) {
        var location = window.location.href,
            url = new URL(location),
            param = url.searchParams;

        var r = {};
        if(typeof key != 'undefined' && key) {
            r[key] = (param.get(key) == null) ? '' : param.get(key);
        } else {
            r = {
                'category_no' : (param.get('category_no') == null) ? '' : param.get('category_no'),
                'brand' : (param.get('brand') == null) ? '' : param.get('brand'),
                'trend' : (param.get('trend') == null) ? '' : param.get('trend'),
                'discount_rate' : (param.get('discount_rate') == null) ? '' : param.get('discount_rate'),
                'min_sale' : (param.get('min_sale') == null) ? '' : param.get('min_sale'),
                'max_sale' : (param.get('max_sale') == null) ? '' : param.get('max_sale'),
                'min_price' : (param.get('min_price') == null) ? '' : param.get('min_price'),
                'max_price' : (param.get('max_price') == null) ? '' : param.get('max_price'),
                'filter' : (param.get('filter') == null) ? '' : param.get('filter'),
                'product_name' : (param.get('product_name') == null) ? '' : param.get('product_name'),
                'sort' : (param.get('sort') == null) ? '' : param.get('sort'),
            }
        }

        $.each(r, function(r_k, r_v) {
            switch(r_k) {
                case 'trend':
                    var trend = (r_v) ? r_v.split(',') : [];
                    $(trend).each(function(k, v) {
                        $('.recommend-filter.list-filter + .dropdown-menu [data-key="trend"][data-val="' + v + '"]').addClass('active');
                    });
                    break;
                case 'min_sale':
                case 'max_sale':
                    break;
                case 'discount_rate':
                    var discount_rate = (r_v) ? r_v.split(',') : [];
                    $(discount_rate).each(function(k, v) {
                        $('.recommend-filter.list-filter + .dropdown-menu [data-key="discount_rate"][data-val="' + v + '"]').addClass('active');
                    });
                    break;

                case 'product_name':
                    $('.search-product input.product-name-input').val(r_v);
                    break;

                case 'sort':
                    if(r_v == '') r_v = 'new'; 
                    $('.checked-filters li[data-key="sort"][data-val="' + r_v + '"]').addClass('active');
                    var sort_active_str = $('.checked-filters li[data-key="sort"].active').eq(0).text();
                    $('.checked-filters .type_filter').text(sort_active_str);
                    break;

                default:
                    if($.inArray(r_k, ['min_price', 'max_price']) > -1 && r_v) {
                        $('.recommend-filter.list-filter + .dropdown-menu [data-key="' + r_k + '"][data-val="' + r_v + '"]').addClass('active');
                    }
                    break;
            }
        });

        return (typeof key != 'undefined') ? r[key] : r;
    }

    function setSearchURL(k, v) {
        var param = getSearchURL();
        // 초기 category_no
        if (param.category_no == '') {
            var searches = getAddSearches();
            param.category_no = searches[0].category_no;
        }
        param[k] = v;
        setProductParams(param);
        var page = (typeof PAGE == 'undefined') ? property.PAGE : PAGE;
        if (typeof MODE == 'undefined') { // render
            var url = (property.LOAD == 'RENDER') ? '/render/' : '/';
            return url + page + 
              '?category_no=' + param.category_no + 
              '&brand=' + param.brand + 
              '&trend=' + param.trend + 
              '&discount_rate=' + param.discount_rate + 
              '&min_sale=' + param.min_sale + 
              '&max_sale=' + param.max_sale + 
              '&min_price=' + param.min_price + 
              '&max_price=' + param.max_price + 
              '&filter=' + param.filter + 
              '&product_name=' + param.product_name + 
              '&sort=' + param.sort;
        } else { // config
            return '/config/page/' + page + 
              '?category_no=' + param.category_no + 
              '&brand=' + param.brand + 
              '&trend=' + param.trend + 
              '&discount_rate=' + param.discount_rate + 
              '&min_sale=' + param.min_sale + 
              '&max_sale=' + param.max_sale + 
              '&min_price=' + param.min_price + 
              '&max_price=' + param.max_price + 
              '&filter=' + param.filter + 
              '&product_name=' + param.product_name + 
              '&sort=' + param.sort;
        }
    }

    var shopHeaderDisplaySkin = function($tag,data) {
        if(typeof data.mode == 'undefined' || data.mode != 'shopping') return;
        var checkDefaultCall = false;

        var shd_skin = $tag.attr('data-skin'),
            shd_row_class = 'goption-row',
            shd_r = data.category_info;

        var $cate_selected_ul = $('<ul class="selected-category-list"></ul>'),
            cate_full = (typeof shd_r.selected != 'undefined' && shd_r.selected.full_category_no != null) ? shd_r.selected.full_category_no : [],
            cate_last_name = '',
            cate_last_val = '';
        if(typeof shd_r != 'undefined' && typeof shd_r.selected != 'undefined' && typeof shd_r.selected.full_category_name != 'undefined' && shd_r.selected.full_category_name != null) {
            $.each(shd_r.selected.full_category_name, function(i,v) {
                if(v != null && i < 3) {
                    cate_last_name = v;
                    cate_last_val = cate_full[i];
                    $cate_selected_ul.append('<li class="selected-category-item hand" data-key="category_no" data-val="' + cate_last_val + '">' + cate_last_name + '</li>');
                }
            });
        }
        $cate_selected_ul.find('li:last').addClass('active');

        var $cate_h1 = $('<h1 class="selected-category-h1">' + cate_last_name + '</h1>');

        var $cate_sub_ul = $('<ul class="sub-category-list"></ul>'),
            checkCateSub = false;
        $.each(shd_r.sub, function(i,o) {
            var cate_sub_active = (shd_r.selected.category_no == o.category_no) ? 'active' : '';
            if(cate_sub_active != '') checkCateSub = true;

            var cate_sub_name = o.category_name;
            if($.inArray(shd_skin, ['000']) > -1) cate_sub_name += '<span class="count">' + number_format(s.count) + '</span>';
            if($.inArray(shd_skin, ['001','002','003']) > -1) cate_sub_name = '<span class="sub-category-name">' + cate_sub_name + '</span>';

            $cate_sub_ul.append('<li class="sub-category ' + cate_sub_active + '" data-key="category_no" data-val="' + o.category_no + '">' + cate_sub_name + ' </li>');
        });
        if(typeof shd_r.selected != 'undefined' && typeof shd_r.selected.category_no != 'undefined') {
            var all_cate_sub_name = ($.inArray(shd_skin, ['001','002','003']) > -1) ? '<span class="sub-category-name">전체</span>' : '전체';
            $cate_sub_ul.prepend('<li class="sub-category all-sub-category ' + ((checkCateSub) ? '' : 'active') + '" data-key="category_no" data-val="' + cate_last_val + '">' + all_cate_sub_name + '</li>');
        }

        var $search_product = $('<div class="search-product"></div>'),
            $search_product_input = $('<input type="text" class="product-name-input form-control" placeholder="상품명 검색" enterkeyhint="search" value="">'),
            $search_product_cancel = $('<span class="search-product-cancel">' + clSVG('close_m','16','16',false,'') + '</span>'),
            $search_product_search = $('<span class="search-product-btn">' + clSVG('search','16','16',false,'') + '</span>');


        var checkBrand = (  typeof data.category_info.uri != 'undefined' && 
                            typeof data.category_info.uri.brand != 'undefined' && (data.category_info.uri.brand).length
                        ) ? false : (($.inArray(shd_skin, ['001','002','003']) > -1) ? false : true),
            $search_filter = $('<div class="filter-wrap">' + ChooseFilters(checkBrand) + '</div>');

        var sort_filter_ul = ($.inArray(shd_skin, ['001','002','003']) > -1) ? 'div' : 'ul',
            sort_filter_li = ($.inArray(sort_filter_ul, ['div']) > -1) ? sort_filter_ul : 'li',
            $sort_filter = $('\
                <'+ sort_filter_ul + '>\
                    <' + sort_filter_li + ' class="btn-group">\
                        <button type="button" class="dropdown-toggle recommend-filter list-filter dropdown-button item-filter" data-toggle="dropdown">\
                            <span class="type_filter">신상품</span>\
                            <svg width="12" height="12" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"></path></svg>\
                        </button>\
                        <ul class="dropdown-menu">\
                            <li data-key="sort" data-val="new">신상품</li>\
                            <li data-key="sort" data-val="name">상품명</li>\
                            <li data-key="sort" data-val="low">낮은가격</li>\
                            <li data-key="sort" data-val="high">높은가격</li>\
                        </ul>\
                    </' + sort_filter_li + '>\
                </'+ sort_filter_ul + '>\
            ');


        var checked_filter_ul = ($.inArray(shd_skin, ['001']) > -1) ? 'div' : 'ul',
            checked_filter_li = ($.inArray(checked_filter_ul, ['div']) > -1) ? checked_filter_ul : 'li',
            $checked_filter_item = $('<' + checked_filter_li + ' class="user-checked"><span></span> ' + clSVG('close_m_thin',16,16,false) + '</' + checked_filter_li + '>'),
            $checked_filter = $('<' + checked_filter_ul + ' class="checked-filters"></' + checked_filter_ul + '>');
        if(typeof shd_r.checked != 'undefined' && shd_r.checked) {
            $.each(shd_r.checked, function(i,o) {
                var $tmp_cf = $checked_filter_item.clone();
                $tmp_cf.attr({'data-key': o.key, 'data-val': o.val});
                $tmp_cf.find(' > span').text(o.str);
                $checked_filter.append($tmp_cf);
            });
        }

        var result_total = (typeof data.total != 'undefined' && typeof data.total.list_total != 'undefined' && data.total.list_total) ? data.total.list_total : 0,
            result_title = ($.inArray(shd_skin, ['001','002','003']) > -1) ? '<h1>검색결과</h1>' : '',
            $result_summary = $('<div class="result-summary">' + result_title + ' <span class="total">' + addCommas(result_total) + '</span><span class="unit">개</span></div>');

        switch(shd_skin) {
            case '001':
                $tag.append($search_product.addClass('clearfix').append($search_product_input.attr('placeholder', '상품 검색')).append($search_product_search))
                    .append($cate_selected_ul)
                    .append($cate_sub_ul)
                    .append('<div class="line-wrap"><hr class="line"/></div>')
                    .append($search_filter.addClass('clearfix'))
                    .append($checked_filter);
                
                $sort_filter.find('.type_filter + svg').replaceWith(clSVG('caret',8,4,false));
                $sort_filter.find('.btn-group').addClass('pull-right');
                $tag.append($sort_filter.addClass('last clearfix').prepend($result_summary));
                break;

            case '002':
                $tag.append($cate_selected_ul.addClass('clearfix'))
                    .append($search_product.addClass('clearfix').append($search_product_input.attr('placeholder', '상품 검색')).append($search_product_search))
                    .append('<div class="clearfix"></div>')
                    .append($cate_h1.addClass('clearfix'))
                    .append($cate_sub_ul)
                    .append('<div class="line-wrap"><hr class="line"/></div>')
                    .append($search_filter.addClass('clearfix'))
                    .append($checked_filter);

                $sort_filter.find('.type_filter + svg').replaceWith(clSVG('caret',8,4,false));
                $sort_filter.find('.btn-group').addClass('pull-right');
                $tag.append($sort_filter.addClass('last clearfix').append($result_summary));

                if($tag.find('.checked-filters').is(':empty')) $tag.find('.last.clearfix > div').css('margin-right', '8px');
                break;

            case '003':
                $tag.append($cate_selected_ul.addClass('clearfix'))
                    .append('<div class="clearfix"></div>')
                    .append($cate_h1.addClass('clearfix'))
                    .append($cate_sub_ul)
                    .append('<div class="line-wrap"><hr class="line"/></div>')
                    .append($search_filter.addClass('clearfix'))
                    .append($checked_filter);

                $sort_filter.find('.type_filter + svg').replaceWith(clSVG('caret',8,4,false));
                $sort_filter.find('.btn-group').addClass('pull-right');
                $tag.append($sort_filter.addClass('last clearfix').append($result_summary));
                $tag.find('h1.selected-category-h1').append('<div class="result-summary"><span class="total">' + addCommas(result_total) + '</span><span class="unit">개 상품</span></div>').wrap('<div></div>');
                $tag.find('h1.selected-category-h1').before($search_product.addClass('clearfix').append($search_product_input.attr('placeholder', '상품 검색')).append($search_product_search));

                if($tag.find('.checked-filters').is(':empty')) $tag.find('.last.clearfix > div').css('margin-right', '8px');
                break;

            default:
                checkDefaultCall = true;
                break;
        }

        if(checkDefaultCall) {
            $tag.removeAttr('data-skin');
            shopHeaderDisplay($tag,data);
            return;
        } else {
            getSearchURL();

            if($tag.closest('[class*="el_"]').length > 0 && $tag.closest('[class*="el_"]').find('.full-width').length > 0) $tag.addClass('full-width');
            else $tag.removeClass('full-width');

            $tag.children().addClass('goption-row');
        }

        var brand_search = (typeof data.brand_search != 'undefined' && typeof data.brand_search.tag != 'undefined' && data.brand_search.tag) ? data.brand_search.tag : '';
        shopBrandInputAutocomplete(data.brand_list, brand_search);

    }

    var shopHeaderDisplay = function($tag,data) {
        var checkLUX = typeof LUX != 'undefined' ? LUX : property.LUX;
        if(checkLUX && $tag.closest('.element').is('[data-type="gallery"][data-mode="shopping"]')) $tag.closest('.element').addClass('cl-lux-gallery');

        var check_only_cate = (typeof data.only_category != 'undefined' && data.only_category === true) ? true : false;
        if(!check_only_cate) return;
        if(typeof $tag.attr('data-skin') != 'undefined' && $tag.attr('data-skin')) {
            shopHeaderDisplaySkin($tag,data);
            return;
        }
        var brandChecked = (typeof data.category_info.uri != 'undefined' && 
                            typeof data.category_info.uri.brand != 'undefined' && (data.category_info.uri.brand).length
                          ) ? false : true;
        $tag.prepend('<ul class="goption-row checked-filters"></ul>');
        $tag.prepend('<div class="goption-row filter-wrap">' + ChooseFilters(brandChecked) + '</div>');
        $tag.prepend('<ul class="goption-row sub-category-list"></ul>');
        $tag.prepend('<ul class="goption-row selected-category-list"></ul>');
        selected_category = data.category_info;

        // lux shopping selected category
        if (typeof selected_category == 'object' && data.mode == 'shopping') {
            var $category_nav = $tag.find('.selected-category-list'),
                full_category_no = selected_category.selected.full_category_no;
            last_category_no = '';
            if (selected_category.selected.full_category_name !== null) {
                $.each(selected_category.selected.full_category_name, function(c, s) {
                    if (s != null && c < 3) {
                        $category_nav.append('<li class="selected-category-item hand" data-key="category_no" data-val="' + full_category_no[c] + '">' + s + '</li>');
                        last_category_no = full_category_no[c];
                    }
                });
            }
            // search 
            var product_name_input = ($('.gallery-modal').length) ? getProductParams('product_name') : getSearchURL('product_name');
            $category_nav.append('<li class="search-product"><input type="text" class="form-control product-name-input" placeholder="상품명 검색" enterkeyhint="search" value="' + product_name_input + '"><span class="search-product-cancel"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/></svg></span></li>');

            var $sub_category = $tag.find('.sub-category-list'),
                sub_category_selected = false;
            $.each(selected_category.sub, function(c, s) {
                var active = (selected_category.selected.category_no == s.category_no) ? 'active' : '';
                if (active.length) sub_category_selected = true;

                $sub_category.append('<li class="sub-category ' + active + '" data-key="category_no" data-val="' + s.category_no + '">' + s.category_name + ' <span class="count">' + number_format(s.count) + '</span></li>');
            });

            if (typeof selected_category.selected != 'undefined' && typeof selected_category.selected.category_no != 'undefined') {
                $sub_category.prepend('<li class="sub-category all-sub-category ' + ((sub_category_selected) ? '' : 'active') + '" data-key="category_no" data-val="' + last_category_no + '">전체</li>');
            }

            $.each(selected_category.checked, function(s,l) {
                $tag.find('.checked-filters').append('<li class="user-checked" data-key="' + l.key + '" data-val="' + l.val + '">' + l.str + ' ' + clSVG('close_m_thin',16,16,false) + '</li>');
            });

            if ($tag.find('.checked-filters .list-filter').length == 0) {
                var selected = ($('.gallery-modal').length) ? getProductParams('sort') : getSearchURL('sort'),
                    filters = {
                        'new': '신상품',
                        'name': '상품명',
                        'low': '낮은가격',
                        'high': '높은가격'
                    };
                if (selected == '') selected = 'new';
                var s = '\
                <div class="btn-group list-filter">\
                    <button type="button" class="dropdown-toggle recommend-filter dropdown-button item-filter" data-toggle="dropdown">\
                        <span class="type_filter">' + filters[selected] + '</span>\
                        <svg width="12" height="12" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">\
                            <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"></path>\
                        </svg>\
                    </button>\
                    <ul class="dropdown-menu">\
                        <li data-key="sort" data-val="new">신상품</li>\
                        <li data-key="sort" data-val="name">상품명</li>\
                        <li data-key="sort" data-val="low">낮은가격</li>\
                        <li data-key="sort" data-val="high">높은가격</li>\
                    </ul>\
                </div>\
                ';
                /*
                <li data-key="filter" data-val="hot">인기상품</li>\
                <li data-key="filter" data-val="review">사용후기</li>\
                */

                var prod_cases = { 'A': '전체', 'M': '수정상품', 'O': '사입상품', 'H': '숨김상품', 'S': '품절상품' };
                var prod_case_value = getProductParams('prod_case');
                if (!prod_case_value) prod_case_value = 'A'; 
                if ($('.gallery-modal').length) { // 상품관리 모달 열린상태
                    s += '<div class="btn-group list-filter">\
                            <button type="button" class="dropdown-toggle recommend-filter list-filter dropdown-button" data-toggle="dropdown">\
                                <span class="type_prod_case">' + prod_cases[prod_case_value] + '</span>\
                                <svg width="12" height="12" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">\
                                    <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"></path>\
                                </svg>\
                            </button>\
                            <ul class="dropdown-menu">\
                    ';
                    $.each(prod_cases, function(k, v) {
                        s += '<li class="" data-key="prod_case" data-val="' + k + '">' + v + '</li>';
                    });

                    s += '\
                            </ul>\
                        </div>';
                }

                $tag.find('.checked-filters').append(s);
            }
        }

        // lux shopping filter active
        if(data.mode == 'shopping') {
            if($('.gallery-modal').length == 0) var tmp_filter = getSearchURL();
            var trend = localStorage.getItem('trend'),
                discount_rate = localStorage.getItem('discount_rate'),
                min_sale = localStorage.getItem('min_sale'),
                max_sale = localStorage.getItem('max_sale'),
                min_price = localStorage.getItem('min_price'),
                max_price = localStorage.getItem('max_price'),
                filter = localStorage.getItem('filter');

            $.each((trend || '').split(','), function(s, l) {
                $tag.find('.filter-wrap li[data-key="trend"][data-val="' + l + '"]').addClass('active');
            });
            $.each((discount_rate || '').split(','), function(s, l) {
                $tag.find('.filter-wrap li[data-key="discount_rate"][data-val="' + l + '"]').addClass('active');
            });
            $tag.find('.filter-wrap li[data-key="min_price"][data-val="' + min_price + '"]').addClass('active');
            $tag.find('.filter-wrap li[data-key="max_price"][data-val="' + max_price + '"]').addClass('active');
            $tag.find('.filter-wrap li[data-key="filter"][data-val="' + filter + '"]').addClass('active');
        }
        // lux brand
        // var tags = [];
        // $.each(data.brand_list, function(i,v) {
        //     tags.push(v.brand_name);
        // });
        
        var brand_search = (typeof data.brand_search != 'undefined' && typeof data.brand_search.tag != 'undefined' && data.brand_search.tag) ? data.brand_search.tag : '';
        shopBrandInputAutocomplete(data.brand_list, brand_search);
    }

    var shopBrandInputAutocomplete = function(list, search) {
        if(typeof search == 'undefined') search = '';

        $('.search-brand-input').autocomplete({
            source: search,
            appendTo: '.prod-search-brand',
            focus: function(event, ui) {
                $('.ui-autocomplete li').removeClass('active');
                if (ui.item.value == '') return false;
                $('.ui-autocomplete li a:contains("' + ui.item.value + '")').parent().addClass('active');
                return false;
            },
            select: function(event, ui) {
                if (ui.item.value == '') {
                    event.preventDefault();
                    return false;
                }
                var selected = ui.item.value,
                    val = selected.split(" ["),
                    search_brand = '',
                    brand_code = '';
                ui.item.value = val[0];

                search_brand = val[0];
                $.each(list, function(i,v) {
                    if(v.brand_name == search_brand) {
                        brand_code = v.brand_code;
                        return false;
                    }
                });
                if (brand_code) {
                    if ($('.gallery-modal').length) {
                        localStorage.setItem('brand', brand_code);
                        $.gallery.show($.gallery.block_id, 1);
                    } else {
                        $.processON();
                        location.href = setSearchURL('brand', brand_code);
                    }
                }
            },
            response: function(event, ui) {
                if (ui.content.length == 0) {
                    ui.content.push({ value: '', label: '검색되는 브랜드가 없습니다.' });
                }
            }
        });
    }
    var getRecordHtml = function(service) {
        var str = '';
        switch (service) {
            case 'go':
                str += '\
                <div class="table-wrap">\
                    <table>\
                        <colgroup>\
                            <col width="120px"></col>\
                            <col width="75px"></col>\
                            <col width="85px"></col>\
                            <col width="60px"></col>\
                            <col width="*"></col>\
                        </colgroup>\
                        <thead>\
                            <tr><td>' + $.lang[LANG]['domain.connect.record.title.name'] + '</td><td>' + $.lang[LANG]['domain.connect.record.title.ttl'] + '</td><td>' + $.lang[LANG]['domain.connect.record.title.type'] + '</td><td>' + $.lang[LANG]['domain.connect.record.title.priority'] + '</td><td>' + $.lang[LANG]['domain.connect.record.title.val'] + '</td></tr>\
                        </thead>\
                        <tbody>\
                            <tr><td>' + $.lang[LANG]['domain.connect.record.content.blank.1'] + '</td><td>3600</td><td>MX</td><td>1</td><td>ASPMX.L.GOOGLE.COM</td></tr>\
                            <tr><td>' + $.lang[LANG]['domain.connect.record.content.blank.1'] + '</td><td>3600</td><td>MX</td><td>5</td><td>ALT1.ASPMX.L.GOOGLE.COM</td></tr>\
                            <tr><td>' + $.lang[LANG]['domain.connect.record.content.blank.1'] + '</td><td>3600</td><td>MX</td><td>5</td><td>ALT2.ASPMX.L.GOOGLE.COM</td></tr>\
                            <tr><td>' + $.lang[LANG]['domain.connect.record.content.blank.1'] + '</td><td>3600</td><td>MX</td><td>10</td><td>ALT3.ASPMX.L.GOOGLE.COM</td></tr>\
                            <tr><td>' + $.lang[LANG]['domain.connect.record.content.blank.1'] + '</td><td>3600</td><td>MX</td><td>10</td><td>ALT4.ASPMX.L.GOOGLE.COM</td></tr>\
                        </tbody>\
                    </table>\
                </div>\
                </div>';
                break;

            case 'nv':
                str += '\
                <div class="table-wrap">\
                    <table>\
                        <colgroup>\
                            <col width="180px"></col>\
                            <col width="60px"></col>\
                            <col width="*"></col>\
                        </colgroup>\
                        <thead>\
                            <tr><td>' + $.lang[LANG]['domain.connect.record.title.name'] + '</td><td>' + $.lang[LANG]['domain.connect.record.title.priority'] + '</td><td>' + $.lang[LANG]['domain.connect.record.title.record'] + '</td></tr>\
                        </thead>\
                        <tbody>\
                            <tr><td>' + $.lang[LANG]['domain.connect.record.content.blank.2'] + '</td><td>10</td><td>kr1-aspmx1.worksmobile.com.</td></tr>\
                            <tr><td>' + $.lang[LANG]['domain.connect.record.content.blank.2'] + '</td><td>20</td><td>kr1-aspmx2.worksmobile.com.</td></tr>\
                        </tbody>\
                    </table>\
                </div>\
                </div>';
                break;

            case 'dm':
                str += '\
                <div class="table-wrap">\
                    <table>\
                        <colgroup>\
                            <col width="160px"></col>\
                            <col width="60px"></col>\
                            <col width="*"></col>\
                        </colgroup>\
                        <thead>\
                            <tr><td>' + $.lang[LANG]['domain.connect.record.title.name'] + '</td><td>' + $.lang[LANG]['domain.connect.record.title.priority'] + '</td><td>' + $.lang[LANG]['domain.connect.record.title.record'] + '</td></tr>\
                        </thead>\
                        <tbody>\
                            <tr><td>' + $.lang[LANG]['domain.connect.record.content.blank.2'] + '</td><td>10</td><td>ASPMX.daum.net.</td></tr>\
                            <tr><td>' + $.lang[LANG]['domain.connect.record.content.blank.2'] + '</td><td>20</td><td>ALT.ASPMX.daum.net.</td></tr>\
                        </tbody>\
                    </table>\
                </div>\
                </div>';
                break;

            case 'hi':
                str += '\
                <div class="table-wrap">\
                    <table>\
                        <colgroup>\
                            <col width="130px"></col>\
                            <col width="85px"></col>\
                            <col width="60px"></col>\
                            <col width="*"></col>\
                        </colgroup>\
                        <thead>\
                            <tr><td>' + $.lang[LANG]['domain.connect.record.title.name'] + '</td><td>' + $.lang[LANG]['domain.connect.record.title.type'] + '</td><td>' + $.lang[LANG]['domain.connect.record.title.priority'] + '</td><td>' + $.lang[LANG]['domain.connect.record.title.val'] + '</td></tr>\
                        </thead>\
                        <tbody>\
                            <tr><td>@</td><td>MX</td><td>1</td><td>mailapp.hiworks.co.kr.</td></tr>\
                            <tr><td>hiworks</td><td>CNAME</td><td>5</td><td>hiworksapp.hiworks.co.kr.</td></tr>\
                            <tr><td>webmail</td><td>CNAME</td><td>5</td><td>hiworksapp.hiworks.co.kr.</td></tr>\
                            <tr><td>mail</td><td>CNAME</td><td>10</td><td>mailapp.hiworks.co.kr</td></tr>\
                            <tr><td>pop3</td><td>CNAME</td><td>10</td><td>mailapp.hiworks.co.kr.</td></tr>\
                            <tr><td>@</td><td>TXT(SPF)</td><td>10</td><td>v=spf1 include:_spf.hiworks.co.kr ~all</td></tr>\
                        </tbody>\
                    </table>\
                </div>\
                </div>';
                break;

            case 'mp':
                str += '\
                <div class="table-wrap">\
                    <table>\
                        <colgroup>\
                            <col width="130px"></col>\
                            <col width="85px"></col>\
                            <col width="60px"></col>\
                            <col width="*"></col>\
                        </colgroup>\
                        <thead>\
                            <tr><td>' + $.lang[LANG]['domain.connect.record.title.name'] + '</td><td>' + $.lang[LANG]['domain.connect.record.title.type'] + '</td><td>' + $.lang[LANG]['domain.connect.record.title.priority'] + '</td><td>' + $.lang[LANG]['domain.connect.record.title.val'] + '</td></tr>\
                        </thead>\
                        <tbody>\
                            <tr><td>' + $.lang[LANG]['domain.connect.record.content.blank.2'] + '</td><td>MX</td><td>10</td><td>mx01.mailplug.com.</td></tr>\
                            <tr><td>' + $.lang[LANG]['domain.connect.record.content.blank.2'] + '</td><td>MX</td><td>20</td><td>mx02.mailplug.com.</td></tr>\
                            <tr><td>mail</td><td>CNAME</td><td></td><td>m79.mailplug.com</td></tr>\
                            <tr><td>' + $.lang[LANG]['domain.connect.record.content.blank.2'] + '</td><td>TXT(SPF)</td><td></td><td>v=spf1 mx include:mailplug.com ~all</td></tr>\
                        </tbody>\
                    </table>\
                </div>\
                </div>';
                break;

            case 'etc':
                var suadmin = '<?=SU_EADMIN?>',
                    url = (suadmin) ? "https://creatorlink.net/help" : "";

                str += '\
                <div class="etc-info">\
                    <p>' + $.lang[LANG]['domain.connect.mx.info.text.1'] + '<a href="' + url + '" target="_blank">' + $.lang[LANG]['domain.connect.mx.info.text.2'] + '</a>' + $.lang[LANG]['domain.connect.mx.info.text.3'] + '</p>\
                    <div class="info-text">\
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 13" width="13" height="13"><path d="M6.5 0a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zm0 12C3.47 12 1 9.53 1 6.5S3.47 1 6.5 1 12 3.47 12 6.5 9.53 12 6.5 12z"/><path d="M6 3h1v5H6zM6 9h1v1H6z"/></svg>' + $.lang[LANG]['domain.connect.mx.info.text.4'] + '\
                    </div>\
                </div>';
                break;
        }

        return str;
    }

    var setFixedMenuCss = function(checkEllist) {      
        // console.log('setFixedMenuCss :: 로고 / 확장기능 버튼 height,line-height 추가');
        var fh_selector = (checkEllist) ? '.elviewhtml header.navbar[data-fixtype]' : 'header.navbar[data-fixtype]',
            $fh = $(fh_selector);

        if($fh.length == 0) return false;
        var fh_type = $fh.attr('data-fh-type'),
            fixtypeNum = $fh.attr('data-fixtype').replace(/(top|sidebar)\_/gi, ''),
            fixtypeArr = ['01', '02', '03', '08'];
        if($fh.find('#fixed-menu').find('.cl-visible').length == 0 && fh_type=='top') {
          if(PAGE_MODE == 'c') {
            $fh.find('.fh-container').addClass('hide');
          } else {
            $fh.find('.fh-container').remove();
          }
        }

        var check_color_panel = ($('.elmenu-content').length > 0) ? 60 : 49,
            fixed_mn_width = $fh.find('.cl-fixed-menu').width() + check_color_panel,
            fixed_mn_height = $fh.find('#tpl-menu li').height(),
            navbarHeader_width = $fh.find('.navbar-header').width(),
            check_fixed_mn = ($fh.find('.cl-fixed-menu').length>0) ? true : false;

        logo_mn_height = ($fh.find('.navbar-brand img').height() > $fh.find('#tpl-menu').height()) ? '' : fixed_mn_height;

        if($fh.find('.cl-menu-option').length > 0) {
            if($fh.find('.cl-menu-option').is('[data-mwidth="all"]') && $fh.is('[data-fh-type="right"]')) {
                var fixed_m_w = $fh.find('.cl-fixed-menu').outerWidth(),
                    moption_row_padding = {};

                if($fh.find('.cl-menu-option').is('.nfullDrop')) moption_row_padding = {};
                else if($fh.is('[data-fixtextalign="center"]')) moption_row_padding = {'padding-left':fixed_m_w+'px','padding-right':fixed_m_w+'px'};
                else if($fh.is('[data-fixtextalign="right"]')) moption_row_padding = {'padding-right':fixed_m_w+'px'};

                if($.isEmptyObject(moption_row_padding)) {
                    document.querySelector(fh_selector+' .moption-row').style.removeProperty('padding-left');
                    document.querySelector(fh_selector+' .moption-row').style.removeProperty('padding-right');
                } else {
                    if($fh.is('[data-fixtextalign="center"]')) $fh.find('#tpl-menu').css('padding-left',fixed_m_w + 'px');
                    else document.querySelector(fh_selector+' #tpl-menu').style.removeProperty('padding-left');
                    $fh.find('.moption-row').css(moption_row_padding);
                }
            }
        } else {
            /* menu width ****************/
            $fh.find('#tpl-menu').css({
                'width': (fh_type == 'right') ? (($fh.find(' > .container[data-fh-align]').length > 0) ? '100%' : '') : (!check_fixed_mn && (fh_type=='top') ? '100%' : ''),
                'max-width': (fh_type == 'right') ? (($fh.find(' > .container[data-fh-align]').length > 0) ? 'calc(100% - ' + fixed_mn_width + 'px)' : '') : (!check_fixed_mn && (fh_type=='top') ? 'calc(100% - ' + navbarHeader_width + 'px)' : '')
            });

            /* menu 확장기능 ul, li, a => 메뉴 행간별 line-height, height :: 확장기능 행간 조절 ****************/
            $fh.find('.cl-fixed-menu#fixed-menu').css('line-height', (fh_type == 'right') ? fixed_mn_height + 'px' : '');
            $fh.find('.cl-fixed-menu#fixed-menu li > a:not(.cl-langlist):not(.cl-umMenu):not(.cl-lang)').css('line-height', (fh_type == 'right') ? (fixed_mn_height - 1) + 'px' : '');
            $fh.find('.cl-fixed-menu#fixed-menu,.cl-fixed-menu#fixed-menu li > a:not(.cl-langlist):not(.cl-umMenu):not(.cl-lang)').css({
                'height': (fh_type == 'right') ? fixed_mn_height + 'px' : '',
            });

            /* menu 확장기능 ul, li, a => 메뉴 행간별 line-height, height :: 확장기능 다국어 행간 조절  ****************/
            $fh.find('.cl-fixed-menu#fixed-menu .cl-visible.siteLANG, .cl-fixed-menu#fixed-menu .cl-visible.siteLANG .slang-active,\
                     .cl-fixed-menu#fixed-menu .cl-visible.siteLANG .cl-lang').css({
                'line-height': (fh_type == 'right') ? ($fh.find('.cl-fixed-menu li.cl-fixbtn').height() - 1) + 'px' : '',
                'height': (fh_type == 'right') ? $fh.find('.cl-fixed-menu li.cl-fixbtn').height() + 'px' : '',
            });

            /* menu 로고 a => 메뉴 행간별 line-height, height ****************/
            if ($('body').width() > 768) {
                $fh.find('.navbar-brand').css({
                    'line-height': (fh_type == 'sidebar' || (fh_type != 'sidebar' && $fh.find(' > .container[data-fh-align]').length == 0)) ? '' : logo_mn_height + 'px',
                });
            } else {
                $fh.find('.navbar-brand').css('line-height', '');
            }
        }


        if (fh_type == 'sidebar' && window.innerWidth > 768) {
            var siteLANG_hght = Number($fh.find('.cl-visible.siteLANG').outerHeight());
            siteLANG_hght = (typeof MODE == 'undefined') ? siteLANG_hght : siteLANG_hght + 35;

            $fh.find('.menu-inner').css('height', 'calc(100% - ' + siteLANG_hght + 'px)');
        }

        if (checkEllist) {
            if (fh_type == 'right' && $fh.find('.mini-home').length > 0) {
                if ($('body').width() > 768) {
                    $fh.find('.mini-home').closest('.navbar-collapse').attr('style', 'display: inline-block !important');
                } else $fh.find('.mini-home').parent().removeAttr('style');
            }
        }
    }

    $(document).on('mouseenter', '.el-menu [data-fixtype^="sidebar_"] .siteLANG.cl-fixbtn, .el-menu [data-fixtype^="sidebar_"] .siteUM.cl-fixbtn, #elmenu-display .siteLANG.cl-fixbtn', function() {
        var fixtypeNum = $('.el-menu header.navbar').attr('data-fixtype').replace(/(top|sidebar)\_/gi, ''),
            $dropdown = $(this).find('.dropdown-menu'),
            checkSiteLang = ($(this).hasClass('siteLANG')) ? 'siteLang' : 'um',
            $toggle = (checkSiteLang == 'siteLang') ? $(this).find('.cl-lang.dropdown-toggle') : $(this).find('.cl-logout.dropdown-toggle'),
            $dropdown_width = $dropdown.outerWidth(),
            $toggle_width = $toggle.outerWidth(),
            pos_left = $toggle.offset().left.toFixed(0),
            fixedMenu_pdlf = (checkSiteLang == 'um') ? Number($('.el-menu .cl-fixed-menu').css('padding-left').replace(/px/gi, '')) : '',
            fixedSiteLang_pdlf = (checkSiteLang == 'siteLang') ? Number($('.el-menu .siteLANG.cl-visible').css('padding-left').replace(/px/gi, '')) : 0,
            fixedMenu_textalign = ($('header.navbar[data-fixtype]').attr('data-fixtextalign')) ? $('header.navbar[data-fixtype]').attr('data-fixtextalign') : 'center',
            checkSidebar = ($('header.navbar[data-fixtype]').hasClass('sidebar')) ? true : false,
            fixtypeArr = ['01', '02', '03', '08'],
            check_scroll = (checkSidebar) ? $('header.navbar[data-fixtype] .menu-inner').hasVerticalScrollbar() : false;

        pos_left = ($(this).parents('#elmenu-display').hasClass('elmenu-color-edit') && checkSiteLang == 'siteLang') ? $toggle.position().left.toFixed(0) : pos_left;

        if (checkSiteLang == 'um') {
            if ($.inArray(fixtypeNum, fixtypeArr) > -1) {
                var left_val = 0;
                pos_left -= fixedMenu_pdlf;
                if (fixedMenu_textalign == 'center') {
                    var left_val = pos_left - $dropdown_width / 2 + $toggle_width / 2;
                    left_val = (check_scroll) ? left_val - 8 : left_val;
                    $dropdown.css('left', left_val);
                } else if (fixedMenu_textalign == 'left') {
                    $dropdown.css('left', 0);
                } else $dropdown.css({
                    'left': 'auto',
                    'right': 0
                });
            } else {
                $dropdown.css('left', -$dropdown_width / 2 + $toggle_width / 2);
            }
        } else {
            var cl_lang_top = Number($(this).find('.cl-lang').position().top.toFixed(0)),
                cl_lang_hght = Number($(this).find('.cl-lang').outerHeight());

            if (checkSidebar) {
                if (fixedMenu_textalign == 'center') {
                    $dropdown.css('left', pos_left - $dropdown_width / 2 + $toggle_width / 2);
                } else if (fixedMenu_textalign == 'left') {
                    $dropdown.css('left', fixedSiteLang_pdlf);
                } else $dropdown.css({
                    'left': 'auto'
                });
            } else {
                if($('.el-menu header.navbar .cl-menu-option').length == 0)  $dropdown.css('left', pos_left - $dropdown_width / 2 + $toggle_width / 2);
            }

            if (!$(this).parents('#elmenu-display').hasClass('elmenu-color-edit')) $dropdown.css('bottom', cl_lang_top + cl_lang_hght + 10);
        }
    });

    $.fn.hasVerticalScrollbar = function() {
        // This will return true, when the div has vertical scrollbar
        if (typeof this.get(0) == 'undefined') return false;
        return this.get(0).scrollHeight > this.height();
    }

    $.contentsSlider = {
        ready: function(el_seq) {
            return new Promise((resolve, reject) => {
                let $swiperEL = $('.element[data-id="' + el_seq + '"]');
                let column = ($swiperEL.find('[data-matrix-loop]').length > 0)? Number($swiperEL.find('[data-matrix-loop]').attr('data-matrix-column')) : $swiperEL.find('.item').length;
                let eltype = (typeof $swiperEL.attr('data-type') != 'undefined')? $swiperEL.attr('data-type') : '';               

                $swiperEL.find('.item').parent().parent().addClass('swiper');
                $swiperEL.find('.item').parent().addClass('swiper-wrapper');
                $swiperEL.find('.item').addClass('swiper-slide');

                let swiperContainer = '.element[data-id="' + el_seq + '"] .swiper';
                let container = document.querySelector(swiperContainer);
                let wrapper = document.querySelector('.element[data-id="' + el_seq +'"] .swiper-wrapper');
                let slides = container.querySelectorAll('.swiper-slide');
                let containerWidth = $(swiperContainer).outerWidth();
                let slideCnt = slides.length;

                if($swiperEL.find('.full-width').length == 0 && containerWidth > 1170) containerWidth = 1170;
                let slideWidth = containerWidth / column;
                // console.log($swiperEL.attr('data-case'), 'width', containerWidth, $(swiperContainer).width() / column, slideWidth);
                if(eltype == 'contents') {
                    slides.forEach(function (slide) {
                         slide.style.width = `${slideWidth}px`;
                    });
                }

                // if(slideCnt < column + 1 || slideCnt % column > 0) {
                //     let totalSlideCnt = slideCnt;
                //     let totalPages = Math.ceil(slideCnt / column);
                //     if(totalPages == 1) totalPages = 2;
                //     let leastSlideCnt = lcm(slideCnt, column);
                //     if(leastSlideCnt <= column) leastSlideCnt = leastSlideCnt * 2;
                //     // console.log('totalSlideCnt', totalSlideCnt);
                //     // console.log('lcm', lcm(slideCnt, column));
                //     while (totalSlideCnt < slideCnt * totalPages) {
                //         Array.from(slides).forEach((slide, index) => {
                //             const clone = slide.cloneNode(true); // 슬라이드 복제
                //             clone.classList.add('plus-slide');   // 복제된 슬라이드에 'plus-slide' 클래스 추가
                //             clone.setAttribute('data-original-slide-index', index);
                //             wrapper.appendChild(clone);       // 컨테이너에 추가
                //             totalSlideCnt++;                 // 총 슬라이드 수 증가
                //         });
                //     }
                // } 

                // function gcd(a, b) {
                //     return b === 0 ? a : gcd(b, a % b);
                // }

                // function lcm(a, b) {
                //     return (a * b) / gcd(a, b);
                // }
               
                resolve(true);
            });
        },
        init: function(el_seq, elsettings, mode) {
            if(typeof mode == 'undefined' || !mode) mode = 'r';
            
            let $swiperEL = $('.element[data-id="' + el_seq + '"]');
            // console.log('contents slider init');
            if($swiperEL.find('.item.modify').length > 0) return false;

            let blockorg = elsettings.blockorg;
            let column = ($swiperEL.find('[data-matrix-loop]').length > 0)? Number($swiperEL.find('[data-matrix-loop]').attr('data-matrix-column')) : $swiperEL.find('.item').length;
            let slideCount = $swiperEL.find('.item').length;
            let windowWidth = $(window).width();
                    
            if(typeof blockorg != 'undefined') $swiperEL.attr('data-case', blockorg);

            if(windowWidth < 992) {
                let tabletCol = 4;
                if($swiperEL.find('.item').hasClass('col-sm-4')) tabletCol = 3;
                if($swiperEL.find('.item').hasClass('col-sm-6')) tabletCol = 2;
                if(typeof blockorg != 'undefined') {
                    // if(blockorg == 'contents77') tabletCol = 2;
                    // if(blockorg == 'contents78') tabletCol = 2;
                    // if(blockorg == 'contents79') tabletCol = 2;
                    if(blockorg == 'contents134') tabletCol = 2;
                    if(blockorg == 'contents137') tabletCol = 2;
                    if(blockorg == 'contents138') tabletCol = 1;
                }
                column = tabletCol;
            }
            if(windowWidth < 768) {
                let mobileCol = 2;
                if($swiperEL.find('.item').hasClass('col-xs-6')) mobileCol = 2;
                if($swiperEL.find('.item').hasClass('col-xs-12')) mobileCol = 1;
                if(typeof blockorg != 'undefined') {
                    if(blockorg == 'contents77') mobileCol = 1;
                    if(blockorg == 'contents78') mobileCol = 1;
                    if(blockorg == 'contents79') mobileCol = 1;
                    if(blockorg == 'contents134') mobileCol = 1;
                    if(blockorg == 'contents137') mobileCol = 1;
                    if(blockorg == 'contents138') mobileCol = 1;
                }
                column = mobileCol;
            }
    
            let swiperContainer = '.element[data-id="' + el_seq + '"] .swiper';
            let elname = $('.element[data-id="' + el_seq + '"]').attr('data-name');
    
            let slider_nav_style = (typeof elsettings.slider_nav_style != 'undefined' && elsettings.slider_nav_style)? elsettings.slider_nav_style : 1;
            let slider_delay = (typeof elsettings.slider_delay != 'undefined' && elsettings.slider_delay)? Number(elsettings.slider_delay) : 1000;
            let slider_speed = (typeof elsettings.slider_speed != 'undefined' && elsettings.slider_speed)? Number(elsettings.slider_speed) : 1000;
            let slider_nav_size = getComputedStyle(document.querySelector('.' + elname)).getPropertyValue('--slider-nav-size');
            let slider_nav_display = (typeof elsettings.slider_nav_display != 'undefined' && elsettings.slider_nav_display)? elsettings.slider_nav_display : ['arrow', 'pagination'];
            let slider_motion = (typeof elsettings.slider_motion != 'undefined' && elsettings.slider_motion)? elsettings.slider_motion : 'space';

            let useNavigation = (slider_nav_display.indexOf('arrow') > -1)? true : false;
            let usePagination = (slider_nav_display.indexOf('pagination') > -1)? true : false;

            let autoplayEnabled = (mode == 'r')? true : false;
            
            switch (slider_motion) {
                case 'slow':
                    useNavigation = false;
                    usePagination = false;
                    break;
                case 'space':
                    usePagination = false;
                    if (slideCount <= column) {
                        useNavigation = false;
                        autoplayEnabled = false;
                    }
                    break;
                case 'page':
                    if (slideCount <= column) {
                        useNavigation = false;
                        usePagination = false;
                        autoplayEnabled = false;
                    }
                    break;                    
                case 'stop':
                    if (slideCount <= column) {
                        useNavigation = false;
                        usePagination = false;
                    }
                    autoplayEnabled = false;
                    break;
            }
            
            if(typeof slider_nav_size == 'undefined' || !slider_nav_size) slider_nav_size = 52;
            slider_nav_size = parseInt(slider_nav_size);

            if($swiperEL.find('.slider-nav-btn').length == 0) {
                let sliderNav = (useNavigation)? contentsSliderNav(slider_nav_size, slider_nav_style) : '';
                let sliderPagination = (usePagination)? '<div class="slider-pagination-' + el_seq + '"></div>' : '';
                if(useNavigation) $(swiperContainer).after(sliderNav);
                if(usePagination && $swiperEL.find('.slider-pagination-' + el_seq + '').length == 0) $(swiperContainer).after(sliderPagination);
            }
            
            $swiperEL.attr('data-slider-motion', slider_motion);
            $swiperEL.attr('data-slider-navsize', slider_nav_size);
            
            setTimeout(function(){
                if(document.querySelector(swiperContainer) && !document.querySelector(swiperContainer).swiper) {
                    let swiper = new Swiper(swiperContainer, {
                        slidesPerView: 'auto',
                        spaceBetween: 0,
                        slidesPerGroup: ($.inArray(slider_motion, ['page', 'stop']) > -1)? column : 1,
                        slidesPerGroupAuto: ($.inArray(slider_motion, ['page', 'stop']) > -1)? true : false,
                        allowTouchMove: (slider_motion == 'slow' || slideCount <= column)? false : true,
                        simulateTouch: (slider_motion == 'slow' || slideCount <= column)? false : true,
                        loop: true,
                        loopFillGroupWithBlank: true,
                        loopAdditionalSlides: column,
                        navigation: (useNavigation)? {
                            nextEl: '.element[data-id="' + el_seq + '"] .slider-nav-btn.next',
                            prevEl: '.element[data-id="' + el_seq + '"] .slider-nav-btn.prev',
                        } : '',
                        pagination: (usePagination)? {
                            el: '.slider-pagination-' + el_seq,
                            clickable: true,
                        } : '',
                        autoplay: {
                            enabled: autoplayEnabled,
                            delay: (slider_motion == 'slow')? 0 : slider_delay,
                            disableOnInteraction: false,
                        },
                        speed: slider_speed,
                        observer: true,
                        observeParents: true,
                        centeredSlides: false,
                        initialSlide: 0,
                        on: {
                            init: function() {
                                this.loopFix();
                                $.contentsSlider.setSliderNavPosition(el_seq);
                                // if(slider_motion == 'stop') $.contentsSlider.updateNavigationState(this);
                                if(PAGE_MODE == 'c') {
                                    let sw = this;
                                    setTimeout(function(){
                                        if(typeof sw.el != 'undefined' && sw.el) {
                                            if(!sw.el.querySelector('.item.modify')) {
                                                sw.update();
                                            }
                                        }
                                    }, 100);
                                }
                                if(windowWidth < 768) {
                                    let bulletCount = this.pagination.bullets.length;
                                    if (bulletCount > 10) {
                                        document.querySelector(".slider-pagination-" + el_seq).style.display = "none";
                                    }
                                }
                            },
                            resize: function() {
                                $.contentsSlider.setSliderNavPosition(el_seq);
                            },
                            slideChangeTransitionStart: function () {
                                // console.log('slideChangeTransitionStart', this.el.querySelector('.item.modify'), this.previousIndex);
                                if (this.el.querySelector('.item.modify')) {
                                    this.slideTo(this.previousIndex, 0, false);
                                }
                            },
                        },
                    });

                } else {
                    console.log('slide not loaded');
                }
            });
        },
        destroy: function(el_seq) {
            let swiperContainer = '.element[data-id="' + el_seq + '"] .swiper';
            // console.log('swiperContainer', swiperContainer, document.querySelector(swiperContainer).swiper);
            if (swiperContainer && document.querySelector(swiperContainer) && document.querySelector(swiperContainer).swiper) {
                document.querySelector(swiperContainer).swiper.destroy(true, true);

                let $swiperEL = $('.element[data-id="' + el_seq + '"]');
                let $item = $swiperEL.find('.item');

                $swiperEL.find('.plus-slide').remove();
                $swiperEL.find('.slider-pagination-' + el_seq).remove();
                $swiperEL.find('.slider-nav-btn').remove();
                $swiperEL.removeClass('slider-modify');

                $item.removeClass('swiper-slide-duplicate swiper-slide-duplicate-prev swiper-slide-duplicate-next swiper-slide-duplicate-active modify');
                $item.removeClass('swiper-slide').removeAttr('role').removeAttr('aria-label');
                $item.parent().removeClass('swiper-wrapper').removeAttr('id').removeAttr('aria-live');
                $item.parent().parent().removeClass('swiper swiper-backface-hidden');
            }
        },
        update: function(el_seq, elsettings, mode) {
            if(typeof mode == 'undefined' || !mode) mode = 'r';
            if(PAGE_MODE == 'c' && localStorage.hasOwnProperty('slider_elsettings')) {
                // console.log('mode', mode);
                // console.log('update setting', JSON.stringify(elsettings));
                localStorage.setItem('slider_elsettings', JSON.stringify(elsettings));
            }
            $.contentsSlider.destroy(el_seq);
            $.contentsSlider.ready(el_seq).then(() => {$.contentsSlider.init(el_seq, elsettings, mode)});
        },
        setSliderNavPosition: function(el_seq) {
            let $swiperEL = $('.element[data-id="' + el_seq + '"]');
            let $firstSlide = $('.element[data-id="' + el_seq + '"] .swiper-slide.item').first();

            if(typeof $swiperEL.offset() != 'undefined' && typeof $firstSlide.offset() != 'undefined') {
                let sideMargin = $swiperEL.find('.swiper').outerWidth() / 2 + 25;
                let offsetTop = $firstSlide.offset().top - $swiperEL.offset().top;
                let slideHeight = $firstSlide.height();
                let topPos = offsetTop + (slideHeight / 2);
                // console.log('offsetTop', offsetTop);
                $swiperEL.find('.slider-nav-btn').css('top', `${topPos}px`);

                if($swiperEL.find('.full-width').length == 0 && $(window).width() > 767) {
                    $('.element[data-id="' + el_seq + '"] .slider-nav-btn.next').css({
                        right: `calc(50% - ${sideMargin}px - var(--slider-nav-size))`,
                    });

                    $('.element[data-id="' + el_seq + '"] .slider-nav-btn.prev').css({
                        left: `calc(50% - ${sideMargin}px - var(--slider-nav-size))`,
                    });
                } else {
                    $('.element[data-id="' + el_seq + '"] .slider-nav-btn.next').css('right', '');
                    $('.element[data-id="' + el_seq + '"] .slider-nav-btn.prev').css('left', '');
                }
            }

            if($('#el-blockConfig.open').length > 0) {
                let selector = $('#select-navigation-style').attr('data-selector');
                let bcCSS = getStyleText();
                let prevVal = style.getCssProperty(bcCSS, selector, '--slider-nav-color');
                if(prevVal == 'initial') {
                    let color = $('.bc-slider-nav-ctrl input[data-root="--slider-nav-color"]').val();
                    if(typeof color != 'undefined' && color) {
                        $( selector + ' .slider-nav-btn svg').css('fill', color);
                    }
                } else {
                    $( selector + ' .slider-nav-btn svg').removeAttr('style');
                }
            }

            $('.element[data-id="' + el_seq + '"] .slider-nav-btn').removeClass('invisible');
        },
        updateNavigationState: function(swiper) {
            let prevButton = swiper.navigation.prevEl;
            let nextButton = swiper.navigation.nextEl;
            let pagination = $(swiper.pagination.bullets);
            
            setTimeout(function(){
                if(prevButton && nextButton) {
                    if(pagination.length <= 1) {
                        prevButton.classList.add('swiper-button-disabled', 'swiper-button-hidden');
                        nextButton.classList.add('swiper-button-disabled', 'swiper-button-hidden');
                        swiper.pagination.el.classList.add('swiper-button-disabled', 'swiper-pagination-hidden');
                    } else {
                        if (swiper.realIndex === 0) {
                            swiper.allowSlidePrev = false;
                            prevButton.classList.add('swiper-button-disabled');
                            prevButton.setAttribute('aria-disabled', true);
                        } else {
                            swiper.allowSlidePrev = true;
                            prevButton.classList.remove('swiper-button-disabled');
                            prevButton.removeAttribute('aria-disabled');
                        }

                        if (pagination.last().hasClass('swiper-pagination-bullet-active')) {
                            swiper.allowSlideNext = false;
                            nextButton.classList.add('swiper-button-disabled');
                            nextButton.setAttribute('aria-disabled', true);
                        } else {
                            swiper.allowSlideNext = true;
                            nextButton.classList.remove('swiper-button-disabled');
                            nextButton.removeAttribute('aria-disabled');
                        }
                    }
                }
                swiper.navigation.update();
                swiper.pagination.update();
            });
        }
    }

    function contentsSliderNav(size, n) {
        let navObj = { //52
            1:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52"><path d="m15.06 2-1.41 1.41L36.23 26 13.65 48.59 15.06 50l24-24-24-24z"/></svg>',
            2:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52"><path d="M26 2C12.75 2 2 12.75 2 26s10.75 24 24 24 24-10.75 24-24S39.25 2 26 2Zm-3.36 36-.85-.85L32.94 26 21.79 14.85l.85-.85 12 12-12 12Z"/></svg>',
            3:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52"><path d="M2 2v48h48V2H2Zm20.64 36-.85-.85L32.94 26 21.79 14.85l.85-.85 12 12-12 12Z"/></svg>',
            4:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52"><path d="M50 26 35.86 11.86l-1.42 1.41L46.17 25H2v2h44.17L34.45 38.73l1.41 1.41 12.72-12.73h.01L50 26z"/></svg>',
            5:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52"><path d="M26 3c12.68 0 23 10.32 23 23S38.68 49 26 49 3 38.68 3 26 13.32 3 26 3m0-1C12.75 2 2 12.75 2 26s10.75 24 24 24 24-10.75 24-24S39.25 2 26 2Z"/><path d="m22.64 38-.85-.85L32.94 26 21.79 14.85l.85-.85 12 12-12 12z"/></svg>',
            6:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52"><path d="M49 3v46H3V3h46m1-1H2v48h48V2Z"/><path d="m22.64 38-.85-.85L32.94 26 21.79 14.85l.85-.85 12 12-12 12z"/></svg>',
            7:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52"><path d="M50.04 25.85s0-.06-.01-.09c0-.02-.02-.03-.03-.05-.02-.05-.05-.09-.08-.13-.03-.04-.05-.08-.09-.11a.444.444 0 0 0-.11-.08c-.04-.03-.08-.06-.13-.08-.02 0-.03-.02-.05-.03C38.78 21.69 37.77 13 37.73 12.63a.75.75 0 0 0-.82-.67.75.75 0 0 0-.67.82c.04.36.89 8.04 9.37 12.47H2.69c-.41 0-.75.34-.75.75s.34.75.75.75h42.94c-8.48 4.43-9.34 12.1-9.37 12.47-.04.41.26.78.67.82h.08c.38 0 .71-.29.75-.67.04-.37 1.04-9.06 11.81-12.65 0 0 .01 0 .02-.01a.72.72 0 0 0 .21-.12l.06-.06c.04-.04.08-.09.11-.14.02-.03.03-.06.04-.09 0-.02.02-.03.03-.06 0-.03 0-.06.01-.09.01-.05.02-.1.02-.15 0-.05 0-.1-.02-.15Z"/></svg>',
            8:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52"><path d="m3.07 27.82-1 .08c.04.47.09.93.15 1.39v.02c.02.15.04.3.07.45l.99-.16c-.1-.63-.18-1.27-.23-1.9ZM3.12 23.6l-.99-.1c-.07.66-.11 1.32-.12 2l1 .02c.01-.64.05-1.28.12-1.91ZM3.94 19.47l-.96-.28c-.08.28-.16.56-.23.85 0 .01 0 .03-.01.04V20.71l.98.2c.13-.62.28-1.25.47-1.86ZM6.59 40.12c.39.54.81 1.06 1.24 1.57l.76-.65c-.42-.48-.82-.99-1.19-1.5l-.81.59ZM9.94 8.17c-.06.05-.11.1-.17.15l-.01.01-.02.02v.04l-.02.02-.01.01c-.24.23-.47.47-.69.71l.73.68c.44-.46.9-.92 1.37-1.34l-.67-.74ZM3.78 31.97l-.97.26s.02.09.04.14 0 .01 0 .02V32.7c0 .01 0 .03.01.04s0 .01 0 .02v.03c.13.42.26.84.41 1.25l.94-.34c-.22-.6-.41-1.21-.57-1.83ZM7.75 12l-.79-.61c-.29.37-.56.75-.82 1.14s0 0 0 .01-.02.03-.03.04 0 0 0 .01-.01.02-.02.03V12.76c0 .01-.02.02-.02.04 0 .01-.01.02-.02.03l.84.54c.34-.53.72-1.06 1.1-1.57ZM4.34 36.35c.29.6.6 1.19.94 1.77l.86-.51c-.32-.55-.62-1.12-.9-1.69l-.9.43ZM17.75 4.52l-.36-.93c-.4.15-.79.32-1.18.49s0 0-.01 0-.02 0-.03.01h-.09c-.14.06-.28.13-.41.2l.44.9c.57-.28 1.16-.53 1.76-.76ZM35.73 4.05c-.61-.27-1.23-.51-1.86-.73l-.33.94c.6.21 1.2.44 1.78.7l.41-.91ZM48.36 20.6l.97-.23c-.13-.53-.27-1.05-.43-1.57s0 0 0-.01V18.64c0-.01 0-.03-.01-.04 0-.01 0-.02-.01-.04l-.95.31c.2.6.38 1.22.53 1.84ZM39.56 6.2c-.17-.12-.34-.23-.51-.34s-.02-.02-.04-.02H39s-.01 0-.02-.01h-.02s-.01 0-.02-.01h-.07s-.01 0-.02-.01h-.04s-.02-.02-.04-.02l-.3-.18-.5.87c.55.31 1.1.66 1.62 1.02l.57-.82ZM9.49 43.42c.36.34.74.68 1.12 1s.02.01.02.02 0 0 .01 0 0 0 .01.01h.03c.07.06.15.12.22.18l.63-.78c-.5-.4-.98-.82-1.44-1.26l-.69.73ZM48.97 24.76l1-.05v-.03c-.04-.62-.1-1.24-.18-1.85l-.99.14c.09.63.15 1.27.18 1.91ZM31.56 2.65c-.33-.08-.66-.15-.99-.21h-.22c-.2-.04-.41-.07-.61-.1l-.15.99c.63.09 1.26.22 1.88.36l.23-.97ZM21.8 3.38l-.18-.98c-.16.03-.33.06-.49.1s0 0-.01 0H20.93c-.02 0-.03 0-.04.01-.28.06-.57.13-.85.21s-.03 0-.04.01H19.94l.26.96c.61-.17 1.24-.31 1.87-.43ZM26 3c.39 0 .78 0 1.16.03l.05-1c-.15 0-.29-.01-.44-.02H25.99c-.41.01-.82.04-1.22.07l.08 1c.63-.05 1.28-.08 1.92-.08ZM5.5 15.56l-.89-.45c-.26.51-.5 1.02-.72 1.55v.02c0 .01-.01.03-.02.04 0 .01-.01.03-.02.04v.07l.93.38c.24-.59.51-1.17.8-1.74ZM42.94 9c-.13-.13-.26-.25-.38-.38l-.01-.01-.02-.02-.01-.01-.01-.01-.02-.02-.01-.01-.01-.01-.02-.02-.01-.01-.03-.03-.01-.01-.02-.02-.01-.01-.01-.01-.02-.02-.01-.01-.01-.01-.03-.03c-.25-.24-.51-.46-.78-.69l-.64.76c.49.41.96.85 1.41 1.3l.71-.71ZM45.76 12.38v-.03s0-.01-.01-.02v-.02l-.02-.02-.01-.01c-.01-.02-.02-.03-.04-.05a25.6 25.6 0 0 0-1.01-1.32l-.77.63c.4.49.79 1.01 1.15 1.53l.82-.57ZM43.89 40.45l.78.63V40.8s0-.01.01-.02v-.02l.02-.02v-.01c0-.01.02-.02.03-.03v-.01c0-.01.02-.02.03-.04.01-.02.02-.03.04-.05.01-.02.02-.03.04-.05.06-.08.12-.16.17-.24s.02-.02.03-.04c0-.01.02-.02.03-.04v-.02s0-.01.01-.02V40.09s.01-.02.02-.03 0 0 0-.01v-.01l-.83-.56c-.36.53-.74 1.04-1.14 1.54ZM40.96 43.47l.65.76c.51-.43.99-.89 1.46-1.36l-.71-.7c-.45.45-.92.89-1.4 1.31ZM13.46 5.54c-.45.28-.9.57-1.33.88h-.04s-.02.01-.02.02c-.05.04-.1.07-.15.11l.59.81c.51-.38 1.05-.74 1.59-1.07l-.52-.85ZM48.98 27.06c-.03.64-.08 1.28-.17 1.91l.99.13c.02-.12.03-.25.04-.37s0-.01 0-.02v-.05c.05-.49.09-.99.11-1.49l-1-.05ZM46.23 36.95l.88.48c.1-.19.21-.39.3-.58s.02-.04.03-.06.01-.03.02-.04v-.01s0-.02.01-.03 0 0 0-.01v-.01s0-.02.01-.03V36.43s0-.02.01-.02v-.04s0-.02.01-.02v-.05s0-.02.01-.02v-.01c0-.01.01-.03.02-.04v-.02c.03-.06.05-.12.08-.18l-.92-.4c-.26.58-.54 1.16-.84 1.72ZM47.89 33.08l.95.31c.2-.63.38-1.27.53-1.93l-.97-.23c-.14.62-.32 1.24-.51 1.85ZM47.92 16.2c-.22-.49-.45-.96-.7-1.43s0 0 0-.01v-.05c-.04-.08-.08-.15-.12-.22l-.88.48c.31.56.6 1.13.86 1.71l.91-.41ZM16.83 48.19c.28.12.56.23.85.33H17.81s.02 0 .03.01c.22.08.43.15.65.22s0 0 .01 0h.07l.3-.95c-.61-.19-1.21-.41-1.8-.66l-.38.92ZM21.03 49.48c.19.04.38.08.57.11h.02c.41.07.83.14 1.25.19l.12-.99c-.63-.08-1.27-.19-1.89-.32l-.21.98ZM12.94 46.14s.03.02.05.03H13s.01 0 .02.01h.08s.02.01.03.02 0 0 .01 0c.37.23.75.45 1.13.67s.02.01.03.02 0 0 .01 0h.01s.02.01.03.01H14.49l.47-.88c-.56-.3-1.11-.63-1.65-.98l-.54.84ZM37.52 45.91l.5.87c.06-.04.12-.07.18-.11h.01c.01 0 .03-.01.04-.02H38.46s.02-.01.03-.02 0 0 .01 0h.01s.02-.01.03-.02h.01c.01 0 .03-.02.04-.02h.01s.02-.01.03-.02 0 0 .01 0c.28-.18.56-.36.83-.55l-.57-.82c-.52.36-1.07.71-1.62 1.03ZM26 49h-.58l-.02 1H26.1c.26 0 .51-.01.77-.02s.03 0 .05 0h.13l-.06-1c-.44.03-.89.04-1.34.04ZM33.7 47.68l.33.94H34.09c.01 0 .03 0 .04-.01h.06c.01 0 .03-.01.04-.02s.03-.01.04-.02c.03-.01.07-.03.1-.04.01 0 .03-.01.04-.02h.02c.01 0 .03-.01.04-.02H34.68c.01 0 .03-.01.04-.02.28-.11.56-.23.83-.36l-.41-.91c-.58.26-1.18.5-1.78.72ZM29.62 48.72l.16.99c.66-.1 1.32-.24 1.96-.39l-.24-.97c-.62.15-1.25.28-1.88.38ZM29.36 17.36l-.7.71 7.43 7.43H14v1h22.09l-7.43 7.43.7.71L38 26l-8.64-8.64z"/></svg>',
            9:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52"><path d="m21.74 2-.91.43L32.16 26 20.83 49.57l.91.43 11.53-24L21.74 2z"/></svg>',
            10: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52"><path d="m49.68 25.22-.15-.15-13.86-13.86c-.43-.43-1.12-.43-1.55 0l-.15.15c-.43.43-.43 1.12 0 1.55l11.89 11.88H3.2c-.66 0-1.2.54-1.2 1.2s.54 1.2 1.2 1.2h42.66L33.98 39.07c-.43.43-.43 1.12 0 1.55l.15.15c.43.43 1.12.43 1.55 0l13.86-13.86.15-.15c.21-.21.32-.49.32-.77s-.11-.56-.32-.77Z"/></svg>',
            11: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52"><path d="m39.31 24.94-22.5-22.5c-.59-.59-1.54-.59-2.12 0s-.59 1.54 0 2.12L36.13 26 14.69 47.44a1.49 1.49 0 0 0 0 2.12c.29.29.68.44 1.06.44s.77-.15 1.06-.44l22.5-22.5c.59-.59.59-1.54 0-2.12Z"/></svg>', 
            12: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52"><path d="M39.76 23.42 19.41 3.07c-1.38-1.38-3.79-1.38-5.17 0-.69.69-1.07 1.61-1.07 2.58s.38 1.9 1.07 2.58L32 25.99 14.24 43.75c-.69.69-1.07 1.61-1.07 2.58a3.655 3.655 0 0 0 3.66 3.66c.98 0 1.89-.38 2.58-1.07l20.34-20.34c.69-.69 1.07-1.61 1.07-2.58s-.38-1.9-1.07-2.58Zm-1.06 4.1L18.36 47.86c-.82.82-2.23.82-3.05 0-.41-.41-.63-.95-.63-1.52s.22-1.12.63-1.52L33.6 26.53c.29-.29.29-.77 0-1.06L15.3 7.18c-.41-.41-.63-.95-.63-1.52s.22-1.12.63-1.52c.42-.42.97-.63 1.52-.63s1.1.21 1.53.63l20.34 20.34c.41.41.63.95.63 1.52s-.22 1.12-.63 1.52Z"/></svg>', 
            13: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52"><path d="m50 26-.01-.01-3.9-3.99L32.38 8H22l13.71 14H2v8h33.7L22 44h10.38l12.43-12.7 1.27-1.3L50 26z"/></svg>', 
            14: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52"><path d="m46.07 26-.01-.01L22.07 2H7.93l24 24-24 24h14.14L39 33.07 46.07 26z"/></svg>', 
            15: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52"><path d="m32.19 26-.01-.01L13.19 7H2l19 19L2 45h11.19L26.6 31.6l5.59-5.6z"/><path d="M49.99 25.99 31 7H19.81l19 19-19 19H31l13.4-13.4L50 26l-.01-.01z"/></svg>', 
            16: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52"><path d="M50 26c0-.07-.01-.13-.04-.19-.01-.03-.03-.05-.05-.07-.02-.03-.03-.06-.06-.09L27.23 3.02c-.2-.2-.51-.2-.71 0s-.2.51 0 .71L48.29 25.5H2.5c-.28 0-.5.22-.5.5s.22.5.5.5h45.79L26.52 48.27c-.2.2-.2.51 0 .71a.485.485 0 0 0 .7 0l22.62-22.62s.09-.1.11-.17c.02-.04.02-.08.02-.12 0-.03.02-.05.02-.08Z"/></svg>', 
            17: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52"><path d="m36.74 17.71-.71.71 11.56 11.55H2v1h48L36.74 17.71z"/></svg>', 
            18: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52"><path d="M40.48 23.37 18.36 2.95c-2.29-2.11-6-.49-6 2.63v40.84c0 3.11 3.71 4.74 6 2.63l22.12-20.42a3.576 3.576 0 0 0 0-5.25Z"/>', 
            19: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52"><path d="M14 2v48l26-24L14 2z"/></svg>', 
            20: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52"><path d="M26 2C12.75 2 2 12.75 2 26s10.75 24 24 24 24-10.75 24-24S39.25 2 26 2Zm-4.5 36V14l13 12-13 12Z"/></svg>', 
            21: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52"><path d="M2 2v48h48V2H2Zm19.5 36V14l13 12-13 12Z"/></svg>', 
            22: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52"><path d="M50 26 32 9v16H2v2h30v16l18-17z"/></svg>', 
            23: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52"><path d="M26 3c12.68 0 23 10.32 23 23S38.68 49 26 49 3 38.68 3 26 13.32 3 26 3m0-1C12.75 2 2 12.75 2 26s10.75 24 24 24 24-10.75 24-24S39.25 2 26 2Z"/><path d="m34.5 26-13-12v24l13-12z"/></svg>', 
            24: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52"><path d="M49 3v46H3V3h46m1-1H2v48h48V2Z"/><path d="m34.5 26-13-12v24l13-12z"/></svg>', 
            25: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52"><path d="M47.18 23.33 42.59 19 32 9v10H2v14h30v10l10.59-10 4.59-4.33L50 26l-2.82-2.67z"/></svg>', 
            26: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52"><path d="m34.5 26-13-12v24l13-12zM26 2H25.67c-.41.01-.82.04-1.22.07l.08 1c.63-.05 1.28-.08 1.92-.08v-1Zm-4.38.4c-.16.03-.33.06-.49.1s0 0-.01 0H20.89c-.28.06-.57.13-.85.21s-.03 0-.04.01H19.94l.26.96c.61-.17 1.24-.31 1.87-.43l-.18-.98Zm-4.23 1.19c-.4.15-.79.32-1.18.49s0 0-.01 0-.02 0-.03.01h-.09c-.14.06-.28.13-.41.2l.44.9c.57-.28 1.16-.53 1.76-.76l-.36-.93Zm-3.93 1.95c-.45.28-.9.57-1.33.88h-.04s-.02.01-.02.02c-.05.04-.1.07-.15.11l.59.81c.51-.38 1.05-.74 1.59-1.07l-.52-.85ZM9.94 8.17c-.06.05-.11.1-.17.15l-.01.01-.02.02-.02.02-.01.01c-.24.23-.47.47-.69.71l.73.68c.44-.46.9-.91 1.37-1.34l-.67-.74Zm-2.99 3.22c-.29.37-.56.75-.82 1.14s0 0 0 .01-.02.03-.03.04 0 0 0 .01-.01.02-.02.03V12.74c0 .01-.02.02-.02.04 0 .01-.01.02-.02.03l.84.54c.34-.53.72-1.06 1.1-1.57l-.79-.61Zm-2.34 3.72c-.26.51-.5 1.02-.72 1.55v.02c0 .01-.01.03-.02.04 0 .01-.01.03-.02.04v.08l.93.38c.24-.59.51-1.17.8-1.74l-.89-.45Zm-1.63 4.08c-.08.28-.16.56-.23.85 0 .01 0 .03-.01.04V20.69l.98.2c.13-.62.28-1.25.47-1.86l-.96-.28Zm-.85 4.31c-.07.66-.11 1.32-.12 2l1 .02c.01-.64.05-1.28.12-1.91l-.99-.1Zm.94 4.32-1 .08c.03.44.08.88.14 1.31v.03c.03.18.05.36.08.54l.99-.16c-.1-.63-.18-1.27-.23-1.9Zm.71 4.15-.97.26c.04.13.07.26.11.39s0 .02 0 .03V33.07c0 .01 0 .03.01.04v.07l.18.51.94-.34c-.22-.6-.41-1.21-.57-1.83Zm1.46 3.95-.9.43c.18.37.36.73.56 1.09.12.23.25.45.38.67l.86-.51c-.32-.55-.62-1.12-.9-1.69Zm2.16 3.61-.81.59v.02s.01.02.02.02 0 0 0 .01.02.03.03.04c.2.27.4.53.61.79v.09l.02.02.01.01c.08.09.15.18.23.27l.76-.65c-.42-.48-.82-.99-1.19-1.5Zm2.78 3.16-.69.73s.08.08.12.11l.01.01.01.01.01.01c.37.35.76.68 1.16 1s0 0 .01 0h.02c.01.01.03.02.04.03l.63-.78c-.5-.4-.98-.82-1.44-1.26Zm3.31 2.61-.54.84c.05.03.1.07.16.1h.01s.02.01.03.02 0 0 .01 0h.01s.02.01.03.02 0 0 .01 0H13.51s.02 0 .03.01h.02s.02.01.03.02h.01l.27.15.47-.88c-.56-.3-1.11-.63-1.65-.98Zm3.72 1.96-.38.92c.21.09.43.17.64.25h.13c.33.12.66.23.99.34l.3-.95c-.61-.19-1.21-.41-1.8-.66Zm4.02 1.25-.21.98c.24.05.47.1.71.14h.08c.35.06.71.11 1.07.16l.12-.99c-.63-.08-1.27-.19-1.89-.32Zm6.11.45c-.44.03-.89.04-1.34.04h-.58l-.02 1H25.97c.26 0 .51-.01.77-.02h.17l-.06-1Zm4.16-.62c-.62.15-1.25.28-1.88.38l.16.99c.66-.1 1.32-.24 1.96-.39l-.24-.97Zm3.98-1.38c-.58.26-1.18.5-1.78.72l.33.94s.02 0 .03-.01.03-.01.04-.02 0 0 .01 0H34.45s.02 0 .03-.01 0 0 .01 0 .03-.01.04-.02c.4-.16.79-.32 1.18-.5l-.41-.91Zm3.66-2.08c-.52.36-1.07.71-1.62 1.03l.5.87c.14-.08.28-.16.42-.25s0 0 .01 0H38.56s.01 0 .02-.01h.02s.01 0 .02-.01h.01c.01 0 .02-.02.04-.02h.01s.01 0 .02-.01h.02c.01 0 .03-.02.04-.02.01 0 .02-.02.04-.02h.01l.09-.06c.19-.12.38-.25.56-.38l-.57-.82Zm3.22-2.71c-.45.45-.92.89-1.4 1.31l.65.76c.12-.1.24-.2.35-.31l.01-.01s.02-.01.02-.02 0 0 .01-.01l.01-.01.02-.02H42.09l.01-.01.01-.01h.01l.02-.02.01-.01.01-.01.02-.02.01-.01.01-.01.02-.02.01-.01.01-.01.02-.02.01-.01.01-.01.02-.02.01-.01.02-.02.02-.02h.01l.15-.15-.71-.7Zm2.67-3.26c-.36.53-.74 1.04-1.14 1.54l.78.63c.42-.52.82-1.05 1.19-1.61l-.83-.56Zm2.04-3.68c-.26.58-.54 1.16-.84 1.72l.88.48s0-.01.01-.02c.05-.1.1-.19.15-.29l.03-.06c.02-.03.03-.06.05-.1 0-.01.01-.03.02-.04v-.01c0-.01.01-.03.02-.04v-.02s0-.02.01-.02v-.01c0-.01.01-.03.02-.04v-.01s0-.02.01-.02v-.04s0-.02.01-.02v-.02s0-.02.01-.02v-.01s0-.01.01-.02v-.02s0-.01.01-.02v-.01s0-.02.01-.02v-.04s0-.02.01-.02v-.02s0-.02.01-.02v-.01s0-.02.01-.02v-.02c0-.01.01-.03.02-.04.08-.18.16-.35.24-.53l-.92-.4Zm1.33-3.99c-.14.62-.32 1.24-.51 1.85l.95.31c.1-.31.19-.62.28-.94s0-.01 0-.02V31.99l.03-.11-.97-.23Zm.58-4.18c-.03.64-.08 1.28-.17 1.91l.99.13c.02-.14.03-.27.05-.41v-.08c.05-.48.09-.97.11-1.46l-1-.05Zm.8-4.34-.99.14c.09.63.15 1.27.18 1.91l1-.05c-.02-.47-.06-.93-.11-1.39s0-.01 0-.02l-.06-.5Zm-.99-4.28-.95.31c.2.6.38 1.22.53 1.84l.97-.23c-.16-.65-.34-1.29-.55-1.92Zm-1.77-4.03-.88.48c.31.56.6 1.13.86 1.71l.91-.41c-.27-.61-.57-1.21-.89-1.79Zm-2.46-3.63-.77.63c.4.49.79 1.01 1.15 1.53l.82-.57c-.14-.2-.28-.39-.42-.59 0 0-.01-.02-.02-.02s0 0 0-.01v-.01s-.01-.02-.02-.02 0 0 0-.01v-.01s-.01-.02-.02-.02V11.4s-.01-.02-.02-.02v-.02s-.01-.02-.02-.02v-.01c0-.01-.02-.02-.03-.04s-.03-.03-.04-.05c-.1-.12-.19-.24-.29-.36Zm-3.09-3.13-.64.76c.49.41.96.85 1.41 1.3l.71-.71c-.47-.47-.96-.92-1.47-1.35Zm-3.6-2.51-.5.87c.55.31 1.1.66 1.62 1.02l.57-.82c-.17-.12-.34-.23-.51-.34-.01 0-.02-.02-.04-.02H39s-.01 0-.02-.01h-.02s-.01 0-.02-.01h-.07s-.01 0-.02-.01h-.04c-.01 0-.02-.01-.04-.02l-.3-.18Zm-4-1.82-.33.94c.6.21 1.2.44 1.78.7l.41-.91h-.02s-.02 0-.03-.01 0 0-.01 0H35.19s-.02 0-.03-.01 0 0-.01 0c-.17-.06-.33-.12-.5-.18ZM29.6 2.27l-.15.99c.63.09 1.26.22 1.88.36l.23-.97s-.07-.02-.1-.02-.03 0-.04-.01H30.9l-.72-.12ZM26 2v1c.39 0 .78 0 1.16.03l.05-1c-.15 0-.29-.01-.44-.02H26.45Z"/></svg>',
            27: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52"><path d="M10.06 2 8.65 3.41 31.23 26 8.65 48.59 10.06 50l24-24-24-24z"/><path d="m22.06 2-1.41 1.41L43.23 26 20.65 48.59 22.06 50l24-24-24-24z"/></svg>', 
        };

        switch(size) {
            case 28:
                navObj = {
                    1:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="M9.06 2 7.65 3.41 18.23 14 7.65 24.59 9.06 26l12-12-12-12z"/></svg>',
                    2:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="M14 2C7.37 2 2 7.37 2 14s5.37 12 12 12 12-5.37 12-12S20.63 2 14 2Zm-1.36 18-.85-.85L16.94 14l-5.15-5.15.85-.85 6 6-6 6Z"/></svg>',
                    3:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="M2 2v24h24V2H2Zm10.64 18-.85-.85L16.94 14l-5.15-5.15.85-.85 6 6-6 6Z"/></svg>',
                    4:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="m26 14-7.07-7.07-1.42 1.41L22.17 13H2v2h20.17l-4.65 4.66 1.41 1.41 5.65-5.66h.01L26 14z"/></svg>',
                    5:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="M14 3c6.07 0 11 4.93 11 11s-4.93 11-11 11S3 20.07 3 14 7.93 3 14 3m0-1C7.37 2 2 7.37 2 14s5.37 12 12 12 12-5.37 12-12S20.63 2 14 2Z"/><path d="m12.64 20-.85-.85L16.94 14l-5.15-5.15.85-.85 6 6-6 6z"/></svg>',
                    6:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="M24.8 3.2v21.6H3.2V3.2h21.6M26 2H2v24h24V2Z"/><path d="m12.64 20-.85-.85L16.94 14l-5.15-5.15.85-.85 6 6-6 6z"/></svg>',
                    7:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="M25.99 14c0-.05 0-.1-.02-.15 0-.03 0-.06-.01-.09 0-.02-.02-.03-.03-.05-.02-.05-.05-.09-.08-.13-.03-.04-.05-.08-.08-.11a.444.444 0 0 0-.11-.08c-.04-.03-.08-.06-.13-.08-.02 0-.03-.02-.05-.03-5.12-1.71-5.63-5.82-5.65-6.01a.745.745 0 0 0-.82-.67.75.75 0 0 0-.67.82c.02.17.39 3.48 3.72 5.82H2.75c-.41 0-.75.34-.75.75s.34.75.75.75h19.32c-3.33 2.34-3.71 5.65-3.72 5.82-.04.41.26.78.67.82h.08c.38 0 .7-.29.75-.67.02-.17.52-4.3 5.65-6.01 0 0 .01 0 .02-.01a.72.72 0 0 0 .21-.12l.06-.06c.04-.04.08-.09.11-.14.02-.03.03-.06.05-.09 0-.02.02-.03.03-.05 0-.03 0-.06.01-.09.01-.05.02-.1.02-.15Z"/></svg>',
                    8:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="M3 14c0-.38.02-.77.06-1.15l-.99-.1c0 .07-.01.15-.02.22s0 .02 0 .03c0 .11-.01.22-.02.33s0 .02 0 .02v.15c0 .08 0 .16.01.24l1-.06c-.01-.23-.02-.46-.02-.69ZM4.3 21.06c.39.54.83 1.05 1.31 1.51l.7-.71c-.44-.43-.84-.89-1.2-1.39l-.81.59ZM2.41 17.11c.17.65.4 1.28.68 1.88l.91-.42c-.25-.55-.46-1.13-.62-1.72l-.97.26ZM3.02 9.16s-.01.03-.02.04c0 .01 0 .02-.01.03s0 .01 0 .02v.05c-.12.29-.22.59-.32.89l.95.3c.18-.58.42-1.15.69-1.69l-.89-.45c-.1.2-.2.4-.29.61ZM10.06 3.73 9.7 2.8c-.14.05-.27.11-.41.16s-.01 0-.02 0h-.05c-.01 0-.02 0-.03.01-.01 0-.02.01-.03.02-.35.16-.69.34-1.02.54l.51.86c.53-.31 1.08-.58 1.65-.8ZM24.98 13.41l1-.05c-.02-.35-.05-.71-.1-1.05s0-.02 0-.03v-.14c-.03-.18-.07-.35-.1-.52l-.98.22c.13.59.22 1.2.25 1.81ZM14 3c.19 0 .37 0 .56.01l.05-1c-.15 0-.3-.01-.45-.01H13.66c-.15.02-.31.04-.46.07l.16.99c.6-.1 1.21-.15 1.83-.15ZM24.96 9.1a13 13 0 0 0-.37-.75s-.01-.03-.02-.04-.01-.02-.02-.03 0-.01-.01-.02c0-.01-.01-.02-.02-.03 0-.01-.02-.03-.02-.04-.11-.19-.23-.38-.35-.56l-.83.55c.34.51.64 1.05.89 1.6l.91-.41ZM18.86 3.03c-.23-.1-.46-.19-.69-.28-.02 0-.03-.01-.05-.02-.01 0-.02 0-.04-.01s-.02 0-.03-.01c-.01 0-.02 0-.04-.01h-.34c-.08-.02-.17-.05-.26-.07l-.25.97c.59.15 1.17.35 1.73.6l.41-.91ZM5.97 5.09l-.01.01-.01.01s-.01.02-.02.02l-.03.03c-.29.29-.56.6-.81.92s-.02.02-.03.04l.78.62c.38-.48.8-.93 1.25-1.34l-.67-.74ZM19.51 23.52l.5.87c.36-.21.7-.43 1.03-.67 0 0 .02-.01.02-.02l.01-.01c.15-.11.3-.23.45-.35l-.64-.77c-.47.39-.98.74-1.5 1.05ZM22.56 20.91l.78.63s0-.01.01-.02c0 0 .02-.02.02-.03s.01-.02.02-.02.02-.02.03-.04.07-.09.1-.13.05-.07.07-.1.06-.09.1-.13c0-.01.02-.03.03-.04l.03-.04c0-.01.01-.02.02-.03 0-.01.01-.02.02-.03 0-.01.01-.02.02-.03 0 0 .01-.02.02-.02 0 0 0-.01.01-.02s0 0 0-.01v-.03s0-.01.01-.02v-.02s0-.02.01-.02c0 0 0-.02.01-.02 0 0 0-.02.01-.02 0 0 0-.02.01-.02l-.87-.49c-.3.53-.65 1.04-1.03 1.51ZM24.47 17.39l.95.31c.2-.63.36-1.28.45-1.95l-.99-.14c-.09.6-.23 1.2-.42 1.78ZM22.07 5.12l-.02-.02-.01-.01-.01-.01-.02-.02h-.02v-.01s-.01 0-.02-.01c0 0-.02-.02-.03-.02 0 0-.02-.01-.02-.02s-.02-.01-.02-.02c0 0-.01 0-.02-.01 0 0-.01 0-.02-.01l-.01-.01-.02-.02c-.01 0-.02-.02-.04-.03-.08-.06-.16-.12-.25-.18l-.58.82c.5.35.97.75 1.4 1.18l.71-.71c-.13-.13-.27-.26-.4-.38ZM11.51 25.74c.64.14 1.31.22 1.98.25l.04-1c-.61-.03-1.22-.1-1.82-.23l-.21.98ZM15.73 24.86l.16.99c.16-.03.32-.05.48-.09H16.83c.1-.03.2-.06.3-.1l-.32-.95c-.58.19-1.17.34-1.78.44ZM7.47 24.07c.17.11.33.21.5.31s.02.01.03.02h.01s.02 0 .02.01c.34.19.7.37 1.06.52l.4-.92c-.56-.24-1.1-.53-1.61-.87l-.54.84ZM15.4 9.4l-.7.71 3.39 3.39H8v1h10.09l-3.39 3.39.7.71L20 14l-4.6-4.6z"/></svg>',
                    9:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="m12.65 2-.91.43L17.25 14l-5.51 11.57.91.43 5.71-12-5.71-12z"/></svg>',
                    10: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="M25.79 14.56c.05-.07.11-.13.14-.22.09-.22.09-.47 0-.69-.03-.08-.08-.14-.13-.2-.02-.03-.03-.06-.06-.09l-6.51-6.51c-.35-.35-.92-.35-1.27 0s-.35.92 0 1.27l4.97 4.97H2.9c-.5 0-.9.4-.9.9s.4.9.9.9h20.03l-4.97 4.97a.9.9 0 0 0 0 1.27.9.9 0 0 0 1.27 0l6.5-6.51c.02-.02.03-.05.05-.07Z"/></svg>',
                    11: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="m21.31 12.94-10.5-10.5c-.59-.59-1.54-.59-2.12 0s-.59 1.54 0 2.12L18.13 14l-9.44 9.44a1.49 1.49 0 0 0 0 2.12c.29.29.68.44 1.06.44s.77-.15 1.06-.44l10.5-10.5c.59-.59.59-1.54 0-2.12Z"/></svg>',
                    12: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="m21.56 12.09-9.29-9.3c-1.05-1.05-2.77-1.05-3.83 0s-1.05 2.77 0 3.83L15.82 14l-7.38 7.38a2.722 2.722 0 0 0 0 3.83c.51.51 1.19.79 1.91.79s1.4-.28 1.91-.79l9.29-9.29a2.722 2.722 0 0 0 0-3.83Zm-1.06 2.76-9.29 9.29c-.46.46-1.25.46-1.71 0-.47-.47-.47-1.24 0-1.71l7.91-7.91c.29-.29.29-.77 0-1.06L9.5 5.55c-.47-.47-.47-1.24 0-1.71.24-.24.54-.35.85-.35s.62.12.85.35l9.29 9.29c.47.47.47 1.24 0 1.71Z"/></svg>',
                    13: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="M26 14v-.01l-1.87-1.87L17 5h-5.3l7.12 7.12H2v3.76h16.82L11.7 23H17l6.35-6.35.77-.77L26 14z"/></svg>',
                    14: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="M24.53 14v-.01L12.53 2H5.46l12.01 12-12 12h7.06L21 17.53 24.54 14h-.01z"/></svg>',
                    15: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="m16.8 14-9-9H2.5l9 9-9 9h5.3l6.35-6.35L16.8 14z" class="cls-1"/><path d="m26 14-9-9h-5.3l9 9-9 9H17l6.35-6.35L26 14z"/></svg>',
                    16: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="M25.96 14.19c.08-.19.05-.41-.11-.56-.01-.01-.03-.01-.04-.02L15.25 3.04c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l9.75 9.75H2.5c-.28 0-.5.22-.5.5s.22.5.5.5h21.79l-9.75 9.75c-.19.19-.19.5 0 .69.19.2.51.2.71.01l10.61-10.61.01-.01c.03-.04.06-.08.08-.12 0 0 .01-.02.02-.03Z"/></svg>',
                    17: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="m19.1 10.1-.7.71L23.59 16H2v1h24l-6.9-6.9z"/></svg>',
                    18: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="M21.74 12.69 10.68 2.48c-1.14-1.06-3-.24-3 1.31v20.42c0 1.56 1.85 2.37 3 1.31l11.06-10.21c.77-.71.77-1.92 0-2.63Z"/>',
                    19: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="M8.5 2v24l13-12-13-12z"/></svg>',
                    20: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="M14 2C7.37 2 2 7.37 2 14s5.37 12 12 12 12-5.37 12-12S20.63 2 14 2Zm-2.25 18V8l6.5 6-6.5 6Z"/></svg>',
                    21: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="M2 2v24h24V2H2Zm9.75 18V8l6.5 6-6.5 6Z"/></svg>',
                    22: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="m26 14-9-8v7H2v2h15v7l9-8z"/></svg>',
                    23: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="M14 3c6.07 0 11 4.93 11 11s-4.93 11-11 11S3 20.07 3 14 7.93 3 14 3m0-1C7.37 2 2 7.37 2 14s5.37 12 12 12 12-5.37 12-12S20.63 2 14 2Z"/><path d="m18.25 14-6.5-6v12l6.5-6z"/></svg>',
                    24: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="M25 3v22H3V3h22m1-1H2v24h24V2Z"/><path d="m18.25 14-6.5-6v12l6.5-6z"/></svg>',
                    25: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="M24.59 12.75 21.5 10 17 6v4H2v8h15v4l4.5-4 3.09-2.75L26 14l-1.41-1.25z"/></svg>',
                    26: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="m18.25 14-6.5-6v12l6.5-6zM14 2H13.55l-.41.06.16.99c.6-.1 1.21-.15 1.83-.15v-1Zm-4.3.79c-.63.24-1.23.53-1.8.87l.51.86c.53-.31 1.08-.58 1.65-.8l-.36-.93ZM5.97 5.08c-.34.3-.66.63-.96.96s-.02.02-.03.03 0 .01-.01.02l-.01.01s-.02.02-.02.03c-.06.07-.12.15-.18.22l.78.62c.38-.48.8-.93 1.25-1.34l-.67-.74ZM3.3 8.55v.04c-.13.26-.24.52-.35.78 0 .01 0 .02-.01.03s0 .02-.01.03v.06s0 .02-.01.03c0 .01 0 .02-.01.04-.06.16-.11.33-.17.49l.95.3c.18-.58.42-1.15.69-1.69l-.89-.45Zm-1.24 4.2c0 .05-.01.1-.01.15V13.11c0 .13-.01.25-.02.38s0 .01 0 .01v.05c0 .09 0 .18.01.26l1-.06c-.01-.23-.02-.46-.02-.69 0-.38.02-.77.06-1.15l-.99-.1Zm1.31 4.1-.97.26.09.32s0 .02.01.04v.04c0 .01 0 .02.01.03.1.32.22.63.34.93 0 0 0 .02.01.02v.02c0 .01.01.02.02.03s.03.07.04.1l.91-.42c-.25-.55-.46-1.13-.62-1.72Zm1.73 3.62-.81.59c.39.54.83 1.05 1.31 1.51l.7-.71c-.44-.43-.84-.89-1.2-1.39Zm2.92 2.76-.54.84c.11.07.23.14.34.21 0 0 .02 0 .02.01 0 0 .02 0 .02.01.01 0 .02.01.03.02.38.21.76.41 1.16.58l.4-.92c-.56-.24-1.1-.53-1.61-.87Zm3.7 1.53-.21.98c.64.14 1.31.22 1.98.25l.04-1c-.61-.03-1.22-.1-1.82-.23Zm5.79-.33c-.58.19-1.17.34-1.78.44l.16.99c.13-.02.26-.04.38-.07h.05c.41-.09.82-.19 1.22-.32h.04c.01 0 .02 0 .03-.01l-.32-.95Zm3.5-1.95c-.47.39-.98.74-1.5 1.05l.5.87s.05-.03.07-.04c0 0 .02 0 .03-.01h.02c.5-.3.97-.64 1.41-1.01l-.64-.77Zm2.58-3.08c-.3.53-.65 1.04-1.03 1.51l.78.63c.12-.14.23-.29.34-.44s.01-.02.02-.03c0 0 0-.01.01-.02l.01-.01s0-.01.01-.02l.02-.02s.01-.02.02-.03c0 0 .01-.02.02-.03 0-.01.02-.02.02-.04 0-.01.02-.02.02-.04s.02-.03.02-.04c0-.01.02-.03.02-.04 0-.01.01-.02.02-.03 0 0 0-.01.01-.02v-.03c0-.01.01-.02.02-.03.05-.08.1-.16.14-.24l-.87-.49Zm1.29-3.8c-.09.6-.23 1.2-.42 1.78l.95.31c.2-.63.36-1.28.45-1.95l-.99-.14Zm.83-4.22-.98.22c.13.59.22 1.2.25 1.81l1-.05c-.04-.68-.13-1.34-.27-1.98Zm-1.72-4.03-.83.55c.34.51.64 1.05.89 1.6l.91-.41c-.27-.61-.6-1.2-.97-1.75Zm-3.04-3.14-.58.82c.5.35.97.75 1.4 1.18l.71-.71-.01-.01-.02-.02-.03-.03c-.01-.01-.03-.02-.04-.04-.27-.25-.56-.49-.85-.72 0 0-.02-.01-.03-.02l-.01-.01s-.01 0-.02-.01-.02-.02-.03-.02l-.11-.08Zm-3.97-1.84-.25.97c.59.15 1.17.35 1.73.6l.41-.91c-.6-.27-1.24-.49-1.89-.65ZM14 2v1c.19 0 .37 0 .56.01l.05-1h-.42Z"/></svg>',
                    27: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="M6.06 2 4.65 3.41 15.23 14 4.65 24.59 6.06 26l12-12-12-12z"/><path d="m14.06 2-1.41 1.41L23.23 14 12.65 24.59 14.06 26l12-12-12-12z"/></svg>',
                }
                break;
            case 52:
                break;

            case 76:
                navObj = {
                    1:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="76" height="76"><path d="m21.06 2-1.41 1.41L54.23 38 19.65 72.59 21.06 74l36-36-36-36z"/></svg>',
                    2:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="76" height="76"><path d="M38 2C18.12 2 2 18.12 2 38s16.12 36 36 36 36-16.12 36-36S57.88 2 38 2Zm-5.36 54-.85-.85L48.94 38 31.79 20.85l.85-.85 18 18-18 18Z"/></svg>',
                    3:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="76" height="76"><path d="M2 2v72h72V2H2Zm30.64 54-.85-.85L48.94 38 31.79 20.85l.85-.85 18 18-18 18Z"/></svg>',
                    4:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="76" height="76"><path d="m74 38-.04-.04-21.17-21.17-1.42 1.41L70.17 37H2v2h68.17L51.38 57.8l1.41 1.41 19.79-19.8h.01L74 38z"/></svg>',
                    5:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="76" height="76"><path d="M38 3c19.3 0 35 15.7 35 35S57.3 73 38 73 3 57.3 3 38 18.7 3 38 3m0-1C18.12 2 2 18.12 2 38s16.12 36 36 36 36-16.12 36-36S57.88 2 38 2Z"/><path d="m32.64 56-.85-.85L48.94 38 31.79 20.85l.85-.85 18 18-18 18z"/></svg>',
                    6:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="76" height="76"><path d="M74.5 74.5h-73v-73h73v73Zm-72-1h71v-71h-71v71Z"/><path d="m32.64 56-.85-.85L48.94 38 31.79 20.85l.85-.85 18 18-18 18z"/></svg>',
                    7:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="76" height="76"><path d="M73.99 38c0-.05 0-.1-.02-.15 0-.03 0-.06-.01-.09 0-.02-.02-.03-.03-.05-.02-.05-.05-.09-.08-.13-.03-.04-.05-.08-.08-.11a.444.444 0 0 0-.11-.08c-.04-.03-.08-.06-.13-.08-.02 0-.03-.02-.05-.03-16.39-5.46-17.91-18.73-17.96-19.3a.75.75 0 0 0-1.49.15c.01.14 1.41 12.65 15.32 19.11H2.75c-.41 0-.75.34-.75.75s.34.75.75.75h66.6c-13.91 6.46-15.3 18.97-15.32 19.11-.04.41.26.78.67.82h.07c.38 0 .71-.29.75-.68.06-.56 1.57-13.83 17.96-19.3 0 0 .01 0 .02-.01a.72.72 0 0 0 .21-.12l.06-.06c.04-.04.08-.09.11-.14.02-.03.03-.06.04-.09 0-.02.02-.03.03-.06 0-.03 0-.06.01-.09.01-.05.02-.1.02-.15Z"/></svg>',
                    8:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="76" height="76"><path d="m3.19 34.35-.99-.1c0 .07-.01.14-.02.21V34.6c-.05.52-.08 1.04-.11 1.56l1 .05c.03-.65.08-1.3.15-1.94ZM3.01 38.63l-1 .02c.01.67.04 1.34.09 2l1-.07c-.05-.64-.08-1.3-.09-1.94ZM3.89 30.14l-.97-.22-.09.41V30.46c-.07.34-.14.69-.2 1.03s0 0 0 .01v.01c0 .03 0 .05-.01.08v.09l.99.17c.11-.64.24-1.28.38-1.91ZM11.69 62.57l.04.04v.02s.01.02.02.02 0 0 .01.01v.02c.09.09.18.19.27.28s.04.04.05.06v.01s.04.04.05.06 0 .01 0 .01l.02.02v.02l.01.01v.04s0 .01.01.02 0 0 0 .01v.03l.03.03.04.04v.01l.05.05.05.05c.01.01.02.02.04.03l.02.02v.01s.01.02.02.02l.69-.72c-.47-.45-.93-.91-1.37-1.38l-.73.68ZM6.8 22.12l-.89-.45c-.08.16-.17.33-.25.5v.03c0 .01-.01.02-.02.03v.04c0 .02-.02.04-.03.06s0 0 0 .01v.02l-.03.06v.02s-.03.06-.04.09 0 0 0 .01v.01c0 .02-.02.04-.03.06s0 0 0 .01v.02s-.01.03-.02.04 0 0 0 .01v.04s-.01.03-.02.05v.02c-.06.14-.13.28-.19.42l.91.4c.26-.59.54-1.18.83-1.76ZM5.1 26.04l-.94-.34c-.16.43-.3.86-.44 1.3s0 .01 0 .01v.04s0 .03-.01.04 0 .01 0 .01v.03c0 .02-.01.03-.02.05v.02c-.02.08-.05.16-.07.23l.96.29c.19-.62.39-1.24.61-1.84ZM9.55 15.93l.79.61c.4-.51.81-1.01 1.23-1.5l-.75-.66c-.44.5-.86 1.02-1.27 1.54ZM8.89 59.18c.37.5.74.99 1.13 1.47s0 0 0 .01v.01s.01.02.02.02v.01l.77-.63c-.41-.5-.81-1.02-1.19-1.54l-.81.59ZM6.52 55.47c.32.58.66 1.16 1.02 1.72l.85-.53c-.34-.55-.68-1.11-.99-1.67l-.87.49ZM4.19 47.08l-.97.26c.07.28.15.55.23.82v.09c.09.31.19.62.29.92l.95-.31c-.2-.61-.39-1.24-.56-1.86ZM4.62 51.51c.13.31.26.62.39.92s0 0 0 .01v.02c.11.25.23.5.34.75l.9-.43c-.28-.58-.54-1.18-.78-1.78l-.93.38ZM3.34 42.89l-.99.14c.04.28.08.55.13.83s0 0 0 .01c.06.38.13.75.2 1.13l.98-.19c-.12-.63-.23-1.28-.32-1.92ZM8.97 18.44l-.83-.56c-.1.14-.19.28-.28.42 0 0 0 .01-.01.02s0 0 0 .01v.01s-.01.02-.02.03v.04s-.01.02-.02.03 0 0 0 .01v.03s-.02.03-.02.04v.03c-.01.02-.02.03-.03.05v.03s-.02.04-.03.05v.02s-.03.04-.04.07c-.12.19-.23.37-.34.56l.86.51c.33-.55.68-1.11 1.04-1.64ZM66.34 15.79v-.02c0-.01-.02-.02-.03-.04s0 0 0-.01v-.02s-.01-.02-.02-.02 0 0 0-.01v-.01s-.01-.02-.02-.03v-.05s-.01-.02-.02-.02V15.5s-.01-.02-.02-.02c0 0-.02-.02-.02-.03v-.01c-.01-.01-.02-.03-.03-.04s-.03-.03-.04-.05c-.02-.02-.03-.04-.05-.06-.1-.12-.21-.25-.32-.37s-.03-.04-.05-.06c-.01-.02-.03-.03-.04-.05l-.75.66c.43.48.84.99 1.24 1.5l.79-.62ZM70.87 23.31c-.16-.37-.33-.73-.51-1.08v-.03c0-.01-.01-.02-.02-.03s0-.01 0-.01v-.01s0-.02-.01-.03 0 0 0-.01v-.02c-.08-.17-.17-.33-.25-.5l-.89.46c.3.57.58 1.16.84 1.75l.91-.41ZM68.84 19.41c-.2-.33-.4-.65-.61-.97s-.03-.05-.05-.08-.03-.05-.05-.08v-.01c-.01-.02-.02-.04-.04-.05v-.01c0-.02-.02-.03-.03-.04v-.02l-.03-.04c-.01-.02-.02-.03-.03-.04v-.01s-.02-.04-.04-.06v-.01c-.01-.02-.03-.04-.04-.06v-.01c0-.01-.01-.02-.02-.03l-.83.56c.36.53.72 1.08 1.05 1.64l.86-.52ZM71.46 27.72l.96-.29c-.1-.31-.19-.62-.3-.92s-.02-.06-.03-.09v-.02s-.02-.05-.02-.07v-.03s-.01-.04-.02-.06 0 0 0-.01v-.03s-.01-.04-.02-.06 0 0 0-.01v-.01c-.06-.18-.13-.35-.19-.53l-.94.35c.22.61.43 1.22.62 1.84ZM72.95 36.12l1-.05c-.01-.28-.03-.56-.05-.84s0-.08 0-.11V34.57l-.99.11c.07.64.12 1.29.16 1.94ZM72.47 31.87l.98-.17c-.12-.66-.25-1.31-.4-1.96l-.97.23c.15.63.28 1.27.39 1.9ZM38 3c.59 0 1.18.01 1.77.04l.05-1c-.45-.02-.91-.04-1.36-.04H37.85c-.24 0-.48.01-.72.02H36.99c-.11 0-.22.01-.33.02l.05 1c.64-.04 1.3-.05 1.94-.05ZM33.73 3.26l-.12-.99c-.26.03-.51.07-.77.1H32.6s-.05 0-.08.01 0 0-.01 0h-.03c-.2.03-.39.06-.58.1l.18.98c.63-.11 1.28-.21 1.92-.29ZM52.59 5.08s-.02 0-.02-.01h-.03c-.59-.26-1.18-.5-1.79-.73l-.35.94c.6.23 1.21.48 1.8.74l.41-.91ZM25.45 5.32l-.36-.93c-.18.07-.37.14-.55.22-.03.01-.06.02-.09.04h-.07s-.02 0-.03.01h-.04c-.02 0-.04.02-.06.02h-.02s-.06.02-.09.04h-.02s-.05.02-.07.03 0 0-.01 0h-.01c-.02.01-.05.02-.07.03h-.04s-.02 0-.03.01h-.02c-.02 0-.03.01-.05.02h-.03c-.05.02-.1.04-.15.07l.41.91c.59-.26 1.19-.52 1.79-.75ZM29.53 4.03l-.24-.97c-.33.08-.67.17-1 .26h-.04s-.03 0-.04.01 0 0-.01 0h-.04s-.04.01-.06.02h-.02c-.18.05-.36.11-.55.16l.3.96c.62-.19 1.25-.37 1.87-.52ZM48.47 3.55c-.26-.08-.52-.16-.79-.23h-.03c-.02 0-.04-.01-.06-.02h-.05c-.01 0-.02 0-.04-.01H47.38c-.01 0-.03 0-.04-.01s0 0-.01 0h-.04s-.03 0-.04-.01 0 0-.01 0h-.04s-.03 0-.05-.01 0 0-.01 0h-.04s-.03 0-.05-.01 0 0-.01 0H47l-.24.97c.63.15 1.26.32 1.87.51l.29-.96ZM44.19 2.53h-.05c-.02 0-.04 0-.07-.01h-.02c-.57-.1-1.15-.18-1.74-.25h-.02l-.12.99c.64.07 1.29.17 1.92.28l.17-.99ZM26.3 72.06c.08.03.15.05.23.08h.02c.02 0 .03.01.05.02h.08c.11.04.22.07.33.11s0 0 .01 0c.02 0 .05.02.07.02h.08c.01 0 .03 0 .04.01h.03c.25.08.5.15.76.22l.27-.96c-.62-.17-1.25-.37-1.86-.58l-.32.95ZM59.09 65.93l.6.8h.01v-.01h.02l.02-.02h.02c.01 0 .02-.02.04-.03s0 0 .01 0h.02s.05-.04.07-.06c.39-.31.78-.62 1.16-.95l-.65-.76c-.49.42-1 .83-1.52 1.22ZM65.23 59.99l.78.63V60.43s.01-.02.02-.02v-.03s.01-.02.02-.02c0 0 .01-.02.02-.02s0 0 0-.01v-.01s.01-.02.02-.02 0 0 0-.01v-.01s.02-.03.03-.04 0 0 0-.01v-.01c0-.01.02-.02.03-.04s0 0 0-.01v-.01s.01-.02.02-.03 0 0 0-.01-.81-.59-.81-.59c-.38.52-.77 1.04-1.18 1.55ZM62.34 63.15l.7.72c.31-.3.61-.6.9-.91s0 0 0-.01.01-.02.02-.02c0 0 .02-.02.02-.03.12-.12.23-.25.35-.37l-.73-.68c-.44.47-.9.94-1.36 1.39ZM63.42 12.5l-.21-.21v-.02l-.01-.01c-.37-.36-.75-.72-1.14-1.06l-.67.75c.48.43.96.88 1.41 1.33l.71-.71ZM56.49 7.11c-.16-.1-.33-.19-.49-.29h-.01l-.06-.03h-.01c-.02 0-.03-.02-.05-.03l-.06-.03h-.01l-.06-.03h-.02c-.02-.01-.05-.03-.07-.04h-.01c-.26-.15-.52-.29-.79-.43l-.47.88c.57.3 1.14.62 1.69.95l.51-.86ZM60.12 9.59h-.01c-.3-.24-.61-.47-.92-.69s0 0-.01 0c0 0-.02-.01-.03-.02-.17-.12-.34-.25-.52-.37l-.57.82c.53.37 1.06.76 1.57 1.15l.61-.79ZM55.53 68.3l.5.87c.43-.25.86-.51 1.28-.78s0 0 .01 0 .04-.03.07-.04 0 0 .01 0h.02s.03-.02.04-.03h.02s.02-.01.03-.02c.02-.01.03-.02.05-.03l-.55-.84c-.54.35-1.1.7-1.65 1.02ZM67.71 56.51l.85.53c.05-.08.1-.17.16-.25v-.03s.01-.02.02-.03v-.04s.01-.02.02-.03 0 0 0-.01V56.55s.01-.02.02-.03 0 0 0-.01v-.02s.02-.03.02-.04v-.03c.12-.21.24-.43.36-.64l-.88-.48c-.31.57-.64 1.13-.98 1.68ZM73 38.45c0 .65-.03 1.3-.08 1.94l1 .07c0-.11.01-.23.02-.34s0-.01 0-.01v-.02c.03-.46.04-.92.05-1.38s0 0 0-.01v-.04h-1ZM72.37 44.64l.98.19V44.7l.09-.51v-.04c0-.02 0-.05.01-.07V43.97c.05-.3.09-.6.13-.9l-.99-.13c-.09.64-.19 1.29-.31 1.92ZM71.31 48.78l.95.31c.09-.28.18-.57.26-.86s0 0 0-.01c0-.03.02-.05.02-.08v-.03c0-.01 0-.02.01-.03V48c0-.02 0-.03.01-.05v-.03l.09-.34-.97-.25c-.16.62-.35 1.25-.55 1.87ZM69.75 52.76l.91.42.03-.06v-.07c.16-.35.32-.7.46-1.06s0 0 0-.01v-.03s.01-.03.02-.04v-.18l-.93-.37c-.24.6-.5 1.2-.77 1.78ZM16.7 8.97s-.02.01-.02.02h-.01c-.28.21-.57.43-.84.64l.62.79c.51-.4 1.03-.79 1.56-1.16l-.57-.82c-.22.15-.43.31-.65.46ZM20.23 6.68h-.01c-.02.01-.04.02-.05.03s0 0-.01 0h-.03s-.03.02-.04.02h-.02s-.02.01-.03.02c0 0-.01 0-.02.01s-.01 0-.02.01h-.02s-.03.02-.04.02h-.02s-.04.02-.05.03l.52.85c.55-.33 1.12-.66 1.69-.96l-.47-.88c-.29.15-.58.31-.86.48ZM30.54 73.23l.27.06h.09c.49.1.99.18 1.49.26l.15-.99c-.64-.1-1.28-.21-1.91-.35l-.21.98ZM18.41 68.21l.57.36h.01c.02.01.03.02.05.03s0 0 .01 0h.03s.02.01.03.02h.03s.02.01.03.02c.01 0 .02.01.03.02l.06.03h.02c.14.08.28.16.41.24l.5-.87c-.56-.32-1.12-.66-1.66-1.01l-.54.84ZM14.88 65.59c.2.16.39.33.59.49s0 0 .01 0h.02s.02.02.04.03h.01c.01.01.03.02.04.03.24.19.47.37.71.55l.6-.8c-.52-.39-1.03-.79-1.52-1.21l-.64.77ZM13.29 11.82l-.01.01-.01.01-.03.03-.01.01s-.01.02-.02.02 0 0 0 .01h-.01l-.02.02c-.02.01-.03.03-.05.05-.15.15-.31.3-.46.46l.71.7c.45-.46.93-.91 1.41-1.34l-.67-.74c-.21.19-.42.38-.62.57ZM22.24 70.38c.09.04.18.09.27.13H22.57c.02 0 .03.01.05.02h.03c.44.2.88.4 1.32.59l.39-.92c-.59-.25-1.19-.52-1.77-.8l-.44.9ZM34.89 73.87l.74.06H36.58l.03-1c-.65-.02-1.3-.06-1.94-.11l-.09 1ZM47.68 71.64l.28.96.41-.12H48.43c.02 0 .03-.01.05-.02h.03c.42-.13.83-.26 1.24-.41l-.33-.94c-.61.21-1.23.41-1.85.59ZM51.71 70.21l.39.92c.2-.09.4-.17.6-.26s0 0 .01 0h.04c.35-.16.71-.33 1.05-.5l-.44-.9c-.58.29-1.17.56-1.77.81ZM43.51 72.57l.16.99c.19-.03.39-.06.58-.1s0 0 .01 0h.01c.03 0 .05 0 .08-.01H44.48s.04 0 .06-.01 0 0 .01 0h.03c.27-.05.53-.11.79-.16l-.21-.98c-.63.14-1.27.26-1.91.36ZM39.25 72.98l.04 1c.15 0 .29-.01.44-.02s0 0 .01 0H39.96l.89-.06h.18l-.09-1c-.64.06-1.29.1-1.94.12ZM41.9 27.31 52.09 37.5H22v1h30.09L41.9 48.69l.7.71L54 38 42.6 26.6l-.7.71z"/></svg>',
                    9:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="76" height="76"><path d="m30.85 2-.9.43L47.04 38 29.95 73.57l.9.43 17.3-36-17.3-36z"/></svg>',
                    10: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="76" height="76"><path d="M74 38c0-.19-.04-.38-.11-.55-.09-.22-.23-.41-.4-.57L53.02 16.41c-.57-.57-1.5-.57-2.08 0l-.04.04c-.57.57-.57 1.5 0 2.08L68.87 36.5H3.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h65.37L50.9 57.47c-.57.57-.57 1.5 0 2.08l.04.04c.57.57 1.5.57 2.08 0l20.47-20.47c.18-.15.32-.35.41-.57.07-.17.11-.35.11-.55Z"/></svg>',
                    11: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="76" height="76"><path d="m56.31 36.94-34.5-34.5c-.59-.59-1.54-.59-2.12 0s-.59 1.54 0 2.12L53.13 38 19.69 71.44a1.49 1.49 0 0 0 0 2.12c.29.29.68.44 1.06.44s.77-.15 1.06-.44l34.5-34.5c.59-.59.59-1.54 0-2.12Z"/></svg>',
                    12: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="76" height="76"><path d="M58.01 34.54 26.91 3.43C25.99 2.51 24.76 2 23.45 2s-2.54.51-3.46 1.43c-.92.92-1.43 2.15-1.43 3.46s.51 2.54 1.43 3.46l27.64 27.64-27.64 27.64c-.92.92-1.43 2.15-1.43 3.46s.51 2.54 1.43 3.46c.92.92 2.15 1.43 3.46 1.43s2.54-.51 3.46-1.43l31.1-31.1c.92-.92 1.43-2.15 1.43-3.46s-.51-2.54-1.43-3.46Zm-1.06 5.86-31.1 31.1c-1.28 1.28-3.52 1.28-4.8 0-.64-.64-1-1.49-1-2.4s.35-1.76 1-2.4l28.17-28.17c.29-.29.29-.77 0-1.06L21.05 9.3c-.64-.64-1-1.49-1-2.4s.35-1.76 1-2.4 1.49-1 2.4-1 1.76.35 2.4 1l31.1 31.1c.64.64 1 1.49 1 2.4s-.35 1.76-1 2.4Z"/></svg>',
                    13: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="76" height="76"><path d="m74 38-.01-.02L68 32 47 11H31.09l21 21H2v12h50.09l-21 21H47l19.05-19.05L68 44l6-6z"/></svg>',
                    14: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="76" height="76"><path d="m67.6 38-.01-.02L31.6 2H10.39L46.4 38l-36 36h21.2L57 48.6 67.61 38h-.01z"/></svg>',
                    15: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="76" height="76"><path d="m46.5 38-.02-.01L18.5 10H2l28 28L2 66h16.5l19.75-19.75L46.5 38z"/><path d="M73.99 37.99 46 10H29.5l28 28-28 28H46l19.75-19.75L74 38l-.01-.01z"/></svg>',
                    16: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="76" height="76"><path d="M74 38c0-.07-.01-.13-.04-.19 0-.02-.02-.03-.03-.05a.284.284 0 0 0-.08-.11L39.56 3.35c-.2-.2-.51-.2-.71 0s-.2.51 0 .71L72.3 37.51H2.5c-.28 0-.5.22-.5.5s.22.5.5.5h69.79L38.85 71.95c-.2.2-.2.51 0 .71a.485.485 0 0 0 .7 0l34.29-34.29s.09-.11.12-.17c.02-.04.02-.09.03-.13 0-.02.01-.04.01-.06Z"/></svg>',
                    17: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="76" height="76"><path d="m54.38 28.38-.71.7L71.59 47H2v1h72L54.38 28.38z"/></svg>',
                    18: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="76" height="76"><path d="M59.23 34.06 26.04 3.43c-3.43-3.17-8.99-.73-8.99 3.94v61.26c0 4.67 5.56 7.11 8.99 3.94l33.18-30.63c2.3-2.12 2.3-5.75 0-7.88Z"/></svg>',
                    19: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="76" height="76"><path d="M19.5 2v72l39-36-39-36z"/></svg>',
                    20: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="76" height="76"><path d="M38 2C18.12 2 2 18.12 2 38s16.12 36 36 36 36-16.12 36-36S57.88 2 38 2Zm-7 54V20l20 18-20 18Z"/></svg>',
                    21: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="76" height="76"><path d="M2 2v72h72V2H2Zm29 54V20l20 18-20 18Z"/></svg>',
                    22: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="76" height="76"><path d="M74 38 48 13v24H2v2h46v24l26-25z"/></svg>',
                    23: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="76" height="76"><path d="M38 3c19.3 0 35 15.7 35 35S57.3 73 38 73 3 57.3 3 38 18.7 3 38 3m0-1C18.12 2 2 18.12 2 38s16.12 36 36 36 36-16.12 36-36S57.88 2 38 2Z"/><path d="M51 38 31 20v36l20-18z"/></svg>',
                    24: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="76" height="76"><path d="M73 3v70H3V3h70m1-1H2v72h72V2Z"/><path d="M51 38 31 20v36l20-18z"/></svg>',
                    25: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="76" height="76"><path d="M69.76 33.93 62.56 27 48 13v14H2v22h46v14l14.56-14 7.2-6.93L74 38l-4.24-4.07z"/></svg>',
                    26: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="76" height="76"><path d="M51 38 31 20v36l20-18zM38 2H37.66c-.24 0-.48.01-.72.02H36.8c-.11 0-.22.01-.33.02l.05 1c.64-.04 1.3-.05 1.94-.05v-1Zm-4.39.26c-.26.03-.51.07-.77.1H32.6s-.05 0-.08.01 0 0-.01 0h-.02c-.2.03-.39.06-.58.1l.18.98c.63-.11 1.28-.21 1.92-.29l-.12-.99Zm-4.32.8c-.33.08-.67.17-1 .26h-.04s-.03 0-.04.01 0 0-.01 0h-.03c-.02 0-.04.01-.06.02h-.02c-.18.05-.36.11-.55.16l.3.96c.62-.19 1.25-.37 1.87-.52l-.24-.97Zm-4.2 1.32c-.18.07-.37.14-.55.22s-.06.02-.09.04h-.07s-.02 0-.03.01h-.04c-.02 0-.04.02-.06.02h-.02s-.06.02-.09.04h-.02s-.05.02-.07.03 0 0-.01 0h-.01c-.02.01-.05.02-.07.03h-.04s-.02 0-.03.01h-.02c-.02 0-.03.01-.05.02h-.03c-.05.02-.1.04-.15.07l.41.91c.59-.26 1.19-.52 1.79-.75l-.36-.93Zm-4 1.83c-.29.15-.58.31-.86.48s0 0-.01 0c-.02.01-.04.02-.05.03s0 0-.01 0h-.03s-.03.02-.04.02h-.02s-.02.01-.03.02c0 0-.01 0-.02.01 0 0-.01 0-.02.01h-.02s-.03.02-.04.02h-.02s-.04.02-.05.03l.52.85c.55-.33 1.12-.66 1.69-.96l-.47-.88Zm-3.75 2.3c-.22.15-.43.31-.64.46 0 0-.02.01-.02.02h-.01c-.28.21-.57.43-.84.64l.62.79c.51-.4 1.03-.79 1.56-1.16l-.57-.82Zm-3.43 2.74c-.21.19-.42.38-.62.57s0 0-.01.01l-.01.01-.03.03-.01.01s-.01.02-.02.02h-.01l-.02.02c-.02.01-.03.03-.05.05-.15.15-.31.3-.46.46l.71.7c.45-.46.93-.91 1.41-1.34l-.67-.74Zm-3.09 3.14c-.44.5-.86 1.02-1.27 1.54l.79.61c.4-.51.81-1.01 1.23-1.5l-.75-.66Zm-2.67 3.49c-.1.14-.19.28-.28.42 0 0 0 .01-.01.02v.01s-.01.02-.02.03v.03s-.01.02-.02.03 0 0 0 .01v.03s-.02.03-.02.04v.03c-.01.02-.02.03-.03.05v.03s-.02.04-.03.05 0 .01 0 .01v.01s-.03.04-.04.07c-.12.19-.23.37-.34.56l.86.51c.33-.55.68-1.11 1.04-1.64l-.83-.56Zm-2.24 3.78c-.08.16-.17.33-.25.5v.03c0 .01-.01.02-.02.03v.04c0 .02-.02.04-.03.06s0 0 0 .01v.02l-.03.06v.02s-.03.06-.04.09 0 0 0 .01v.01l-.03.06v.03s-.01.03-.02.04 0 0 0 .01v.04c0 .02-.01.03-.02.05v.02c-.06.14-.13.28-.19.42l.91.4c.26-.59.54-1.18.83-1.76l-.89-.45ZM4.16 25.7c-.16.43-.3.86-.44 1.3s0 .01 0 .01v.04s0 .03-.01.04 0 .01 0 .01v.03c0 .02-.01.03-.02.05v.02c-.02.08-.05.16-.07.23l.96.29c.19-.62.39-1.24.61-1.84l-.94-.34Zm-1.25 4.21-.09.41V30.43c-.07.34-.14.69-.2 1.03s0 0 0 .01v.01c0 .03 0 .05-.01.08v.07l.99.17c.11-.64.24-1.28.38-1.91l-.97-.22Zm-.72 4.34c0 .07-.01.14-.02.21v.14c-.05.52-.08 1.04-.11 1.56l1 .05c.03-.65.08-1.3.15-1.94l-.99-.1Zm.82 4.38-1 .02c.01.67.04 1.34.09 2l1-.07c-.05-.64-.08-1.3-.09-1.94Zm.33 4.26-.99.14c.04.28.08.55.13.83s0 0 0 .01c.06.38.13.75.2 1.13l.98-.19c-.12-.63-.23-1.28-.32-1.92Zm.85 4.19-.97.26c.07.28.15.55.23.82v.09c.09.31.19.62.29.92l.95-.31c-.2-.61-.39-1.24-.56-1.86Zm1.36 4.05-.93.38c.13.31.26.62.39.92s0 0 0 .01v.02c.11.25.23.5.34.75l.9-.43c-.28-.58-.54-1.18-.78-1.78Zm1.84 3.86-.87.49c.32.58.66 1.16 1.02 1.72l.85-.53c-.34-.55-.68-1.11-.99-1.67Zm2.3 3.6-.81.59c.37.5.74.99 1.13 1.47s0 0 0 .01v.01s.01.02.02.02v.02l.77-.63c-.41-.5-.81-1.02-1.19-1.54Zm2.73 3.3-.73.68.04.04v.02s.01.02.02.02 0 0 .01.01v.02c.09.09.18.19.27.28s.04.04.05.06v.01s.04.04.05.06.01.02.02.02l.01.01.01.01.03.03.04.04.05.05c.02.01.03.03.05.04.01.01.02.02.04.03l.02.02v.01s.01.02.02.02l.69-.72c-.47-.45-.93-.91-1.37-1.38Zm3.1 2.94-.64.77c.2.16.39.33.59.49s0 0 .01 0h.02s.02.02.04.03h.01c.01.01.03.02.04.03.24.19.47.37.71.55l.6-.8c-.52-.39-1.03-.79-1.52-1.21Zm3.44 2.54-.54.84.57.36H19c.02.01.03.02.05.03s0 0 .01 0h.03s.02.01.03.02h.03s.02.01.03.02c.01 0 .02.01.03.02l.06.03h.02c.14.08.28.16.41.24l.5-.87c-.56-.32-1.12-.66-1.66-1.01Zm3.72 2.11-.44.9c.09.04.18.09.27.13H22.57c.02 0 .03.01.05.02h.03c.44.2.88.4 1.32.59l.39-.92c-.59-.25-1.19-.52-1.77-.8Zm3.95 1.63-.32.95c.08.03.15.05.23.08s0 0 .01 0h.01c.02 0 .03.01.05.02h.08c.11.04.22.07.33.11s0 0 .01 0c.02 0 .05.02.07.02h.08c.01 0 .03 0 .04.01h.03c.25.08.5.15.76.22l.27-.96c-.62-.18-1.25-.37-1.86-.58Zm4.12 1.14-.21.98.27.06h.09c.49.1.99.18 1.49.26l.15-.99c-.64-.1-1.28-.21-1.91-.35Zm4.23.62-.09 1 .74.06H36.58l.03-1c-.65-.02-1.3-.06-1.94-.11Zm6.22-.01c-.64.06-1.29.1-1.94.12l.04 1c.15 0 .29-.01.44-.02s0 0 .01 0h.21l.89-.06h.18l-.09-1Zm4.22-.65c-.63.14-1.27.26-1.91.36l.16.99c.19-.03.39-.06.58-.1s0 0 .01 0h.01c.03 0 .05 0 .08-.01H44.48s.04 0 .06-.01 0 0 .01 0h.03c.27-.05.53-.11.79-.16l-.21-.98Zm4.12-1.16c-.61.21-1.23.41-1.85.59l.28.96.41-.12H48.44c.02 0 .03-.01.05-.02h.03c.42-.13.83-.26 1.24-.41l-.33-.94Zm3.94-1.65c-.58.29-1.17.56-1.77.81l.39.92c.2-.09.4-.17.6-.26s0 0 .01 0h.04c.35-.16.71-.33 1.05-.5l-.44-.9Zm3.71-2.12c-.54.35-1.1.7-1.65 1.02l.5.87c.43-.25.86-.51 1.28-.78s0 0 .01 0 .04-.03.07-.04 0 0 .01 0h.02s.03-.02.04-.03h.02s.02-.01.03-.02c.02-.01.03-.02.05-.03l-.55-.84Zm3.42-2.56c-.49.42-1 .83-1.52 1.22l.6.8h.03s.02-.01.02-.02h.02c.01 0 .02-.02.04-.03s0 0 .01 0h.02s.05-.04.07-.06c.39-.31.78-.62 1.16-.95l-.65-.76Zm3.09-2.96c-.44.47-.9.94-1.36 1.39l.7.72c.31-.3.61-.6.9-.91s0 0 0-.01.01-.02.02-.02c0 0 .02-.02.02-.03.12-.12.23-.25.35-.37l-.73-.68Zm2.71-3.31c-.38.52-.77 1.04-1.18 1.55l.78.63v-.09s.01-.02.02-.02v-.03s.01-.02.02-.02 0-.01 0-.01.01-.02.02-.02 0 0 0-.01v-.01s.01-.02.02-.02 0 0 0-.01v-.01s.02-.03.03-.04 0 0 0-.01v-.01c0-.01.02-.02.03-.04s0 0 0-.01v-.01s.01-.02.02-.03 0 0 0-.01-.81-.59-.81-.59Zm2.28-3.61c-.31.57-.64 1.13-.98 1.68l.85.53c.05-.08.1-.17.16-.25v-.03s.01-.02.02-.03v-.04s.01-.02.02-.03v-.07s.01-.02.02-.03 0 0 0-.01v-.02s.02-.03.02-.04v-.03c.12-.21.24-.43.36-.64l-.88-.48Zm1.83-3.87c-.24.6-.5 1.2-.77 1.78l.91.42.03-.06v-.07c.16-.35.32-.7.46-1.06s0 0 0-.01v-.03s.01-.03.02-.04V51.78l-.93-.37Zm1.34-4.06c-.16.62-.35 1.25-.55 1.87l.95.31c.09-.28.18-.57.26-.86v-.01c0-.03.02-.05.02-.08v-.03c0-.01 0-.02.01-.03v-.07c0-.02 0-.03.01-.05v-.03l.09-.34-.97-.25Zm.82-4.19c-.09.64-.19 1.29-.31 1.92l.98.19v-.12l.09-.51v-.04c0-.02 0-.05.01-.07V44c.05-.3.09-.6.13-.9l-.99-.13Zm.32-4.27c0 .65-.03 1.3-.08 1.94l1 .07c0-.11.01-.23.02-.34s0-.01 0-.01v-.02c.03-.46.04-.92.05-1.38v-.05h-1Zm.79-4.38-.99.11c.07.64.12 1.29.16 1.94l1-.05c-.01-.28-.03-.56-.05-.84V34.58Zm-.74-4.33-.97.23c.15.63.28 1.27.39 1.9l.98-.17c-.12-.66-.25-1.31-.4-1.96Zm-1.27-4.21-.94.35c.22.61.43 1.22.62 1.84l.96-.29c-.1-.31-.19-.62-.3-.92s-.02-.06-.03-.09v-.02c0-.02-.02-.05-.02-.07v-.03c0-.02-.01-.04-.02-.06s0 0 0-.01v-.03s-.01-.04-.02-.06 0 0 0-.01v-.01c-.06-.18-.13-.35-.19-.53Zm-1.77-4.03-.89.46c.3.57.58 1.16.84 1.75l.91-.41c-.16-.37-.33-.73-.51-1.08v-.03c0-.01-.01-.02-.02-.03v-.01s0-.02-.01-.03 0 0 0-.01v-.02c-.08-.17-.17-.33-.25-.5Zm-2.26-3.77-.83.56c.36.53.72 1.08 1.05 1.64l.86-.52c-.2-.33-.4-.65-.61-.97-.02-.03-.03-.05-.05-.08-.02-.03-.03-.05-.05-.08v-.01c-.01-.02-.02-.04-.04-.05v-.01c0-.02-.02-.03-.03-.04v-.02c0-.01-.02-.03-.03-.04s0 0 0-.01c-.01-.02-.02-.03-.03-.04v-.01c-.01-.02-.02-.04-.04-.05v-.01c-.01-.02-.03-.04-.04-.06s0 0 0-.01-.01-.02-.02-.03Zm-2.69-3.48-.75.66c.43.49.84.99 1.24 1.5l.79-.62v-.02s-.02-.02-.03-.04 0 0 0-.01v-.02s-.01-.02-.02-.02 0 0 0-.01-.01-.02-.02-.03v-.05s-.01-.02-.02-.02v-.04s-.01-.02-.02-.02c0 0-.02-.02-.02-.03-.01-.01-.02-.03-.03-.04-.01-.02-.03-.03-.04-.05-.02-.02-.03-.04-.05-.06-.1-.12-.21-.25-.32-.37-.02-.02-.03-.04-.05-.06-.01-.02-.03-.03-.04-.05Zm-3.1-3.12-.67.75c.48.43.96.88 1.41 1.33l.71-.71-.21-.21v-.01l-.01-.01c-.37-.36-.75-.72-1.14-1.06Zm-3.45-2.72-.57.82c.53.37 1.06.76 1.57 1.15l.61-.79h-.01c-.3-.24-.61-.47-.92-.69s0 0-.01 0c0 0-.02-.01-.03-.02-.17-.12-.34-.25-.52-.37Zm-3.76-2.28-.47.88c.57.3 1.14.62 1.69.95l.51-.86c-.16-.1-.33-.19-.49-.29h-.01l-.06-.03h-.01c-.02 0-.03-.02-.05-.03l-.06-.03h-.01l-.06-.03h-.02c-.02-.01-.05-.03-.07-.04h-.01c-.26-.15-.52-.29-.79-.43Zm-4.01-1.81-.35.94c.6.23 1.21.48 1.8.74l.41-.91s-.02 0-.02-.01h-.03c-.59-.26-1.18-.5-1.79-.73Zm-4.2-1.3-.24.97c.63.15 1.26.32 1.87.51l.29-.96c-.26-.08-.52-.16-.79-.23h-.03c-.02 0-.04-.01-.06-.02h-.05c-.01 0-.02 0-.04-.01H47.37c-.01 0-.03 0-.04-.01s0 0-.01 0h-.04s-.03 0-.04-.01 0 0-.01 0h-.04s-.03 0-.05-.01 0 0-.01 0h-.04s-.03 0-.05-.01 0 0-.01 0h-.04Zm-4.33-.78-.12.99c.64.07 1.29.17 1.92.28l.17-.99h-.04c-.02 0-.04 0-.07-.01h-.02c-.57-.1-1.15-.18-1.74-.25h-.02ZM38 2v1c.59 0 1.18.01 1.77.04l.05-1c-.45-.02-.91-.04-1.36-.04H38.3Z"/></svg>',
                    27: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="76" height="76"><path d="m14.06 2-1.41 1.41L47.23 38 12.65 72.59 14.06 74l36-36-36-36z"/><path d="m30.06 2-1.41 1.41L63.23 38 28.65 72.59 30.06 74l36-36-36-36z"/></svg>',
                }
                break;
        }
        let navigation = '<div class="slider-nav-btn prev invisible navsize'+size+'">' + navObj[n] + '</div><div class="slider-nav-btn next invisible navsize'+size+'">' + navObj[n] + '</div>';
        return navigation;
    }

    function enableContentsSlider(el_seq, type, settings) {
        let enableBlocks = {
            'contents': ["contents6", "contents7", "contents8", "contents11", "contents12", "contents13", "contents16",
                "contents17", "contents18", "contents19", "contents20", "contents21", "contents41", "contents42",
                "contents43", "contents44", "contents45", "contents46", "contents47", "contents48", "contents49",
                "contents50", "contents51", "contents52", "contents53", "contents54", "contents55", "contents67",
                "contents68", "contents69", "contents73", "contents74", "contents75", "contents77", "contents78",
                "contents79", "contents80", "contents81", "contents82", "contents83", "contents84", "contents85",
                "contents97", "contents98", "contents99", "contents102", "contents103", "contents104", "contents106",
                "contents107", "contents108", "contents134", "contents137", "contents138"],
            'text': ['text1', 'text33', 'text35', 'text36', 'text37', 'text38', 'text40', 'text41', 'text42','text43',
                'text44', 'text46', 'text49', 'text51', 'text52', 'text53', 'text57', 'text58', 'text59', 'text60',
                'text61', 'text62', 'text63', 'text67', 'text68', 'text70', 'text79', 'text80', 'text82', 'text84',
                'text85', 'text86', 'text88', 'text104'],
            'image': ['image1', 'image2', 'image3', 'image4', 'image5', 'image6', 'image7', 'image8', 'image9', 'image10',
                'image11', 'image12', 'image13', 'image14', 'image15', 'image16', 'image17', 'image18', 'image19', 'image20',
                'image21', 'image22', 'image23', 'image24', 'image25', 'image26', 'image27', 'image29', 'image30', 'image31',
                'image32', 'image33', 'image34', 'image35'],
            // 'video': ['video15', 'video16', 'video17'],
            // 'sns': ['social23', 'social24', 'social26', 'social27', 'social28', 'social29', 'social30', 'social31', 'social32', 'social33'],
        }

        let blockorg = $('.element[data-id="' + el_seq + '"]').attr('data-case');
        if(typeof settings != 'undefined' && settings && typeof settings.blockorg != 'undefined' && settings.blockorg) blockorg = settings.blockorg;

        let flag = false;
        if(typeof enableBlocks[type] != 'undefined' && enableBlocks[type].indexOf(blockorg) > -1) {
            flag = true;
        }

        if(type == 'contents' && $('.element[data-id="' + el_seq + '"]').find('[data-clone-loop]').length > 0) {
            flag = false;
        }
        
        return flag;
    }

    function isObjectEmpty(obj) {
        return Object.values(obj).every(value => {
            if (typeof value === 'object' && !Array.isArray(value)) {
                return isObjectEmpty(value);
            }
            return value === null || value === undefined || value === '';
        });
    }

    // 이미지/텍스트 슬라이드 함수
    function sliderClean(select) {
        // console.log(select);
        $(select).find('.swiper-slide-duplicate').remove();
		$(select).find('.swiper-notification').remove();
        $(select).find('.swiper-slide-invisible-blank').remove();
        $(select).find('.swiper-slide.delete').remove();
    }
    
    function sliderModify(slide) {
        document.querySelector(slide).swiper.destroy();
		slider(slide);
    }

    function sliderUnitModify(slide) {
        document.querySelector(slide).swiper.destroy();
		sliderUnit(slide);
    }

    // function textSliderModify(slide) {
    //     document.querySelector(slide).swiper.destroy();
	// 	textSlider(slide);
    // }

    //showcase logoSlide
    var sswiper;
    var uswiper;
    var tswiper;

    //이미지 / 텍스트 슬라이드 미리보기///////////////////////////
    // $(window).resize(function(){
    //     slideshow();
    //     textslideshow();
    // });

    function slideshow() {
        new Swiper( '.logoSlide', { slidesPerView: 'auto', simulateTouch: false, loop: true, speed: 5000, autoplay: { delay: 0, disableOnInteraction: false, }, });
    }
    function textslideshow() {
        new Swiper( '.reviewSlide', { slidesPerView: 'auto', simulateTouch: false, loop: true, speed: 7000, autoplay: { delay: 0, disableOnInteraction: false, }, });
    }
    ///////////////////////////////////////////////////////////

    //showcase logoSlide(flow)
    function slider(t) {
        var elem = document.querySelector(t).children[0];
        if($(elem).hasClass('cl-ns-wrap')) return false;
        let ss = $(elem).attr('data-scroll-speed');
        
        // let mleft = $(elem).find('.item:eq(0)').css('margin-left').replace(/[^0-9]/g, "");
        var w = $(window).width();
        // if(w < 991) $(elem).find('.swiper-slide').css('margin-left', (mleft / 3) + 'px');
        // if(w < 767) $(elem).find('.swiper-slide').css('margin-left', (mleft / 4) + 'px');
        // if(w < 480) $(elem).find('.swiper-slide').css('margin-left', 0 + 'px');
        let space = Number($(elem).attr('slide-space'));
        if(w < 767) { //모바일버전 간격조정
            if(space == 1) $(elem).find('.swiper-slide:not(.bmove)').css('margin-left', '0px');
            else $(elem).find('.swiper-slide:not(.bmove)').css('margin-left', (space * 10 - 10) +'px');
        }

        if (ss == 1000) {
            sswiper = new Swiper( t, { slidesPerView: 'auto', allowTouchMove: false, simulateTouch: false, loop: true, speed: 1000, autoplay: { delay: 0, disableOnInteraction: false, }, });
        } else if (ss == 1500) {
            sswiper = new Swiper( t, { slidesPerView: 'auto', allowTouchMove: false, simulateTouch: false, loop: true, speed: 1500, autoplay: { delay: 0, disableOnInteraction: false, }, });
        } else if (ss == 2200) {
            sswiper = new Swiper( t, { slidesPerView: 'auto', allowTouchMove: false, simulateTouch: false, loop: true, speed: 2200, autoplay: { delay: 0, disableOnInteraction: false, }, });
        } else if (ss == 3000) {
            sswiper = new Swiper( t, { slidesPerView: 'auto', allowTouchMove: false, simulateTouch: false, loop: true, speed: 3000, autoplay: { delay: 0, disableOnInteraction: false, }, });
        } else if (ss == 5000) {
            sswiper = new Swiper( t, { slidesPerView: 'auto', allowTouchMove: false, simulateTouch: false, loop: true, speed: 5000, autoplay: { delay: 0, disableOnInteraction: false, }, });
        } else {
            sswiper = new Swiper( t, { slidesPerView: 'auto', allowTouchMove: false, simulateTouch: false, loop: true, speed: 7000, autoplay: { delay: 0, disableOnInteraction: false, }, });
        }
    }

    //showcase logoSlide(unit)
    function sliderUnit(t) {
        if($(t).find('.item').length == 0 || $(t).hasClass('cl-not-supported') || $(t).find('.cl-ns-wrap').length > 0) return false;

        var elem = document.querySelector(t).children[0];
        $(elem).find('.item').removeAttr('style');
        let ss = $(elem).attr('data-scroll-speed');
        let unit = Number($(elem).attr('data-page-unit'));
        let delay = Number($(elem).attr('data-delay-time'));
        let slide_time = Number($(elem).attr('data-slide-time'));
        var newTransitionDuration = slide_time;
        var option = { slidesPerView : 1, loop : true, slidesPerGroup : 1, loopFillGroupWithBlank : true, allowTouchMove: false, simulateTouch: false, autoplay : { delay : delay, disableOnInteraction : false}};
        option['speed'] = newTransitionDuration * 1000;
        option['slidesPerView'] = Number(unit);
        option['slidesPerGroup'] = Number(unit);
        if(unit == 5) {
            option['breakpoints'] = { 320 : { slidesPerView : 4, slidesPerGroup : 4 }, 767 : { slidesPerView : 4, slidesPerGroup : 4 }, 991 : { slidesPerView : 5, slidesPerGroup : 5 }};
        } else if(unit == 6) {
            option['breakpoints'] = { 320 : { slidesPerView : 4, slidesPerGroup : 4 }, 767 : { slidesPerView : 4, slidesPerGroup : 4 }, 991 : { slidesPerView : 6, slidesPerGroup : 6 }};
        } else if(unit == 7) {
            option['breakpoints'] = { 320 : { slidesPerView : 4, slidesPerGroup : 4 }, 767 : { slidesPerView : 4, slidesPerGroup : 4 }, 991 : { slidesPerView : 7, slidesPerGroup : 7 }};
        } else if(unit == 8) {
            option['breakpoints'] = { 320 : { slidesPerView : 4, slidesPerGroup : 4 }, 767 : { slidesPerView : 4, slidesPerGroup : 4 }, 991 : { slidesPerView : 8, slidesPerGroup : 8 }};
        } else if(unit == 9) {
            option['breakpoints'] = { 320 : { slidesPerView : 4, slidesPerGroup : 4 }, 767 : { slidesPerView : 4, slidesPerGroup : 4 }, 991 : { slidesPerView : 9, slidesPerGroup : 9 }};
        } else if(unit == 10) {
            option['breakpoints'] = { 320 : { slidesPerView : 4, slidesPerGroup : 4 }, 767 : { slidesPerView : 4, slidesPerGroup : 4 }, 991 : { slidesPerView : 10, slidesPerGroup : 10 }};
        } else {
            option['breakpoints'] = { 320 : { slidesPerView : 4, slidesPerGroup : 4 }, 767 : { slidesPerView : 4, slidesPerGroup : 4 }, 991 : { slidesPerView : 4, slidesPerGroup : 4 }};
        }
        new Swiper(t, option);

    }

    //showcase textSlide
    function textSlider(t) {
        var elem = document.querySelector(t).children[0];
        // if($(elem).hasClass('cl-ns-wrap')) return false;
        if($(t).find('.item').length == 0 || $(t).hasClass('cl-not-supported') || $(t).find('.cl-ns-wrap').length > 0) return false;
        let ts = $(elem).attr('data-scroll-speed');
        if(ts == 3000){
            tswiper = new Swiper( t, { watchSlidesProgress: true, slidesPerView: 'auto', allowTouchMove: false, simulateTouch: false, loop: true, speed: 3000, autoplay: { delay: 0, disableOnInteraction: false, }, });
        } else if(ts == 5000){
            tswiper = new Swiper( t, { watchSlidesProgress: true, slidesPerView: 'auto', allowTouchMove: false, simulateTouch: false, loop: true, speed: 5000, autoplay: { delay: 0, disableOnInteraction: false, }, });
        } else if (ts == 7000) {
            tswiper = new Swiper( t, { watchSlidesProgress: true, slidesPerView: 'auto', allowTouchMove: false, simulateTouch: false, loop: true, speed: 7000, autoplay: { delay: 0, disableOnInteraction: false, }, });
        } else if (ts == 9000) {
            tswiper = new Swiper( t, { watchSlidesProgress: true, slidesPerView: 'auto', allowTouchMove: false, simulateTouch: false, loop: true, speed: 9000, autoplay: { delay: 0, disableOnInteraction: false, }, });
        } else if (ts == 12000) {
            tswiper = new Swiper( t, { watchSlidesProgress: true, slidesPerView: 'auto', allowTouchMove: false, simulateTouch: false, loop: true, speed: 12000, autoplay: { delay: 0, disableOnInteraction: false, }, });
        } else {
            tswiper = new Swiper( t, { watchSlidesProgress: true, slidesPerView: 'auto', allowTouchMove: false, simulateTouch: false, loop: true, speed: 8000, autoplay: { delay: 0, disableOnInteraction: false, }, });
        }

        $(tswiper.$el).data('tswiper', tswiper);
    }
}

// var cur = 0;
function tabMotion(el, motion, wh, len, motion_style, tab_count, tab_case, tab_counted) {
    tab_counted = (typeof tab_counted != 'undefined') ? tab_counted : '';
    // console.log('el: '+el+', motion: '+motion+', width: '+wh+', len: '+len+', motion_style: '+motion_style+', tab_count: '+tab_count+', tab_case: '+tab_case+', tab_counted: '+tab_counted);

    var tab_line  = $('.'+el).attr('tab-line');
    var cur = 0,
        cur = cur + motion;

    if(tab_case == 'tab6') {
        var num = Number(tab_count) + Number(motion);
        $('.'+el).find('.tab-box .tab').removeClass('line');
        $('.'+el).find('.tab-box .tab').addClass('line');
        if(motion_style == 1) {
            $('.'+el).find('.tab-box .tab').removeClass('hide-line');
            $('.'+el).find('.tab-box .tab:eq('+ num +')').addClass('hide-line');
            $('.'+el).find('.tab-box .tab:eq('+ motion +')').addClass('hide-line');
        } else {
            var line_r = Number(tab_count) + (Number(motion) * Number(tab_count)),
                line_l = Number(tab_count) * Number(motion);
            $('.'+el).find('.tab-box .tab').removeClass('hide-line');
            $('.'+el).find('.tab-box .tab:eq('+ line_r +')').addClass('hide-line');
            $('.'+el).find('.tab-box .tab:eq('+ line_l +')').addClass('hide-line');
        }
    }
    
    if(cur >= len) cur = 0;
    else if(cur < 0) cur = len - 1;



    if(tab_line == 1) {
        if(motion_style == 1) {
            var margin = $('.'+el).find('.tab-box .tab:not(.hover)').eq(motion).position().left * -1;
            $('.'+el).find('.tab-box').animate({marginLeft : margin+'px'});
        } else {
            var margin = $('.'+el).find('.tab-box .tab:not(.hover)').eq(Number(motion) * Number(tab_count)).position().left * -1;
            $('.'+el).find('.tab-box').animate({marginLeft : margin+'px'});
        }
    }
}

// history-block line align
function lineAlign(el) {
    var last_h = $('.'+el).find('.timeline-item:last').height(),
        last_bottom = last_h - 14;

    $('.'+el).find('.timeline-item .timeline-line').css('bottom', last_bottom+'px');
    $('.'+el).find('.timeline-item .timeline-line').css('height', 'calc(100% - '+ last_h +'px)');
}

function channelTalkHide(isHide) {        
    if(isHide) {
        $('#ch-plugin, .cl-cts-banner').fadeOut().attr('style','z-index: 1 !important; pointer-events: none !important;');
    } else {
        $('#ch-plugin, .cl-cts-banner').fadeIn().attr('style','z-index: 10000000 !important; pointer-events: auto !important;');
    }
}

window.onload = function() {
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false,
        scroll_body = '.dashbottom-wrap',
        scrollTarget = document.querySelector('.dashbottom-wrap');

    switch(this_page) {
        case 'plan':
        case 'billing':
            scroll_body = '.sub.sub-page';
            scrollTarget = document.querySelector('.sub.sub-page');
            break;
        
        case 'message':
            scroll_body = 'html';
            scrollTarget = window;
            break;

        default:
            break;
    }

    if(scrollTarget != null) {
        scrollTarget.addEventListener('scroll', function(e) {
            if($('#ch-plugin, .cl-cts-banner').length == 0) return;
            var isScrollAtBottom = (($(scroll_body).outerHeight() + $(scroll_body).scrollTop() + (isMobile ? 10 : 0)) >=  $(scroll_body).get(0).scrollHeight) ? true : false;
            // $('#popup-title').html('<p style="font-size: 9px;">'+isScrollAtBottom+' = '+($(scroll_body).outerHeight() + $(scroll_body).scrollTop() + (isMobile ? 10 : 0))+' >= '+$(scroll_body).get(0).scrollHeight+'</p>');
            if (isScrollAtBottom) {
                if(!$('body').is('.channelTalkHide')) {
                    $('body').addClass('channelTalkHide');
                    channelTalkHide(true);
                }
            } else {
                if($('body').is('.channelTalkHide')) {
                    $('body').removeClass('channelTalkHide');
                    channelTalkHide(false);
                }
            }
        });
    }

    if(this_page == 'settings' && typeof faviconPreload == 'function') faviconPreload();

    if(this_page == 'manager') {
        $('.member_disabled, .dropdown.member_disabled + svg').off('click');
        $('.member_disabled, .dropdown.member_disabled + svg').on('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            if(!$('#flat-modal').length) siteNotice('manager');
            return false;
        });
        $('select.member_disabled').off('mousedown');
        $('select.member_disabled').on('mousedown', function(e){
            e.preventDefault();
            e.stopPropagation();
            if(!$('#flat-modal').length) siteNotice('manager');
            return false;
        });
    }
    if(this_page == 'shopping') {
        $('.shopping_disabled').off('click');
        $('.shopping_disabled').on('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            if(!$('#flat-modal').length) siteNotice('shopping');
            return false;
        });
    }
}

function emojiEncode(text) {
    // 이모지만을 포함하는 정규 표현식
    var emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{2B55}]/gu;
    
    // 입력 텍스트에서 이모지만을 추출하여 배열로 저장
    var emojis = text.match(emojiRegex) || [];

    // 이모지를 유니코드 이스케이프로 변환하고, 이를 원래 위치에 대체
    emojis.forEach(function(emoji) {
        var codePoints = [];
        for (var i = 0; i < emoji.length; i++) {
            codePoints.push('\\u' + emoji.charCodeAt(i).toString(16));
        }
        text = text.replace(emoji, codePoints.join(''));
    });

    return text;
}

function emojiDecode(escapedString) {
    return escapedString.replace(/\\u[\dA-F]{4}/gi, match => String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16)));
}

function focusAtEnd(input) {
    input.focus();
    var value = input.val();
    input.val('');
    input.val(value);
}

function clCheckBrowser(browser) {
    if(typeof browser == 'undefined' || !browser) return false;

    var is_tablet = /Android|iPad/i.test(navigator.userAgent),
        is_mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        is_pc = !is_mobile && !is_tablet,
        is_chrome = /Chrome|CriOS/i.test(navigator.userAgent),
        is_safari = /Safari/i.test(navigator.userAgent) && !/Chrome|CriOS/i.test(navigator.userAgent),
        is_firefox = /Firefox/i.test(navigator.userAgent),
        is_edge = /Edg/i.test(navigator.userAgent) || /Edge/i.test(navigator.userAgent),
        is_opera = /OPR/i.test(navigator.userAgent) || /Opera/i.test(navigator.userAgent),
        is_ie = /MSIE/i.test(navigator.userAgent) || /Trident/i.test(navigator.userAgent),
        is_kakao = /KAKAOTALK/i.test(navigator.userAgent);

    switch(browser.trim().toLowerCase()) {
        case 'tablet': return is_tablet; break;
        case 'mobile': return is_mobile; break;
        case 'pc': return is_pc; break;

        case 'chrome': return is_chrome; break;
        case 'safari': return is_safari; break;
        case 'firefox': return is_firefox; break;
        case 'edge': return is_edge; break;
        case 'opera': return is_opera; break;
        case 'ie': return is_ie; break;
        case 'kakao': return is_kakao; break;

        default: return false; break;
    }
}

function setColoris() {
    document.querySelector('.coloris-picker input').setAttribute('autocomplete', 'off');
    if($('.coloris-picker > .coloris').length > 0) Coloris.wrap('.coloris-picker > .coloris');
}

function resizeVideoIframe(tag) {
    if($(tag).find('iframe').length === 0 || $(tag).find('[data-bg-type="background"]').length == 0) return;
    var iframe = $(tag).find('.container'),
        width = iframe.width(),
        p_height = iframe.height(),
        height = (width / 16) * 9;
    if(p_height > height) height = p_height;
    iframe.find('iframe').height(height);
}

function getSiteMenuMax(sid) {
    if(typeof sid == 'undefined' || !sid) return 0;
    return ($.inArray(sid, ['flowedu']) > -1) ? 200 : 100;
}

function setSiteMenuOption() {
    var checkConfig = (PAGE_MODE == 'c') ? true : false,
        checkView = (PAGE_MODE == 'c') ? VIEW : property.VIEW,
        checkClnav = ($('.el-menu > header.cl-nav').length > 0) ? true : false,
        sid = (PAGE_MODE == 'c') ? SID : property.SID,
        page = (PAGE_MODE == 'c') ? PAGE : property.PAGE,
        parentpage = (checkView) ? (PAGE_MODE == 'c') ? PAGE.split(',') : property.PAGE.split(',') : '',
        smenu = (PAGE_MODE == 'c') ? SMENU : property.SMENU,
        menuoption = (PAGE_MODE == 'c') ? MENUOPTION : property.MENUOPTION;

    var checkpage = (checkView) ? parentpage[0] : page;
    $.each(menuoption, function(i,o) {
        o.active = '';
        if(o.isbookmark === '' && o.isflink === '' && o.isinner === '' 
            && o.name.replace(/ /g, '-') === checkpage
        ) {
            o.active = 'active';
        }

        $.each(o.children, function(sub_i, sub_o) {
            sub_o.active = '';
            if(o.active == '' 
                && sub_o.isbookmark === '' && sub_o.isflink === '' && sub_o.isinner === '' 
                && sub_o.name.replace(/ /g, '-') === checkpage
            ) {
                sub_o.active = 'active';
                o.active = 'open';
                if(!checkClnav && $('body').width() > 768) o.active = 'active';
            }
        });
    });
}

function date_string(d) {
    const date = new Date(d);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdayNames[date.getDay()];
    return `${month}월 ${day}일 (${weekday})`;
}


function slideNavigation(n) {
    let navObj = {
        1: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="44" height="44"><path d="m27.65 22-1.4-1.4-8.5-8.5-1.4 1.4 8.5 8.5-8.5 8.5 1.4 1.4 8.5-8.5z"/></svg>',
        2: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="44" height="44"><path d="m27.65 22-1.4-1.4-8.5-8.5-1.4 1.4 8.5 8.5-8.5 8.5 1.4 1.4 8.5-8.5z"/></svg>',
        3: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="44" height="44"><path d="M1.96 2v40h40V2h-40zm15.75 29.9-1.4-1.4 8.5-8.5-8.5-8.5 1.4-1.4 8.5 8.5 1.4 1.4-9.9 9.9z"/></svg>',
        4: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="44" height="44"><path d="m37.6 20.6-8.5-8.5-1.4 1.4 7.5 7.5H5v2h30.2l-7.5 7.5 1.4 1.4 8.5-8.5L39 22z"/></svg>',
        5: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="44" height="44"><g><path d="M22 2C10.95 2 2 10.95 2 22s8.95 20 20 20 20-8.95 20-20S33.05 2 22 2zm0 38.8C11.63 40.8 3.2 32.37 3.2 22S11.63 3.2 22 3.2 40.8 11.63 40.8 22 32.37 40.8 22 40.8z"/><path d="m25.11 21.15-6.22-6.22-.85.85L24.26 22l-6.22 6.22.85.85 6.22-6.22.85-.85-.85-.85z"/></g></svg>',
        6: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="44" height="44"><g><path d="m18.89 29.07 6.22-6.22.85-.85-.85-.85-6.22-6.22-.85.85L24.26 22l-6.22 6.22z"/><path d="M2 2v40h40V2H2zm38.8 38.8H3.2V3.2h37.6v37.6z"/></g></svg>',
        7: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="44" height="44"><path d="m17.69 1.79-.9.42L26.21 22l-9.42 19.79.9.42L27.32 22z"/></svg>',
        8: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="44" height="44"><g><path d="M10.84 38.6c.08.06.17.11.25.17h.04c.17.11.34.22.52.32l.62-1.03c-.27-.16-.53-.33-.79-.51l-.64 1.05z"/><path d="m4.53 28.96-1.12.44c.01.03.03.06.04.1v.02c.1.25.2.49.31.73v.05c0 .01.01.01.01.02l1.09-.5c-.09-.28-.21-.57-.33-.86z"/><path d="m3.26 23.49-1.2.09c.02.25.04.49.07.73V24.59l1.19-.15c-.01-.33-.04-.64-.06-.95z"/><path d="m3.25 20.67-1.2-.08c-.02.33-.04.66-.05 1l1.2.02c.01-.32.02-.63.05-.94z"/><path d="m3.65 17.88-1.17-.26c-.07.32-.14.65-.19.98l1.18.2c.05-.31.11-.62.18-.92z"/><path d="m8.49 36.74.3.27c.02.02.04.04.06.05l.01.01.01.01.01.01.01.01.01.01s.01 0 .01.01c0 0 .01 0 .01.01 0 0 .01 0 .01.01 0 0 .01 0 .01.01l.01.01.01.01h.01l.01.01.01.01H9l.01.01.01.01.01.01.01.01.01.01.01.01h.01l.01.01.01.01h.01s.01 0 .01.01c0 0 .01 0 .01.01 0 0 .01 0 .01.01 0 0 .01 0 .01.01 0 0 .01 0 .01.01 0 0 .01 0 .01.01 0 0 .01 0 .01.01l.01.01.01.01.01.01.01.01.01.01.01.01.01.01.77-.92c-.24-.2-.48-.41-.71-.62l-.81.87z"/><path d="m4.47 15.18-1.12-.44c-.05.12-.1.25-.14.37v.02s0 .01-.01.01c0 .01-.01.02-.01.03-.01.03-.02.07-.04.1v.03s0 .01-.01.01c0 0 0 .01-.01.01-.04.1-.07.21-.11.31l1.14.38c.09-.24.2-.54.31-.83z"/><path d="M4.73 32.09c.11.18.21.36.32.53v.03l.18.27 1-.66c-.17-.26-.34-.53-.5-.8l-1 .63z"/><path d="m10.71 5.49-.1.07-.01.01-.01.01-.01.01-.01.01-.01.01-.01.01-.01.01-.01.01s-.01 0-.01.01c0 0-.01 0-.01.01 0 0-.01 0-.01.01 0 0-.01 0-.01.01 0 0-.01 0-.01.01 0 0-.01 0-.01.01 0 0-.01 0-.01.01 0 0-.01 0-.01.01 0 0-.01 0-.01.01 0 0-.01 0-.01.01 0 0-.01 0-.01.01 0 0-.01 0-.01.01 0 0-.01 0-.01.01 0 0-.01 0-.01.01 0 0-.01 0-.01.01 0 0-.01 0-.01.01 0 0-.01 0-.01.01 0 0-.01 0-.01.01 0 0-.01 0-.01.01 0 0-.01 0-.01.01 0 0-.01 0-.01.01 0 0-.01 0-.01.01l-.01.01-.01.01-.01.01-.01.01-.01.01-.01.01-.01.01-.01.01-.01.01-.01.01c-.07.05-.13.1-.2.15l.73.95c.25-.19.5-.37.76-.55l-.79-1.02z"/><path d="M6.43 34.56c.21.26.43.51.65.76l.89-.8c-.21-.23-.41-.47-.61-.72l-.93.76z"/><path d="M27.6 2.8c-.21-.06-.43-.12-.65-.18h-.05l-.26-.06-.28 1.17c.31.07.61.15.91.24l.33-1.17z"/><path d="M24.67 2.18c-.04 0-.07-.01-.11-.01-.13-.02-.25-.03-.38-.04H24.03c-.05-.01-.11-.01-.16-.02h-.05c-.05 0-.1-.01-.15-.01l-.1 1.2c.31.03.63.06.93.1l.17-1.22z"/><path d="M39.19 11.77c-.13-.22-.27-.44-.41-.66v-.02l-.01-.01c-.02-.03-.04-.06-.06-.1l-1 .67c.17.26.34.53.5.79l.98-.67z"/><path d="m39.41 14.9 1.11-.45-.06-.15v-.17c-.01-.02-.01-.03-.02-.05-.08-.18-.15-.35-.23-.52l-1.09.51c.05.26.18.54.29.83z"/><path d="m40.28 17.58 1.17-.28c-.02-.07-.03-.13-.05-.2V16.88c-.03-.12-.07-.24-.1-.36l-1.15.34c-.03.11.05.42.13.72z"/><path d="m40.73 20.36 1.2-.1-.03-.29v-.03c-.02-.22-.05-.44-.08-.66l-1.19.16c.04.3.07.61.1.92z"/><path d="m9.19 8.24-.82-.88c-.05.05-.09.09-.14.13l-.01.01-.01.01-.01.01-.01.01s-.01 0-.01.01l-.01.01-.01.01-.01.01-.01.01-.01.01-.01.01-.01.01c-.16.15-.31.3-.46.46l.86.83c.22-.22.45-.44.68-.66z"/><path d="M22 3.2V2H21.89c-.27 0-.54.01-.8.02l.06 1.2c.22-.01.53-.02.85-.02z"/><path d="m7.27 10.31-.94-.74c-.09.11-.17.22-.26.33l-.01.01v.01l-.01.01v.01l-.01.01v.01l-.01.01v.01l-.01.01v.02l-.01.01v.01s0 .01-.01.01c0 0 0 .01-.01.01 0 0 0 .01-.01.01 0 0 0 .01-.01.01 0 0 0 .01-.01.01 0 0 0 .01-.01.01 0 0 0 .01-.01.01 0 0 0 .01-.01.01 0 0 0 .01-.01.01 0 0 0 .01-.01.01 0 0 0 .01-.01.01 0 0 0 .01-.01.01 0 0 0 .01-.01.01 0 0 0 .01-.01.01 0 0 0 .01-.01.01 0 0 0 .01-.01.01 0 0 0 .01-.01.01 0 0 0 .01-.01.01 0 0 0 .01-.01.01 0 0 0 .01-.01.01 0 0 0 .01-.01.01v.02s0 .01-.01.01c0 0 0 .01-.01.01l-.01.01-.01.01-.01.01c-.01.02-.02.03-.03.05l.98.7.57-.75z"/><path d="m5.69 12.64-1.04-.6c-.1.18-.2.36-.3.55v.03l-.15.3 1.07.55c.11-.28.26-.56.42-.83z"/><path d="m19.19 3.41-.18-1.19-.39.06H18.39c-.01 0-.02 0-.03.01-.01 0-.02 0-.03.01H18.06l.24 1.18c.27.03.58-.02.89-.07z"/><path d="m3.69 26.27-1.17.27.06.24v.07c.05.22.11.44.18.66l1.15-.33c-.07-.3-.15-.6-.22-.91z"/><path d="m36.82 33.57.95.74c.01-.01.01-.02.02-.02l.01-.01.01-.01.01-.01s0-.01.01-.01c0 0 0-.01.01-.01l.01-.01v-.01l.01-.01v-.02s0-.01.01-.01l.01-.01.01-.01.01-.01.01-.01.01-.01c.03-.04.06-.08.09-.11l.01-.01.01-.01s0-.01.01-.01c0 0 0-.01.01-.01 0 0 0-.01.01-.01 0 0 0-.01.01-.01 0 0 0-.01.01-.01 0 0 0-.01.01-.01 0 0 0-.01.01-.01l.01-.01v-.01l.01-.01.01-.01s0-.01.01-.01c0 0 0-.01.01-.01v-.01l.01-.01v-.01l.01-.01v-.01l.01-.01v-.01s0-.01.01-.01c0 0 0-.01.01-.01 0 0 0-.01.01-.01 0 0 0-.01.01-.01 0 0 0-.01.01-.01 0 0 0-.01.01-.01 0 0 0-.01.01-.01 0 0 0-.01.01-.01 0 0 0-.01.01-.01 0 0 0-.01.01-.01v-.04c0-.01 0 0 .01-.01v-.01l.01-.01v-.01l.01-.01s0-.01.01-.01c0 0 0-.01.01-.01 0 0 0-.01.01-.01.02-.02.03-.05.05-.07l-.98-.69c-.21.25-.4.5-.59.75z"/><path d="M37.46 9.31c-.01-.01-.01-.01 0 0l-.01-.01-.01-.01v-.01l-.01-.01c-.01-.01 0 0 0-.01l-.01-.01v-.01l-.01-.01v-.01l-.01-.01-.01-.01v-.01l-.01-.01v-.01s0-.01-.01-.01c0 0 0-.01-.01-.01 0 0 0-.01-.01-.01 0 0 0-.01-.01-.01 0 0 0-.01-.01-.01 0 0 0-.01-.01-.01 0 0 0-.01-.01-.01l-.01-.01v-.01l-.01-.01v-.01l-.01-.01v-.01l-.01-.01-.01-.01v-.01L37.25 9s0-.01-.01-.01c0 0 0-.01-.01-.01l-.01-.01-.01-.01-.01-.01s0-.01-.01-.01v-.01l-.01-.01-.01-.01-.01-.01-.01-.01-.01-.01v-.01l-.01-.01v-.01l-.01-.01v-.01l-.01-.01s0-.01-.01-.01c0 0 0-.01-.01-.01 0 0 0-.01-.01-.01 0 0 0-.01-.01-.01 0 0 0-.01-.01-.01l-.01-.01-.01-.01-.01-.01-.01-.01-.01-.01-.01-.01-.01-.01-.01-.01c-.06-.07-.12-.14-.19-.21l-.89.81c.21.23.42.47.61.71l.95-.69z"/><path d="m34.92 35.65.83.87c.09-.09.18-.17.27-.26l.01-.01.01-.01.01-.01.01-.01.01-.01.01-.01.01-.01.01-.01.36-.36-.87-.83c-.22.23-.44.45-.67.66z"/><path d="m32.74 37.43.69.98.01-.01.01-.01.01-.01s.01 0 .01-.01c0 0 .01 0 .01-.01 0 0 .01 0 .01-.01 0 0 .01 0 .01-.01 0 0 .01 0 .01-.01h.01l.01-.01c.01-.01 0 0 .01 0h.01l.01-.01s.01 0 .01-.01c0 0 .01 0 .01-.01 0 0 .01 0 .01-.01 0 0 .01 0 .01-.01.1-.07.2-.15.3-.22l.01-.01.01-.01s.01 0 .01-.01l.01-.01h.01s.01 0 .01-.01c0 0 .01 0 .01-.01 0 0 .01 0 .01-.01 0 0 .01 0 .01-.01l.01-.01c.07-.05.14-.11.21-.16l-.73-.95c-.23.22-.48.4-.74.58z"/><path d="M35.39 7.15c0-.01 0-.01 0 0l-.01-.01-.01-.01-.01-.01-.01-.01a17.4 17.4 0 0 0-.65-.56l-.01-.01-.01-.01-.01-.01-.01-.01-.01-.01-.76.93c.24.2.48.4.71.61l.79-.89z"/><path d="m32.61 5.04-.01-.01-.01-.01H32.53c-.11-.07-.22-.14-.33-.2l-.61 1.03c.27.16.54.33.8.5l.66-1c-.16-.13-.3-.22-.44-.31z"/><path d="m40.38 25.97 1.17.25c.02-.08.03-.16.05-.24v-.05c.04-.18.07-.36.1-.54v-.03c.01-.04.01-.08.02-.12l-1.18-.19c-.04.31-.1.62-.16.92z"/><path d="M40.8 22.24c0 .32-.02.63-.04.94l1.2.07v-.08l.03-.6c0-.11.01-.21.01-.32l-1.2-.01z"/><path d="m39.58 28.68 1.12.43c.07-.19.14-.39.21-.59v-.09c.03-.09.06-.17.08-.26l-1.14-.37c-.05.29-.16.58-.27.88z"/><path d="m38.38 31.23 1.05.59c.05-.09.1-.17.14-.26v-.03c.1-.18.19-.36.28-.54v-.01l-1.07-.54c-.09.24-.24.51-.4.79z"/><path d="M13.3 3.99c-.3.15-.6.3-.89.46l.58 1.05c.27-.15.55-.29.84-.43l-.53-1.08z"/><path d="M19.17 41.8c.2.03.4.05.6.08h.03c.12.01.24.03.36.04l.11-1.2c-.31-.03-.62-.06-.93-.11l-.17 1.19z"/><path d="M16.24 41.16c.13.04.26.08.39.11.01 0 .02 0 .02.01H16.77c.1.03.2.05.3.08l.29-1.17c-.31-.08-.61-.16-.91-.25l-.21 1.22z"/><path d="m22.15 40.8.01 1.2c.34 0 .67-.01 1-.03l-.07-1.2c-.31.02-.62.03-.94.03z"/><path d="M16.09 2.89c-.19.06-.37.12-.56.18-.02.01-.04.01-.06.02l-.33.12.41 1.13c.29-.11.59-.21.89-.3l-.35-1.15z"/><path d="m30.31 38.87.53 1.08c.11-.06.23-.11.34-.17h.01s.01 0 .01-.01h.02c.17-.09.33-.18.49-.27l-.58-1.05c-.26.13-.54.28-.82.42z"/><path d="M13.44 40.08c.1.05.19.09.29.13H13.85c.06.03.11.05.17.08h.07c.09.04.18.08.27.11l.46-1.11c-.29-.12-.58-.25-.86-.38l-.52 1.17z"/><path d="m27.7 39.92.36 1.14.2-.06h.05c.16-.05.33-.11.49-.17.06-.02.13-.05.19-.07l-.42-1.12c-.27.08-.57.19-.87.28z"/><path d="M30.37 3.83c-.01 0-.01-.01-.01-.01h-.02c-.24-.11-.48-.22-.73-.32h-.07c-.01 0-.02-.01-.03-.01l-.45 1.11c.29.12.58.24.86.37l.51-1.09c-.03-.04-.04-.04-.06-.05z"/><path d="m24.96 40.57.19 1.19c.07-.01.14-.02.22-.04H25.43c.12-.02.25-.04.37-.07h.04l.29-.06-.25-1.17c-.3.04-.61.1-.92.15z"/><path d="m29 22-4.24-4.24-.71.7 3.04 3.04H16v1h11.09l-3.04 3.04.71.7 3.53-3.53z"/></g></svg>',
        9: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="44" height="44"><g><path d="M8.48 17.6h1.15l3.2 5.55.94 1.81h.06c-.06-.89-.14-1.87-.14-2.78V17.6h1.06v8.8H13.6l-3.2-5.55-.95-1.81H9.4c.05.89.13 1.82.13 2.75v4.62H8.48V17.6z"/><path d="M16.84 17.6h5.07v.95h-3.96v2.76h3.33v.95h-3.33v3.2h4.09v.95h-5.21V17.6z"/><path d="m25.17 21.86-2.4-4.26h1.22l1.2 2.25c.23.41.41.78.7 1.28h.05c.24-.5.41-.88.62-1.28l1.17-2.25h1.16l-2.4 4.32 2.57 4.49h-1.22l-1.3-2.38c-.23-.44-.47-.89-.75-1.42h-.05c-.25.53-.48.97-.71 1.42l-1.27 2.38H22.6l2.57-4.55z"/><path d="M31.74 18.55h-2.66v-.95h6.44v.95h-2.66v7.86h-1.12v-7.86z"/></g></svg>',
    };
    let navigation = '<div class="slide-nav-btn prev">' + navObj[n] + '</div><div class="slide-nav-btn next">' + navObj[n] + '</div>';
    return navigation;
}