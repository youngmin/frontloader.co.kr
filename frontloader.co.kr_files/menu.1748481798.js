if(typeof LANG == 'undefined') var LANG = (typeof getLanguage != 'undefined') ? getLanguage() : 'ko';
$(function() {

    var _html = document.querySelector('html'),
        _dsgnbody = document.querySelector('.dsgn-body'),
        _elmenu = document.querySelector('.element.el-menu');

    // ✅ 스크롤 이벤트 핸들러
    function handleScroll() {
        if (window.getComputedStyle(_html).getPropertyValue('overflow-y') != 'hidden') {
            if (window.scrollY > 0) _dsgnbody.classList.add('_scrolling');
            else _dsgnbody.classList.remove('_scrolling');
        }
    }

    // ✅ 스크롤 이벤트 추가 함수 (동적 요소 대응)
    function addScrollListener() {
        _dsgnbody = document.querySelector('.dsgn-body'); // 최신 요소 가져오기
        if (_dsgnbody) {
            window.addEventListener('scroll', handleScroll);
        }
    }

    // ✅ 초기 로드 시 스크롤 이벤트 적용
    addScrollListener();

    // ✅ dsgn-body 요소가 동적으로 추가될 경우 감지
    var observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.classList && node.classList.contains('dsgn-body')) {
                    addScrollListener(); // ✅ 동적 생성 시 스크롤 이벤트 추가
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    if (_elmenu) {
        var elmenu_observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) _elmenu.classList.remove('_ready');
            });
        }, { threshold: 0 });

        elmenu_observer.observe(_elmenu);
		if(_dsgnbody.classList.contains('modoo') 
			&& $.inArray(_dsgnbody.getAttribute('data-displaytype'), ['B','C']) > -1
		) {
			var _el0 = document.querySelector('.element.modoo[data-pos="0"]');
			
			var el0_observer = new IntersectionObserver(entries => {
				entries.forEach(entry => {
					if(entry.isIntersecting) _dsgnbody.classList.add('_show_el0');
					else  _dsgnbody.classList.remove('_show_el0');
				});
			}, {
				threshold: 0
			});
			el0_observer.observe(_el0);
		}		
    }

	$.clnav = {
		check: false,
		set: function() {
			// console.log('clnav.set()');
			var _s = $.clnav.s,
				_d = $.clnav.d,
				_el = $.clnav.el;

			if(	_s.checkFree
				|| $.isEmptyObject(_s.slang)
				|| (!$.isEmptyObject(_s.slang) &&  _s.slang.use_language == 'off')
			) {
				_el.header.find('.cl-fixnav-item.lang').remove();
			}


			if(	_s.checkFree
				|| _s.checkBS
				|| (_s.checkBN && Number(_s.um) < 0)
			) {
				_el.header.find('.cl-fixnav-item.loginout').remove();
			} else {
				if(_s.mem.check_login || false === true) {
					_el.header.find(`${_d.label.fixItem}.loginout a.login`).hide();
					_el.header.find(`${_d.label.fixItem}.loginout a.logout`).show();
					_el.header.find(`${_d.label.fixItem}.loginout a.mypage`).hide();
					_el.sidemobile.find(`.section-area.btns > .login`).hide();
					_el.sidemobile.find(`.section-area.btns > .logout`).show();
				} else {
					_el.header.find(`${_d.label.fixItem}.loginout a.login`).show();
					_el.header.find(`${_d.label.fixItem}.loginout a.logout`).hide();
					_el.header.find(`${_d.label.fixItem}.loginout a.mypage`).hide();
					_el.sidemobile.find(`.section-area.btns > .login`).show();
					_el.sidemobile.find(`.section-area.btns > .logout`).hide();
				}
			}


			if(	!_s.checkSM) {
				_el.header.find('.cl-fixnav-item.search, .cl-fixnav-item.cart').remove();
			}

			_el.header.find('a').attr('draggable', false);
			_el.sidemobile.find('a').attr('draggable', false);
			if($(_d.label.sidemap.modal).length > 0) $(_d.label.sidemap.modal).find('a').attr('draggable', false);

			if(_el.option.is('[data-nowrap="true"]')) {
				_el.header.addClass(_d.label.nowrap.el.replace(/\./g,' '));
				_el.header.find('.main .cl-nav-list, .sub .cl-subnav-list').addClass(_d.label.nowrap.target.replace(/\./g,' '));

				if(_s.checkModoo) {
					_el.header.find('.cl-fixnav-item.lang, .cl-fixnav-item.search, .cl-fixnav-item.cart').remove();
					if($('.dsgn-body').is('[data-displaytype="B"]')) {
						$('.element.modoo[data-pos="0"]').addClass(_d.label.nowrap.el.replace(/\./g,' '));
						$('.element.modoo[data-pos="0"] .cl-nav-list').addClass(_d.label.nowrap.target.replace(/\./g,' '));
					}
				}

				$(`${_d.label.nowrap.target}`).on('scroll', function(e) {
					$.clnav.setNowrapBtn(`.${$(e.target).attr('class').replace(/ /g,'.')}`);
				});

				if(!_d.isReload) {
					$(document)
						// .clnav
						.on('click',_d.label.nowrap.prevBtn,function(e) {
							if(e.target === null) return;

							var tmp_selector = $(this).next(_d.label.nowrap.target).attr('class').replace(/ /g,'.'),
								tmp_target = document.querySelector(`.${tmp_selector}`);
							
							// 기존 - 제일 왼쪽 메뉴로 스크롤 이동
							// if(tmp_target) {
							// 	console.log(tmp_target);
							// 	tmp_target.scrollLeft = 0;
							// 	$.clnav.setNowrapBtn(tmp_selector);
							// }

							
							if (tmp_target) {
								const items = [...tmp_target.querySelectorAll('.cl-nav-item')];

								const scrollLeft = tmp_target.scrollLeft;

								const containerW = tmp_target.clientWidth;

								let firstIndex = items.findIndex(item => 
									item.offsetLeft + item.offsetWidth > scrollLeft
								);

								if (firstIndex < 0) return;

								let sum = 0, targetIndex = firstIndex;
								for (let i = firstIndex - 1; i >= 0; i--) {
									sum += items[i].offsetWidth;
									if (sum >= containerW) break;
									targetIndex = i;
								}

								items[targetIndex]?.scrollIntoView({
									behavior: 'smooth',
									inline: 'start',
									block: 'nearest'
								});

								$.clnav.setNowrapBtn(tmp_selector);
							}
						})
						.on('click',_d.label.nowrap.nextBtn,function(e) {
							if(e.target === null) return;

							var tmp_selector = $(this).prev(_d.label.nowrap.target).attr('class').replace(/ /g,'.'),
								tmp_target = document.querySelector(`.${tmp_selector}`);
							// if(tmp_target) {
							// 	tmp_target.scrollLeft = tmp_target.scrollWidth - tmp_target.clientWidth;
							// 	$.clnav.setNowrapBtn(tmp_selector);
							// }
    
							if (tmp_target) {
								const items = [...tmp_target.querySelectorAll('.cl-nav-item')];

								const scrollLeft = tmp_target.scrollLeft;
								const containerW = tmp_target.clientWidth;

								let firstHiddenIndex = items.findIndex(item => 
									item.offsetLeft + item.offsetWidth > scrollLeft + containerW
								);

								if (firstHiddenIndex < 0) return;

								let sum = 0, targetIndex = firstHiddenIndex;
								for (let i = firstHiddenIndex; i < items.length; i++) {
									sum += items[i].offsetWidth;
									if (sum >= containerW) break;
									targetIndex = i;
								}

								const targetItem = items[targetIndex];
								if (targetItem) {
									const offset = targetItem.offsetLeft - (containerW - targetItem.offsetWidth);
									tmp_target.scrollTo({
										left: offset,
										behavior: 'smooth'
									});
								}

								$.clnav.setNowrapBtn(tmp_selector);
							}


						})
						.on('mousedown',_d.label.nowrap.target,function(e) {
							if(e.target === null) return;
							_d.isDrag = false;
							_d.isMouseDown = true;
							_d.eTraget = `.${$(this).attr('class').replace(/ /g,'.')}`;
							_d.startX = e.pageX - document.querySelector(_d.eTraget).offsetLeft; // 마우스 시작 위치
							_d.scrollLeft = document.querySelector(_d.eTraget).scrollLeft; // 현재 스크롤 위치
						})
						.on('mousemove',_d.label.nowrap.target,function(e) {
							if (e.target === null || !_d.isMouseDown || e.buttons !== 1) return;

							var scrollTarget = document.querySelector(_d.eTraget);
							if($(this).is(_d.eTraget) && scrollTarget) {	
								_d.isDrag = true;

								var x = e.pageX - scrollTarget.offsetLeft; // 마우스 위치
								var walk = (x - _d.startX) * 1; // 드래그 이동 거리, 속도 조절 (1배로 이동)
								scrollTarget.scrollLeft = _d.scrollLeft - walk; // 스크롤 이동

								if (scrollTarget.scrollLeft < 0) scrollTarget.scrollLeft = 0; // 메뉴가 왼쪽 끝을 넘어가지 않도록

								// 메뉴가 오른쪽 끝을 넘지 않도록
								if (scrollTarget.scrollLeft > scrollTarget.scrollWidth - scrollTarget.clientWidth) {
									scrollTarget.scrollLeft = scrollTarget.scrollWidth - scrollTarget.clientWidth;
								}
		
								$.clnav.setNowrapBtn(_d.eTraget);
							}
						})
						.on('mouseup',function(e) {
							if(e.target === null) return;

							if(_d.isDrag) {
								e.preventDefault();
								e.stopImmediatePropagation();
							}

							_d.eTraget = '';
							_d.isMouseDown = false;
							_d.isTouch = false;
							_d.startX = 0;
							_d.startY = 0;
							_d.scrollLeft = 0;
							_d.scrollTop = 0;
						})
						.on('click',`${_d.label.nowrap.target} a`,function(e) {
							if(e.target === null) return;

							if (_d.isDrag) { 
								e.preventDefault();
								e.stopImmediatePropagation();
							}
						})
						// .clnavSidemap
						.on('click',`${_d.label.sidemap.openBtn}, ${_d.label.sidemap.closeBtn}`,function(e) {
							if(e.target === null) return;
							e.preventDefault();

							if($(this).is(_d.label.sidemap.openBtn) && PAGE_MODE == 'c') alert('전체보기 기능은 편집모드에서 지원하지 않습니다');
							else $('html').toggleClass(_d.label.sidemap.toggleCls);

							$(`${_d.label.sidemap.modal} ${_d.label.brand}`).removeAttr('style');
						})
						.on('click',_d.label.navSpan.caret,function(e) {
							if(e.target === null) return;
							e.preventDefault();
							$(e.target).closest(`${_d.label.navItem}.dropdown`).toggleClass('open');
						})
						// .clnav-sidemobile
						.on('click',_d.label.sidemobile.backdrop,function(e) {
							if(e.target === null) return;
							if($('html').hasClass(_d.label.sidemobile.toggleCls)) $('html').toggleClass(_d.label.sidemobile.toggleCls);
						})
						.on('click',`${_d.label.sidemobile.openBtn}, ${_d.label.sidemobile.closeBtn}`,function(e) {
							if(e.target === null) return;
							$('html').toggleClass(_d.label.sidemobile.toggleCls);
						})
						.on('mousedown',`${_d.label.sidemobile.modal} .container`,function(e) {
							if(e.target === null) return;
							_d.isDrag = false;
							_d.isMouseDown = true;
							_d.eTraget = '.clnav-sidemobile .container';
							_d.startY = e.pageY - document.querySelector(_d.eTraget).offsetTop; // 마우스 시작 위치
							_d.scrollTop = document.querySelector(_d.eTraget).scrollTop; // 현재 스크롤 위치
						})
						.on('mousemove',`${_d.label.sidemobile.modal} .container`,function(e) {
							if (e.target === null || !_d.isMouseDown || e.buttons !== 1) return;

							var scrollTarget = document.querySelector(_d.eTraget);
							if($(this).is(_d.eTraget) && scrollTarget) {	
								_d.isDrag = true;

								var y = e.pageY - scrollTarget.offsetTop; // 마우스 위치
								var walk = (y - _d.startY) * 1; // 드래그 이동 거리, 속도 조절 (1배로 이동)
								scrollTarget.scrollTop = _d.scrollTop - walk; // 스크롤 이동

								if (scrollTarget.scrollTop < 0) scrollTarget.scrollTop = 0; // 메뉴가 왼쪽 끝을 넘어가지 않도록

								// 메뉴가 오른쪽 끝을 넘지 않도록
								if (scrollTarget.scrollTop > scrollTarget.scrollHeight - scrollTarget.clientHeight) {
									scrollTarget.scrollTop = scrollTarget.scrollHeight - scrollTarget.clientHeight;
								}
							}
						})
						.on('click',`${_d.label.sidemobile.modal} a`,function(e) {
							if(e.target === null
								|| $(e.target).closest('.section-area.btns').length > 0
							) {
								return;
							}

							if($(e.target).is('.cl-nav-depth')) {
								$(this).closest(`${_d.label.navItem}.dropdown`).toggleClass('open');
							}

							if (_d.isDrag 
								|| !($(e.target).is('.cl-nav-name') || $(e.target).is('.cl-subnav-name'))
							) { 
								e.preventDefault();
								e.stopImmediatePropagation();
							}
						})
						.on('click',`${_d.label.sidemobile.modal} .section-area.company .btn`,function(e) {
							if(e.target === null) return;
							$(`${_d.label.sidemobile.modal} .section-area.company`).toggleClass('open');
						});

				}

				if(_el.header.find(`.main ${_d.label.nowrap.target} > ${_d.label.navItem}:is(.active, .open)`).length > 0) {
					_el.header.find(`.main ${_d.label.nowrap.target} > ${_d.label.navItem}:is(.active, .open)`)[0].scrollIntoView({
						behavior: 'smooth',
						block: 'center',
						inline: 'center',
					});
				}
				if(_el.header.find(`.sub ${_d.label.nowrap.target} > ${_d.label.subItem}.active`).length > 0) {
					_el.header.find(`.sub ${_d.label.nowrap.target} > ${_d.label.subItem}.active`)[0].scrollIntoView({
						behavior: 'smooth',
						block: 'center',
						inline: 'center',
					});
				}

				setTimeout(function() {
					$.clnav.setNowrapBtn(_d.label.nowrap.target);

				// 종화 - 사용자가 마지막 메뉴를 클릭했을 때, 항목이 가려져 있으면 스크롤로 보이게 처리 하는 함수 추가
				function ensureMenuItemVisible(container, element) {
					const containerRect = container.getBoundingClientRect();
					const elementRect = element.getBoundingClientRect();
				
					if (elementRect.right > containerRect.right) {
						container.scrollLeft += (elementRect.right - containerRect.right);
						container.scrollLeft += 26;
					}
				}
				
				const $lastMenuItem = _el.header.find(`.main ${_d.label.nowrap.target} > ${_d.label.navItem}:last-child`);

				if ($lastMenuItem.is('.active, .open')) {
					const $menuContainer = _el.header.find(`.main ${_d.label.nowrap.target}`);
					ensureMenuItemVisible($menuContainer[0], $lastMenuItem[0]);
				}


				});
			}

			if(_s.checkModoo) {
				var isSiteHome = _el.header.find(_d.label.navItem).eq(0).hasClass('active');
				if(typeof currentIndex != 'undefined' && currentIndex == 1) isSiteHome = true;
				if(_s.modoo.displaytype == 'E' || _s.checkCLPage || _s.view != '') isSiteHome = false;

				if(isSiteHome) _el.header.closest(_d.label.wrap).addClass('home');
				else _el.header.closest(_d.label.wrap).removeClass('home');

				var tmp_h = _el.header.outerHeight(),
					tmp_c = (_s.checkConfig) ? $('.editor-navbar').outerHeight() : 0,
					__elmenu_over = 0,
					__elmenu_top = 0;

				if(isSiteHome) {
					__elmenu_over = (tmp_h - tmp_c) * -1;
					__elmenu_top = tmp_c - 1;
				} else {
					__elmenu_over = tmp_c;
					__elmenu_top = tmp_c;
				}

				document.querySelector('.dsgn-body').style.setProperty('--elmenu-over', `${__elmenu_over}px`, null);
				document.querySelector('.dsgn-body').style.setProperty('--elmenu-top', `${__elmenu_top}px`, null);
			}

			_el.header.closest('._ready').removeClass('_ready');

		},
		init: function() {
			$.clnav.check = true;
			var sample_tag = {
				default: `
					<header class="cl-nav menu-kaa1910 menu-top1" data-nav-style="1" data-subnav-style="1" data-fixnav-set-style="8" data-fixnav-lang-style="1">
						<input type="hidden" class="cl-nav-option" data-align-nav-list="right">

						<div class="cl-nav-section main">
							<div class="container">
								<a class="cl-nav-brand" href="/config" data-recommend="170 X 60">
									<img class="cl-nav-brand-image" src="http://storage.googleapis.com/i.addblock.net/template/menu_normal_1_logo.png" alt="ryan-holloway-273158(0001).jpg">
									<span class="cl-nav-brand-text hide">M A R K R O S S O U</span>
								</a>
								<ul class="cl-fixnav-list">
									<li class="cl-fixnav-item search"><a href="javascript:void(0);"><span class="cl-fixnav-icon"></span><span class="cl-fixnav-name">SEARCH</span></a></li>
									<li class="cl-fixnav-item loginout">
										<a href="javascript:void(0);" class="login"><span class="cl-fixnav-icon"></span><span class="cl-fixnav-name">LOGIN</span></a>
										<a href="javascript:void(0);" class="mypage dropdown-toggle" style="display: none;"><span class="cl-fixnav-icon"></span><span class="cl-fixnav-name">MY PAGE</span></a>
										<ul class="cl-fixsubnav-list dropdown-menu">
											<li class="cl-fixsubnav-item"><a href="javascript:void(0);"><span class="cl-fixsubnav-name">logout</span></a></li>
											<li class="cl-fixsubnav-item"><a href="javascript:void(0);"><span class="cl-fixsubnav-name">Biography</span></a></li>
											<li class="cl-fixsubnav-item"><a href="javascript:void(0);"><span class="cl-fixsubnav-name">Client</span></a></li>
											<li class="cl-fixsubnav-item"><a href="javascript:void(0);"><span class="cl-fixsubnav-name">History</span></a></li>
										</ul>
									</li>
									<li class="cl-fixnav-item cart">
										<a href="javascript:void(0);"><span class="cl-fixnav-icon"></span><span class="cl-fixnav-name">CART</span><span class="cl-fixnav-cart-active" data-cart-active="5"></span></a>
									</li>
									<li class="cl-fixnav-item slang">
										<a href="javascript:void(0);"><span class="cl-fixnav-icon">KO</span><span class="cl-fixnav-name"></span><span class="cl-fixnav-arrow"></span></a>
										<ul class="cl-fixsubnav-list dropdown-menu">
											<li class="cl-fixsubnav-item"><a href="javascript:void(0);"><span class="cl-fixsubnav-name">Overview</span></a></li>
											<li class="cl-fixsubnav-item"><a href="javascript:void(0);"><span class="cl-fixsubnav-name">Biography</span></a></li>
											<li class="cl-fixsubnav-item"><a href="javascript:void(0);"><span class="cl-fixsubnav-name">Client</span></a></li>
											<li class="cl-fixsubnav-item"><a href="javascript:void(0);"><span class="cl-fixsubnav-name">History</span></a></li>
										</ul>
									</li>
								</ul>
								<ul class="cl-nav-list">
									<li class="cl-nav-item"><a href="javascript:void(0);"><span class="cl-nav-name">Home</span></a></li>
									<li class="cl-nav-item"><a href="javascript:void(0);"><span class="cl-nav-name">Portfolio</span></a></li>
									<li class="cl-nav-item dropdown">
										<a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown"><span class="cl-nav-name">About</span> <i class="fa fa-caret-down"></i></a>
										<ul class="cl-subnav-list dropdown-menu">
											<li class="cl-subnav-item"><a href="javascript:void(0);"><span class="cl-subnav-name">Overview</span></a></li>
											<li class="cl-subnav-item"><a href="javascript:void(0);"><span class="cl-subnav-name">Biography</span></a></li>
											<!-- <li class="cl-subnav-item"><a href="javascript:void(0);"><span class="cl-subnav-name">Biography Bio gBiographyrwraphy 234</span></a></li> -->
											<li class="cl-subnav-item"><a href="javascript:void(0);"><span class="cl-subnav-name">Client</span></a></li>
											<li class="cl-subnav-item"><a href="javascript:void(0);"><span class="cl-subnav-name">History</span></a></li>
										</ul>
									</li>
									<li class="cl-nav-item"><a href="javascript:void(0);"><span class="cl-nav-name">Contact</span></a></li>
								</ul>
							</div>
						</div>

					</header>
				`,
				modooat: `
					<header class="cl-nav menu-kaa1910" data-by="mda" data-nav-style="1" data-subnav-style="1" data-fixnav-set-style="3" data-fixnav-lang-style="8">
						<input type="hidden" class="cl-nav-option" data-nowrap="true" data-sidemap="true" data-nav-align="left" data-fixnav-position="right" data-fixnav-size="large">

						<div class="cl-nav-section main">
							<div class="container">
								<a class="cl-nav-brand" href="/config" data-recommend="170 X 60">
									<img class="cl-nav-brand-image hide" src="http://storage.googleapis.com/i.addblock.net/template/menu_normal_1_logo.png" alt="ryan-holloway-273150001.jpg-sdf-sdf-a-sdf-asdfasfe23-234-ryan-holloway-273150001.jpg-sdf-sdf-a-sdf-asdfasfe23-234">
									<span class="cl-nav-brand-text">M A R K R O S S O U</span>
								</a>
								<ul class="cl-fixnav-list">
								</ul>
								<ul class="cl-nav-list">
									<li class="cl-nav-item"><a href="javascript:void(0);"><span class="cl-nav-name">Home</span></a></li>
									<li class="cl-nav-item"><a href="javascript:void(0);"><span class="cl-nav-name">Portfolio</span></a></li>
									<li class="cl-nav-item dropdown">
										<a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown"><span class="cl-nav-name">About</span><span class="cl-nav-child">3</span> <i class="fa fa-caret-down"></i></a>
										<ul class="cl-subnav-list dropdown-menu">
											<li class="cl-subnav-item"><a href="javascript:void(0);"><span class="cl-subnav-name">Overview</span></a></li>
											<li class="cl-subnav-item"><a href="javascript:void(0);"><span class="cl-subnav-name">Biography</span></a></li>
											<!-- <li class="cl-subnav-item"><a href="javascript:void(0);"><span class="cl-subnav-name">Biography Bio gBiographyrwraphy 234</span></a></li> -->
											<li class="cl-subnav-item"><a href="javascript:void(0);"><span class="cl-subnav-name">Client</span></a></li>
											<li class="cl-subnav-item"><a href="javascript:void(0);"><span class="cl-subnav-name">History</span></a></li>
										</ul>
									</li>
									<li class="cl-nav-item"><a href="javascript:void(0);"><span class="cl-nav-name">Contact</span></a></li>
								</ul>
							</div>
						</div>

						<div class="cl-nav-section sub">
						</div>
					</header>
				`
			};

			$.clnav.s = {
				sid: (PAGE_MODE == 'c') ? SID : property.SID,
				service: (PAGE_MODE == 'c') ? SERVICE : property.SERVICE,
				plan_is: (PAGE_MODE == 'c') ? VALIDPLAN : property.VALIDPLAN,
				plan_type: (PAGE_MODE == 'c') ? VALIDTYPE : property.VALIDTYPE,
				slang: (PAGE_MODE == 'c') ? SLANG : property.SLANG,
				um: (PAGE_MODE == 'c') ? SITEUM : property.SITEUM,
				um_lang: (PAGE_MODE == 'c') ? SITEUMLANG : property.SITEUMLANG,
				um_display: (PAGE_MODE == 'c') ? SITEUMDISPLAY : property.SITEUMDISPLAY,

				mem: (PAGE_MODE == 'c') ? {} : property.UMEMBER,

                view: (PAGE_MODE == 'c') ? VIEW : property.VIEW,
                view_parent: (PAGE_MODE == 'c') ? PARENT : property.PARENT,

				page: (PAGE_MODE == 'c') ? PAGE : property.PAGE,
				menuoption: (PAGE_MODE == 'c') ? MENUOPTION : property.MENUOPTION,
				smenucss: (PAGE_MODE == 'c') ? MCSS || {} : property.MCSS || {},
				mpage: (PAGE_MODE == 'c') ? MPAGE : property.MPAGE,
				url: {
					page: (PAGE_MODE == 'c') ? '/config/page/' : ((typeof property.PUBLISH != 'undefined' && property.PUBLISH) ? '/' : '/render/page/'),
					home: (PAGE_MODE == 'c') ? '/demo/' : ((typeof property.PUBLISH != 'undefined' && property.PUBLISH) ? '/' : '/render'),
				},

				checkConfig: (PAGE_MODE == 'c') ? true : false,
				checkGabia: false,
				checkFree: true,
				checkBS: false,
				checkBN: false,
				checkSM: false,
				checkLogin: false,
				checkAdmin: false,
				checkUadmin: false,
				checkGroot: false,
				// checkModoo: $('.cl-nav').is('[data-by="mda"]') ? true : false,
				checkModoo: (PAGE_MODE == 'c') ? !$.isEmptyObject(SETTINGS.modoo || {}) : !$.isEmptyObject(property.SETTINGS.modoo || {}),
				checkCLPage: false,
			}

			if($.clnav.s.checkConfig) $.clnav.s.url.home += $.clnav.s.sid;
			if($.clnav.s.view) $.clnav.s.mpage = $.clnav.s.view_parent.page;
			if($.clnav.s.service.indexOf('gabia') > -1) $.clnav.s.checkGabia = true;
			if($.clnav.s.plan_is && $.clnav.s.plan_type != 'PK') {
				$.clnav.s.checkFree = false;
				
				if($.clnav.s.plan_type == 'BS') $.clnav.s.checkBS = true;
				if($.clnav.s.plan_type == 'BN') $.clnav.s.checkBN = true;
				if($.clnav.s.plan_type == 'SM') $.clnav.s.checkSM = true;
			}
			if(typeof $.clnav.s.mem != 'undefined' && !$.isEmptyObject($.clnav.s.mem)) {
				$.clnav.s.checkLogin = $.clnav.s.mem.check_login;
				$.clnav.s.checkAdmin = $.clnav.s.mem.check_adm;
				$.clnav.s.checkUadmin = $.clnav.s.mem.check_uadm;
				$.clnav.s.checkGroot = $.clnav.s.mem.check_groot;
			}

			$.clnav.d = {
				isElViewer: false,
				isReload: $('.clnav-sidemobile').length > 0 ? true : false,

				eTraget: '',
				isMouseDown: false,
				isDrag: false,
				isTouch: false,
				startX: 0,
				startY: 0,
				scrollLeft: 0,
				scrollTop: 0,

				name: 'cl-nav',
				label: {
					wrap: '.el-menu',
					header: 'header.cl-nav',
					option: '.cl-nav-option',
					brand: '.cl-nav-brand',
					nav: '.cl-nav-list',
					navItem: '.cl-nav-item',
					navSpan: {
						name: '.cl-nav-name',
						child: '.cl-nav-child',
						caret: '.cl-nav-caret',
					},
					sub: '.cl-subnav-list',
					subItem: '.cl-subnav-item',
					fix: '.cl-fixnav-list',
					fixItem: '.cl-fixnav-item',
					fixSpan: {
						icon: '.cl-fixnav-icon',
						name: '.cl-fixnav-name',
					},
					section: {
						all: '.cl-nav-section',
						main: '.cl-nav-section.main',
						sub: '.cl-nav-section.sub',
					},
					sidemap: {
						openBtn:  '.cl-fixnav-item.sidemap',
						closeBtn:  '.clnav-sidemap-close',
						toggleCls: 'clnavSidemapOpen',
						modal: '.clnav-sidemap'
					},
					sidemobile: {
						openBtn:  '.cl-nav-toggle',
						closeBtn:  '.clnav-sidemobile-close',
						toggleCls: 'clnavSidemobileOpen',
						backdrop: '.clnav-sidemobile-backdrop',
						modal: '.clnav-sidemobile',
					},
					nowrap: {
						el: '.clnav-nowrap',
						target: '.clnav-nowrap-target',
						btn: '.clnav-nowrap-btn',
						prevBtn: '.clnav-nowrap-btn.prev',
						nextBtn: '.clnav-nowrap-btn.next',
					}
				},
				sample: {},
			};

			if(window.parent && window.parent != this && $('.elviewhtml').length > 0) {
				$.clnav.d.isElViewer = true;
				$.clnav.s.name = $('#el-list-image .elgrid.active', window.parent.document).find('.blockname-str').text().trim();
				$.clnav.s.sid = $.clnav.s.name.replace(/^menu\-/,'');
				$.clnav.d.label.wrap = '.elviewhtml';
			} else {
				$.clnav.d.name = `menu-${$.clnav.s.sid}`;
			}

			$.clnav.el = {};
			$.clnav.el.header = $(`${$.clnav.d.label.wrap} ${$.clnav.d.label.header}`);
			$.clnav.el.option = $.clnav.el.header.find($.clnav.d.label.option);
			$.clnav.el.brand = $.clnav.el.header.find($.clnav.d.label.brand);
			$.clnav.el.nav = $.clnav.el.header.find($.clnav.d.label.nav);
			$.clnav.el.fix = $.clnav.el.header.find($.clnav.d.label.fix);

			$.clnav.el.header.closest('html').addClass(`clroot clroot-${$.clnav.s.sid}`);

			/* ************************************************************************************************ */

			var _s = $.clnav.s,
				_d = $.clnav.d,
				_el = $.clnav.el;

			_s.checkCLPage = ($.inArray(_s.page, ['_login','_cllogin','_forgot','_nonmember','_register']) > -1) ? true : false;

			if($(`#menu-${_s.sid}`).length == 0) $('.dsgn-body').prepend(`<style id="menu-${_s.sid}">${CSSJSON.toCSS(_s.smenucss)}</style>`);
			else $(`#menu-${_s.sid}`).html(CSSJSON.toCSS(_s.smenucss));

			if(_s.checkModoo) {
				$('html').addClass('_scroll');

				_s.modoo = (_s.checkConfig) ? SETTINGS.modoo || {} : property.SETTINGS.modoo || {},

				// modoo.displaytype 위치변경
				// _s.modoo.displaytype = (_s.checkConfig) ? SETTINGS.displaytype : property.SETTINGS.displaytype;
				_s.modoo.sitename = (_s.checkConfig) ? TITLE : property.TITLE;
				$('.dsgn-body').addClass('modoo').attr('data-displaytype',_s.modoo.displaytype);
				_el.brand.find('.hide').removeClass('hide');
				_el.brand.attr('href',_s.url.home);
				_el.brand.find('.cl-nav-brand-image').attr('src',_s.modoo.logo);
				_el.brand.find('.cl-nav-brand-text').text(_s.modoo.sitename);
			}

			// smenu set
			_d.sample.nav = _el.nav.clone();
			_el.nav.empty();

			setSiteMenuOption();
			$.each(_s.menuoption, function(nav_i,nav_o) {
				var tmp_nav = {...nav_o, attr: `${nav_o.target} ${nav_o.isbookmark} ${nav_o.isflink}`, child_tag: ''};

				if(_s.checkModoo) {
					if(typeof nextPage !=='undefined' && typeof nav_o.cid !== 'undefined' && nextPage == nav_o.cid) tmp_nav.active = 'active';
				}

				$.each(nav_o.children, function(subnav_i, subnav_o) {
					var tmp_subnav = {...subnav_o, attr: `${subnav_o.target} ${subnav_o.isbookmark} ${subnav_o.isflink}`};
					tmp_nav.child_tag += `
						<li class="cl-subnav-item ${tmp_subnav.active}"><a href="${tmp_subnav.href}" ${tmp_subnav.attr}><span class="cl-subnav-name">${tmp_subnav.name}</span></a></li>
					`;
				});

				_el.nav.append(`
					<li class="cl-nav-item ${tmp_nav.active} ${tmp_nav.child_tag ? 'dropdown' : ''}">
						<a href="${tmp_nav.href}" ${tmp_nav.attr.trim()}>
							<span class="cl-nav-name">${tmp_nav.name}</span>
							${tmp_nav.child_tag ? `<span class="cl-nav-child">${nav_o.children.length}</span>` : ``}
						</a>
						${tmp_nav.child_tag ? `
						<ul class="cl-subnav-list dropdown-menu">
							${tmp_nav.child_tag}
						</ul>
							`: ``}
					</li>
				`);
			});

			if(_el.nav.is(':empty')) _el.nav.replaceWith(_d.sample.nav);
			if(_el.nav.find('.cl-nav-item:is(.active, .open), .cl-subnav-item.acitve').length == 0 && !_s.checkCLPage) _el.nav.find(_d.label.navItem).eq(0).addClass('active');

			if(_el.header.find('.cl-nav-section.sub').length > 0) {
				if(	_el.header.find(`${_d.label.navItem}.active`).is('.dropdown')
					|| _el.header.find(`${_d.label.subItem}.active`).length > 0
				) {
					var $tmp_sub = _el.header.find(`${_d.label.navItem}.active ${_d.label.sub}`).clone();
					if(_el.header.find(`${_d.label.subItem}.active`).length > 0) $tmp_sub = _el.header.find(`${_d.label.subItem}.active`).closest(_d.label.navItem).find(_d.label.sub).clone();
					$tmp_sub.removeClass('dropdown-menu');

					_el.header.find('.cl-nav-section.sub').html($tmp_sub.prop('outerHTML'));
				} else {
					_el.header.find('.cl-nav-section.sub').empty();
				}
			}

			if(_el.option.is('[data-nowrap="true"]') && !_d.isElViewer) {
				if(_el.header.find(`${$.clnav.d.label.nav}-nowrap`).length == 0) {
					_el.header.find($.clnav.d.label.nav).wrap(`<div class="${$.clnav.d.label.nav.replace(/\./g,' ')}-nowrap"></div>`);
				}

				_el.header.find(`${$.clnav.d.label.nav}-nowrap`).prepend(`<div class="clnav-nowrap-btn prev" style="display: none;">${clSVG('arrow_right',44,44,true)}</div>`);
				_el.header.find(`${$.clnav.d.label.nav}-nowrap`).append(`<div class="clnav-nowrap-btn next" style="display: none;">${clSVG('arrow_right',44,44,true)}</div>`);

				if(_s.checkModoo && $('.dsgn-body').is(`[data-displaytype="B"], [data-displaytype="C"]`)) {
					var $tmp_nav = null;
					if($('.dsgn-body').is(`[data-displaytype="B"]`)) {
						$tmp_nav = _el.header.find(`${$.clnav.d.label.nav}-nowrap`).clone();
						$tmp_nav.addClass('clnav-nowrap-el0 modoo-b');
					} else if($('.dsgn-body').is(`[data-displaytype="C"]`)) {
						$tmp_nav = $(`
							<div class="clnav-nowrap-el0 modoo-c">
								<div class="container">
									<div class="col left">
										<div class="sitename">${_s.modoo.sitename}</div>
										<div class="sitedesc">${_s.modoo.desc}</div>
									</div>
									<div class="col right">
										${_el.header.find($.clnav.d.label.nav).clone().prop('outerHTML')}
									</div>
								</div>
							</div>
						`);
					}

					if($tmp_nav != null) {
						$tmp_nav.find(_d.label.navItem).removeClass('dropdown').find('.cl-nav-child, .cl-subnav-list').remove();
						$('.element.modoo[data-pos="0"] .clnav-nowrap-el0').remove();
						$('.element.modoo[data-pos="0"]').append($tmp_nav);
					}
				}

				
			}
			_el.nav = $.clnav.el.header.find($.clnav.d.label.nav); //override el

			if(_el.option.is('[data-sidemap="true"]')) {
				var $tmp_sidemap_brand = _el.brand.clone(),
					$tmp_sidemap_nav = _el.nav.clone();

				$tmp_sidemap_brand.find('.cl-nav-brand-image').remove();
				$tmp_sidemap_nav.find(_d.label.nowrap.btn).remove();
				$tmp_sidemap_nav.find('.dropdown-menu').removeClass('dropdown-menu');
				$tmp_sidemap_nav.find('.dropdown > a > .fa').remove();
				$tmp_sidemap_nav.find('.dropdown > a').append(clSVG('arrow_down',14,14,true,'cl-nav-caret'));

				$('.clnav-sidemap').remove();
				$('.dsgn-body').after(`
					<div class="clnav-sidemap">
						<div class="clnav-sidemap-close">${clSVG('close_l',18,18,true)}</div>
						${$tmp_sidemap_brand.prop('outerHTML')}
						${$tmp_sidemap_nav.prop('outerHTML')}
					</div>
				`);
			}

			$.clnav.setFixnavStyle(_el.header);

            /* mobile */
            _el.header.find(_d.label.sidemobile.openBtn).html(clSVG('toggle',20,20,false));

			var $tmp_brand_sidemobile = _el.brand.clone(),
				$tmp_nav_sidemobile = _el.nav.clone(),
				tmp_depth_svg = (_s.checkModoo && $('.dsgn-body').is('[data-displaytype="B"],[data-displaytype="C"]')) ? 'toggle_arrow' : 'toggle_plusminus';
			
			$tmp_brand_sidemobile.find('.cl-nav-brand-text').remove();
			$tmp_nav_sidemobile.find(`${_d.label.nowrap.btn}, .cl-nav-child`).remove();
			$tmp_nav_sidemobile.find('.dropdown-menu').removeClass('dropdown-menu');
			$tmp_nav_sidemobile.find('.cl-nav-item.active.dropdown').addClass('open');
			$tmp_nav_sidemobile.find('.cl-nav-item.dropdown > a').append(clSVG(tmp_depth_svg,16,16,true,'cl-nav-depth'));
			$('.clnav-sidemobile-backdrop, .clnav-sidemobile').remove();
			$('.dsgn-body').after(`
				<div class="clnav-sidemobile-backdrop"></div>
				<div class="clnav-sidemobile">
					<div class="container">
						<div class="clnav-sidemobile-close">${clSVG('close_l',16,16,true)}</div>
						<div class="clnav-section info">
							<div class="section-area brand">
								${$tmp_brand_sidemobile.prop('outerHTML')}
							</div>
						</div>
						
						<div class="clnav-section menu">
							${$tmp_nav_sidemobile.prop('outerHTML')}
						</div>
					</div>
				</div>
			`);
			_el.sidemobile = $(_d.label.sidemobile.modal);

			if(_s.checkModoo) {
				$(_d.label.sidemobile.modal).attr('data-style','mda');

				_s.modoo.mobile_btns = `
					<li class="login siteUM"><a class="login" href="javascript:;"><span class="item-icon">${clSVG('login',26,28,false)}</span><span class="item-label">로그인</span></a></li>
					<li class="logout siteUM" style="display:none;"><a class="logout" href="javascript:;"><span class="item-icon">${clSVG('login',26,28,false)}</span><span class="item-label">로그아웃</span></a></li>
				`;
				_el.floating = $('.floating_item.modoo').eq(0);
				_el.floating.find('li a').each(function(e) {
					if($(this).data('type') == 'top') return true;
					
					var tmp_a = {
						type: $(this).data('type'),
						name: $(this).data('name'),
						data: $(this).data('data'),
						cid: $(this).data('cid'),
						href: $(this).attr('href'),					
						icon: $(this).find('.icon').attr('class').match(/icon(\d+)/)[1],
					};
					// console.log(tmp_a.data);
					if(tmp_a.type == 'defaultPhone') {
						tmp_a.href = `tel:${(!_s.checkConfig && typeof property != 'undefined'  && typeof property.TEL_LINK != 'undefined') ? property.TEL_LINK : tmp_a.data}`;
					} else if(tmp_a.type == 'phone') {
						tmp_a.href = `tel:${tmp_a.data}`;
					} else if(tmp_a.type == 'page_move') {
						tmp_a.href = (tmp_a.href != tmp_a.data) ? (tmp_a.data == '홈') ? `/` : `${tmp_a.href}` : `${_s.url.page}${tmp_a.data}`; 
					} else if(tmp_a.type == 'email') {
						tmp_a.href = `mailto:${tmp_a.data}`;
					} else if(tmp_a.type == 'link') {
						tmp_a.href = tmp_a.data;
						if(tmp_a.href.includes('pf.kakao')) tmp_a.href = 'https://' + tmp_a.href;
					} else if (tmp_a.type == "reservation"){
						tmp_a.href = tmp_a.data;
					} else if (tmp_a.type=="talkLink"){
						tmp_a.href = '';
					} else if (tmp_a.type=="sms"){
						tmp_a.href = (tmp_a.data) ? 'tel:'+tmp_a.data : '';
					}
	  
					if(tmp_a.href == '#') tmp_a.href = 'javascript:void(0);';

					_s.modoo.mobile_btns += `
						<li class="${tmp_a.type}">
							<a href="${tmp_a.href}" data-type="${tmp_a.type}"><span class="item-icon btn_ic${tmp_a.icon}"><i class="ic"></i></span><span class="item-label">${tmp_a.name}</span></a>
						</li>
					`;
				});

				_s.modoo.mobile_company = `
						<dl>
							<dt class="item_title _businessTitleArea">사업자정보<a href="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=8264900508" taget="_blank" class="link_confirm">사업자정보 확인</a></dt>
							<dd class="item_description _businessArea">
								<span class="text"><span class="sub_title">상호</span><span class="sub_text">잠빌펜션</span></span>
								<span class="text"><span class="sub_title">대표자</span><span class="sub_text">정용준</span></span>
								<span class="text"><span class="sub_title">사업자번호</span><span class="sub_text">826-49-00508</span></span>
								<span class="text"><span class="sub_title">통신판매번호</span><span class="sub_text">제2020-강원춘천-0214호</span></span>
								<span class="text"><span class="sub_title">이메일</span><span class="sub_text">jjyyjj1@nate.com</span></span>
							</dd>
							<dt class="item_title _bankTitleArea">입금계좌</dt>
							<dd class="item_description _bankArea">
								<span class="text text_bank"><span class="sub_title">예금주</span><span class="sub_text">잠빌(정용준)</span></span>
								<span class="text text_bank"><span class="sub_title">농협</span><span class="sub_text">351-1105-0693-23</span></span>
								<span class="text text_notice">사업자정보를 꼭 확인 후 이체하세요 <a href="https://m.search.naver.com/search.naver?sm=tab_sug.top&amp;where=m&amp;ie=utf8&amp;query=%EC%9D%B8%ED%84%B0%EB%84%B7+%EC%82%AC%EA%B8%B0%EC%A1%B0%ED%9A%8C" target="_blank" class="link_confirm">계좌 신고여부</a></span>
							</dd>
						</dl>
						<div class="btn"></div>
				`;
				_s.modoo.mobile_company = '';

				$(`${_d.label.sidemobile.modal} .section-area.brand`).after(`
					<div class="section-area title">
						${(typeof _s.modoo.category != 'undefined' && _s.modoo.category) ? `<span class="category">${_s.modoo.category}</span>` : ''}
						<span class="hometitle">${_s.modoo.sitename}</span>
						<span class="description">${_s.modoo.desc}</span>
					</div>
					<ul class="section-area btns">
						${_s.modoo.mobile_btns}
					</ul>
					<div class="section-area company">
						${_s.modoo.mobile_company}
					</div>
				`);
			}

			$.clnav.set();
		},
		setNowrapBtn: function(selector) {
			if(typeof selector == 'undefined' || !selector) return;
			var _d = $.clnav.d;

			var tmpTarget = document.querySelector(selector);
			if(tmpTarget) {
				var maxScrollLeft = tmpTarget.scrollWidth - tmpTarget.clientWidth;

				if($(selector).prev().is(_d.label.nowrap.prevBtn)) {
					$(selector).prev().css('display',tmpTarget.scrollLeft <= 0 ? 'none' : 'block');
				}
				if($(selector).next().is(_d.label.nowrap.nextBtn)) {
					$(selector).next().css('display',tmpTarget.scrollLeft >= maxScrollLeft ? 'none' : 'block');
				}
			}
		},
		getFixnavLangList: function(slang) {
			if(slang.lists.length < 2) return '';
			
			var str = '';
			$.each(slang.lists, function(i,o) {
				str += `<li class="cl-fixsubnav-item ${(o.code == slang.select_code) ? 'active' : ''}"><a href="javascript:;" data-code="${o.code}"><span class="cl-fixsubnav-name">${o.name}</span></a></li>`;
			});
			
			return `
				<ul class="cl-fixsubnav-list dropdown-menu">
					${str}
				</ul>
			`;
		},
		setFixnavUMlist: function(smem) {
			var sample_str = `
				<ul class="cl-fixsubnav-list dropdown-menu">
					<li class="cl-fixsubnav-item"><a class="dashboard" href="javascript:void(0);"><span class="cl-fixsubnav-name">${$.lang[LANG]['manager.site-um.dashboard']}</span></a></li>
					<li class="cl-fixsubnav-item"><a class="member" href="javascript:void(0);"><span class="cl-fixsubnav-name">${$.lang[LANG]['manager.site-um.manage']}</span></a></li>
					<li class="cl-fixsubnav-item"><a class="logout" href="javascript:void(0);"><span class="cl-fixsubnav-name">${$.lang[LANG]['manager.site-um.logout']}</span></a></li>
				</ul>
			`;

			if(typeof smem == 'undefined') smem = {};

			var tmp_page = (PAGE_MODE == 'c') ? PAGE : property.PAGE;

			var str = '',
				um_list = {
					dashboard: {},
					manage: {},
					logout: {},
				};

			$.each(um_list, function(k,o) { 
				str += `<li class="cl-fixsubnav-item ${(tmp_page == k) ? 'active' : ''}"><a href="javascript:;" data-um="${k}"><span class="cl-fixsubnav-name">${o.name || $.lang[LANG][`manager.site-um.${k}`] || k}</span></a></li>`;
			});

			return `
				<ul class="cl-fixsubnav-list dropdown-menu">
					${str}
				</ul>
			`;
		},
		setFixnavStyle: function(thisHeader) {
			if(thisHeader.length == 0) return;

			var _slang = (PAGE_MODE == 'c') ? SLANG : property.SLANG;

			var checkCtrlNavMode = thisHeader.hasClass('cl-sample'),
				sample_fixnav = {
					sidemap: `
						<li class="cl-fixnav-item sidemap"><a href="javascript:void(0);"><span class="cl-fixnav-icon"></span><span class="cl-fixnav-name">ALL</span></a></li>
					`,
					search: `
						<li class="cl-fixnav-item search"><a href="javascript:void(0);"><span class="cl-fixnav-icon"></span><span class="cl-fixnav-name">SEARCH</span></a></li>
					`,
					loginout: `
						<li class="cl-fixnav-item loginout">
							<a href="javascript:void(0);" class="login"><span class="cl-fixnav-icon"></span><span class="cl-fixnav-name">LOGIN</span></a>
							<a href="javascript:void(0);" class="logout dropdown-toggle" style="display: none;"><span class="cl-fixnav-icon"></span><span class="cl-fixnav-name">LOG OUT</span></a>
							<a href="javascript:void(0);" class="mypage dropdown-toggle" style="display: none;"><span class="cl-fixnav-icon"></span><span class="cl-fixnav-name">MY PAGE</span></a>
							<ul class="cl-fixsubnav-list dropdown-menu">
								<li class="cl-fixsubnav-item"><a href="javascript:void(0);"><span class="cl-fixsubnav-name">Overview</span></a></li>
								<li class="cl-fixsubnav-item"><a href="javascript:void(0);"><span class="cl-fixsubnav-name">Biography</span></a></li>
								<li class="cl-fixsubnav-item"><a href="javascript:void(0);"><span class="cl-fixsubnav-name">Client</span></a></li>
								<li class="cl-fixsubnav-item"><a href="javascript:void(0);"><span class="cl-fixsubnav-name">History</span></a></li>
							</ul>
						</li>
					`,
					cart: `
						<li class="cl-fixnav-item cart">
							<a href="javascript:void(0);"><span class="cl-fixnav-icon"></span><span class="cl-fixnav-name">CART</span><span class="cl-fixnav-cart-active" data-cart-active="5"></span></a>
						</li>
					`,
					lang: `
						<li class="cl-fixnav-item lang">
							<a href="javascript:void(0);"><span class="cl-fixnav-icon">KO</span><span class="cl-fixnav-name"></span><span class="cl-fixnav-arrow"></span></a>
							<ul class="cl-fixsubnav-list dropdown-menu">
								<li class="cl-fixsubnav-item"><a href="javascript:void(0);"><span class="cl-fixsubnav-name">Overview</span></a></li>
								<li class="cl-fixsubnav-item"><a href="javascript:void(0);"><span class="cl-fixsubnav-name">Biography</span></a></li>
								<li class="cl-fixsubnav-item"><a href="javascript:void(0);"><span class="cl-fixsubnav-name">Client</span></a></li>
								<li class="cl-fixsubnav-item"><a href="javascript:void(0);"><span class="cl-fixsubnav-name">History</span></a></li>
							</ul>
						</li>
					`,
				};


			var sample_tag = `
                    <li class="cl-fixnav-item search"><a href="javascript:void(0);"><span class="cl-fixnav-icon"></span><span class="cl-fixnav-name">SEARCH</span></a></li>
                    <li class="cl-fixnav-item loginout">
                        <a href="javascript:void(0);" class="login"><span class="cl-fixnav-icon"></span><span class="cl-fixnav-name">LOGIN</span></a>
                        <a href="javascript:void(0);" class="logout dropdown-toggle" style="display: none;"><span class="cl-fixnav-icon"></span><span class="cl-fixnav-name">LOG OUT</span></a>
                        <a href="javascript:void(0);" class="mypage dropdown-toggle" style="display: none;"><span class="cl-fixnav-icon"></span><span class="cl-fixnav-name">MY PAGE</span></a>
                        <ul class="cl-fixsubnav-list dropdown-menu">
                            <li class="cl-fixsubnav-item"><a href="javascript:void(0);"><span class="cl-fixsubnav-name">Overview</span></a></li>
                            <li class="cl-fixsubnav-item"><a href="javascript:void(0);"><span class="cl-fixsubnav-name">Biography</span></a></li>
                            <li class="cl-fixsubnav-item"><a href="javascript:void(0);"><span class="cl-fixsubnav-name">Client</span></a></li>
                            <li class="cl-fixsubnav-item"><a href="javascript:void(0);"><span class="cl-fixsubnav-name">History</span></a></li>
                        </ul>
                    </li>
                    <li class="cl-fixnav-item cart">
                        <a href="javascript:void(0);"><span class="cl-fixnav-icon"></span><span class="cl-fixnav-name">CART</span><span class="cl-fixnav-cart-active" data-cart-active="5"></span></a>
                    </li>
                    <li class="cl-fixnav-item lang">
                        <a href="javascript:void(0);"><span class="cl-fixnav-icon">KO</span><span class="cl-fixnav-name"></span><span class="cl-fixnav-arrow"></span></a>
                        <ul class="cl-fixsubnav-list dropdown-menu">
                            <li class="cl-fixsubnav-item"><a href="javascript:void(0);"><span class="cl-fixsubnav-name">Overview</span></a></li>
                            <li class="cl-fixsubnav-item"><a href="javascript:void(0);"><span class="cl-fixsubnav-name">Biography</span></a></li>
                            <li class="cl-fixsubnav-item"><a href="javascript:void(0);"><span class="cl-fixsubnav-name">Client</span></a></li>
                            <li class="cl-fixsubnav-item"><a href="javascript:void(0);"><span class="cl-fixsubnav-name">History</span></a></li>
                        </ul>
                    </li>
			`

			var thisOption = thisHeader.find('.cl-nav-option'),
				thisFixnav = thisHeader.find('.cl-fixnav-list'),
				fixnav_set_style = thisHeader.attr('data-fixnav-set-style'),
				fixnav_lang_style = thisHeader.attr('data-fixnav-lang-style');

			var fixobj = {
				sidemap: { name:'전체보기', icon:clSVG('toggle_s',13,11) },
				search:	{ name:'search', icon:'' },
				login:	{ name:'login', icon:'' },
				logout:	{ name:'logout', icon:'' },
				// mypage:	{ name:'my page', icon:'', list: $.clnav.setFixnavUMlist() },
				cart:	{ name:'cart', icon:'' },
				lang:	{ name:'', icon:'', arrow:'', icon_cls:[] },
			};

			if(!thisOption.is('[data-sidemap="true"]')) delete fixobj.sidemap;

			switch(fixnav_set_style) {
				case '2':
					fixobj.cart.name = 'basket';
					break;

				case '3':
					fixobj.search.name = '검색';
					fixobj.login.name = '로그인';
					fixobj.logout.name = '로그아웃';
					// fixobj.mypage.name = '마이페이지';
					fixobj.cart.name = '장바구니';
					break;

				case '4':
				case '5':
				case '6':
				case '7':
				case '8':
					var tmp_size = 28;
					fixobj.search.icon = clSVG('fixbtn_search'+fixnav_set_style,tmp_size,tmp_size);
					fixobj.login.icon = clSVG('fixbtn_um_login'+fixnav_set_style,tmp_size,tmp_size);
					fixobj.logout.icon = clSVG('fixbtn_um_mypage'+fixnav_set_style,tmp_size,tmp_size);
					// fixobj.mypage.icon = clSVG('fixbtn_um_mypage'+fixnav_set_style,tmp_size,tmp_size);
					fixobj.cart.icon = clSVG('fixbtn_cart'+fixnav_set_style,tmp_size,tmp_size);

					if($.inArray(fixnav_set_style, ['4','5','6','7']) > -1) { // only icon
						fixobj.search.name = '';
						fixobj.login.name = '';
						fixobj.logout.name = '';
						// fixobj.mypage.name = '';
						fixobj.cart.name = '';
					}
					break;
				case '9':
					fixobj.search.name = '검색';
					fixobj.login.name = '로그인';
					fixobj.cart.name = '';
					fixobj.cart.icon = clSVG('fixbtn_cart9',28,28);
					break;
				case '10':
					fixobj.search.name = '';
					fixobj.search.icon = clSVG('fixbtn_search10',28,28);
					fixobj.cart.name = '';
					fixobj.cart.icon = clSVG('fixbtn_cart9',28,28);
					break;

				default:
					break;
			}

			if(checkCtrlNavMode || $.clnav.d.isElViewer) {
				_slang = {select:'한국어',select_code:'ko', use_language:'on', lists:{code:'ko',name:'한국어'}};
			}

			fixobj.lang.name = _slang.select_code;
			fixobj.lang.arrow = clSVG('fixbtn_arrow',16,16,true);
			if(typeof _slang != 'undefined' && typeof _slang.lists !='undefined' && _slang.lists.length > 1) fixobj.lang.list = $.clnav.getFixnavLangList(_slang);

			switch(fixnav_lang_style) {
				case '2':
					fixobj.lang.name = $.lang[LANG][`editor.languages-${_slang.select_code}`];
					break;
				case '5':
					fixobj.lang.icon = clSVG(`fixbtn_lang5`,16,16,true);
					fixobj.lang.name = '';
					fixobj.lang.arrow = '';
					break;
				case '6':
					fixobj.lang.icon = clSVG(`fixbtn_lang5`,16,16,true);
					fixobj.lang.arrow = '';
					break;
				case '7':
					fixobj.lang.icon = '<div class="cl-fixnav-icon-img"></div>';
					fixobj.lang.icon_cls.push('circle');
					fixobj.lang.name = $.lang[LANG][`editor.languages-${_slang.select_code}`];
					break;
				case '8':
					fixobj.lang.icon = '<div class="cl-fixnav-icon-img"></div>';
					fixobj.lang.name = $.lang[LANG][`editor.languages-${_slang.select_code}`];
					break;
				case '9':
					fixobj.lang.icon = '<div class="cl-fixnav-icon-img"></div>';
					fixobj.lang.icon_cls.push('circle');
					fixobj.lang.name = '';
					fixobj.lang.arrow = '';
					break;
				case '10':
					fixobj.lang.arrow = '';
					break;
				case '11':
					fixobj.lang.icon = '<div class="cl-fixnav-icon-img"></div>';
					fixobj.lang.name = '';
					fixobj.lang.arrow = '';
					break;
				default:
					break;
			}

			var checkEmpty = thisFixnav.children().length == 0 ? true : false;
			$.each(fixobj, function(fixnav_k, fixnav_o) {
				if(	(checkCtrlNavMode && thisHeader.closest(`[data-sample="fixnav-${(fixnav_k == 'lang') ? 'lang' : 'set'}"]`).length == 0)
				) {
					return;
				}

				var tmp_sample_k = ($.inArray(fixnav_k, ['login','logout','mypage']) > -1) ? `loginout` : fixnav_k;
				if(thisFixnav.find(`.cl-fixnav-item.${tmp_sample_k}`).length == 0) {
					if(checkEmpty) thisFixnav.append(sample_fixnav[tmp_sample_k]);
					else return;
				}

				var tmp_k = ($.inArray(fixnav_k, ['login','logout','mypage']) > -1) ? `.loginout .${fixnav_k} ` : `.${fixnav_k}`;
				thisFixnav.find(`.cl-fixnav-item${tmp_k} .cl-fixnav-icon`).html(fixnav_o.icon);
				if(typeof fixnav_o.icon_cls != 'undefined' && fixnav_o.icon_cls.length > 0) thisFixnav.find(`.cl-fixnav-item${tmp_k} .cl-fixnav-icon`).addClass(fixnav_o.icon_cls.join(' '));
				thisFixnav.find(`.cl-fixnav-item${tmp_k} .cl-fixnav-name`).html(fixnav_o.name);				
				if(fixnav_k == 'lang') thisFixnav.find(`.cl-fixnav-item${tmp_k} .cl-fixnav-arrow`).html(fixnav_o.arrow);

				if(typeof fixnav_o.list != 'undefined' && fixnav_o.list) {
					thisFixnav.find(`.cl-fixnav-item.${tmp_sample_k} .${$(fixnav_o.list).attr('class').replace(/ /g,'.')}`).remove();
					thisFixnav.find(`.cl-fixnav-item.${tmp_sample_k}`).append(fixnav_o.list);
				}
			});
		}
	}


});