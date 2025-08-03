(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Datepickk"] = factory();
	else
		root["Datepickk"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(1);

function Datepickk(args) {
	Datepickk.numInstances = (Datepickk.numInstances || 0) + 1;
	var that = this;
	var eventName = 'click';
	var selectedDates = [];

	var currentYear = new Date().getFullYear();
	var currentMonth = new Date().getMonth() + 1;

	var languages = {
		no: {
			monthNames: ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'],
			dayNames: ['sø', 'ma', 'ti', 'on', 'to', 'fr', 'lø'],
			weekStart: 1
		},
		se: {
			monthNames: ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'],
			dayNames: ['sö', 'må', 'ti', 'on', 'to', 'fr', 'lö'],
			weekStart: 1
		},
		ru: {
			monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
			dayNames: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
			weekStart: 1
		},
		en: {
			year: 'Year',
			month: 'Month',
			monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			weekStart: 0
		},
		de: {
			monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
			dayNames: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
			weekStart: 1
		},
		ko: {
			year: '년도',
			month: '월',
			monthNames: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
			dayNames: ['일', '월', '화', '수', '목', '금', '토'],
			weekStart: 0
		},
	};

	/*Language aliases*/
	languages.nb = languages.no;
	languages.nn = languages.no;

	var range = false;
	var maxSelections = null;
	var container = document.body;
	var opened = false;
	var months = 1;
	var closeOnSelect = false;
	var button = null;
	var title = null;
	var onNavigation = null;
	var onClose = null;
	var onConfirm = null;
	var closeOnClick = true;
	var inline = false;
	var lang = 'ko';
	var onSelect = null;
	var disabledDates = [];
	var disabledDays = [];
	var highlight = [];
	var daynames = true;
	var today = true;
	var startDate = null;
	var minDate = null;
	var maxDate = null;
	var weekStart = null;
	var locked = false;
	var exp = false;

	var clickCheck = 0;
	var firstCheck = false;
    var startCheckPoint = true;
    var startCheck = true;
    var endCheckPoint = true;
    var endCheck = true;
	
	function generateDaynames() {
		that.el.days.innerHTML = '';
		var ws = (weekStart !== null) ? weekStart : languages[lang].weekStart;
		if(daynames){
			for(var x = 0;x<months && x<3;x++){
				var weekEl = document.createElement('div');
					weekEl.setAttribute('class','d-week');
				for(var i = 0; i < 7;i++){
					var dayNameIndex = (i + ws > languages[lang].dayNames.length - 1) ? i + ws - languages[lang].dayNames.length : i + ws;

					var dayEl = document.createElement('div');
					var	dayTextEl = document.createElement('p');
						dayTextEl.innerHTML = languages[lang].dayNames[dayNameIndex];

						dayEl.appendChild(dayTextEl);
						weekEl.appendChild(dayEl);
				}

				that.el.days.appendChild(weekEl);
			}
		}
	}

	function generateYears() {
		[].slice.call(that.el.yearPicker.childNodes).forEach(function (node, index) {
			node.innerHTML = "'" + (currentYear + parseInt(node.getAttribute('data-year'))).toString().substring(2, 4);
		});
		
		var minYear = new Date().getFullYear();
		var maxYear = new Date().getFullYear();
		var minMonth = new Date().getMonth() + 1;
		var maxMonth = new Date().getMonth() + 1;

		if(that.minDate && that.maxDate) {
			minYear = new Date(that.minDate).getFullYear();
			maxYear = new Date(that.maxDate).getFullYear();
			minMonth = new Date(that.minDate).getMonth() + 1;
			maxMonth = new Date(that.maxDate).getMonth() + 1;
		}

		[].slice.call(that.el.newYearPicker.childNodes).forEach(function (node, index) {
			var y = (CURRENT_YEAR + parseInt(node.getAttribute('data-year'))).toString();
			if(that.minDate && that.maxDate) {
				if(parseInt(y) < minYear || parseInt(y) > maxYear) {
					$(node).addClass('hide');
				}
			}
			node.innerHTML = y;
			node.setAttribute('data-fullYear', y);
		});

		[].slice.call(that.el.newMonthPicker.childNodes).forEach(function (node, index) {
			if(that.minDate && that.maxDate) {
				var cMonth = Number($(node).attr('data-month'));
				if(minYear == maxYear) {
					if(cMonth < minMonth || cMonth > maxMonth) {
						$(node).addClass('hide');
					}
				} else {
					if(currentYear == minYear) {
						if(cMonth < minMonth) {
							$(node).addClass('hide');
						} else {
							$(node).removeClass('hide');
						}
					} else if(currentYear == maxYear) {
						if (cMonth > maxMonth) {
							$(node).addClass('hide');
						} else {
							$(node).removeClass('hide');
						}
					} else {
						$(node).removeClass('hide');
					}
				}
			}
		});
	}

	function generateInputs(exp, range) {
		if(typeof exp == "undefined") exp = false;
		if(typeof range == "undefined") range = false;
		that.el.tables.innerHTML = '';
		var blocklang = $('.term-setting').attr('data-blocklang');
		if(blocklang === undefined || !blocklang) blocklang = 'ko';
		for (var x = 0; x < months; x++) {
			var container = document.createElement('div');
			container.setAttribute('class', 'd-table');
			for (var i = 0; i < 42; i++) {
				var input = document.createElement('input');
				input.type = 'checkbox';
				input.name = 'checkbox[]';
				input.classList.add('term-calendar');
				input.id = Datepickk.numInstances + '-' + x + '-d-day-' + i;
				input.classList.add('date-pick-input');
				var label = document.createElement('label');
				label.setAttribute("for", Datepickk.numInstances + '-' + x + '-d-day-' + i);

				var text = document.createElement('text');

				container.appendChild(input);
				container.appendChild(label);

				label.appendChild(text);
				
				input.addEventListener(eventName, function (event) {
					if(range) {
						$('.term-calendar-box .d-tables input').removeClass('inRange');
						if (clickCheck == 0) {
							checkBoxAllFalse();
							firstCheck = true;
							this.checked = true;
							this.classList.add('etc-active');
							document.querySelector('#etc-start-date-txt').value = this.dataset.term_date;
							clickCheck++;

							var checkStartDate = this.dataset.term_date.split('.');
							var checkStart = new Date(checkStartDate[0], (checkStartDate[1] * 1) - 1, checkStartDate[2]);
							$('.term-setting .start-date').text('');
							$('.term-setting .end-date').text('');
							$('.term-setting').removeClass('hide');
							// console.log('blocklang', blocklang); 
                    		if(blocklang == 'ko') {
								$('.term-setting .start-date').text(checkStartDate[0]+'년 '+checkStartDate[1]+'월 '+checkStartDate[2]+' 일');
                    		} else {
                    			$('.term-setting .start-date').text(checkStartDate[1]+'/'+checkStartDate[2]+'/'+checkStartDate[0]);
                    		}
							return false;
						} else if (clickCheck == 1) {
							clickCheck = -1;
							this.checked = true;
							var termCalendar = document.querySelectorAll('.term-calendar');
							for (var i=0;i<termCalendar.length;i++) {
								var ele = termCalendar[i];
								
								if (ele.classList.contains('etc-active') === true) {
									ele.classList.add('etc-start-active');
									ele.classList.add('etc-select-active');
									ele.classList.remove('etc-active');
								}

								if (ele.classList.contains('etc-end-active') === true) {
									ele.classList.remove('etc-select-active');
									ele.classList.remove('etc-end-active');
								}
							} 
							
							this.classList.add('etc-select-active');
							this.classList.add('etc-end-active');

							document.querySelector('#etc-end-date-txt').value = this.dataset.term_date;

							var startDate = document.querySelector('#etc-start-date-txt').value;
							var endDate = document.querySelector('#etc-end-date-txt').value;
							var checkStartDate = startDate.split('.');
							var checkEndDate = endDate.split('.');
							var checkStart = new Date(checkStartDate[0], (checkStartDate[1] * 1) - 1, checkStartDate[2]);
							var checkEnd = new Date(checkEndDate[0], (checkEndDate[1] * 1) - 1, checkEndDate[2]);
							var temp = '';
							if (checkStart.getTime() > checkEnd.getTime()) {
								temp = document.querySelector('#etc-start-date-txt').value;
								document.querySelector('#etc-start-date-txt').value = document.querySelector('#etc-end-date-txt').value;
								document.querySelector('#etc-end-date-txt').value = temp;

								var termCalendar = document.querySelectorAll('.term-calendar')
								for (var i=0;i<termCalendar.length;i++) {
									var ele = termCalendar[i];
									if (ele.classList.contains('etc-start-active') === true) {
										ele.classList.add('etc-end-active');
										ele.classList.remove('etc-start-active');
									} else if (ele.classList.contains('etc-end-active') === true) {
										ele.classList.add('etc-start-active');
										ele.classList.remove('etc-end-active');
									}
								}

								startDate = document.querySelector('#etc-start-date-txt').value;
								endDate = document.querySelector('#etc-end-date-txt').value;
								checkStartDate = startDate.split('.');
								checkEndDate = endDate.split('.');
							}
				
							if(startDate && endDate) {
								var startDateObj = new Date(startDate.replace(/\./g,'/'));
								var endDateObj = new Date(endDate.replace(/\./g,'/'));
								
								$('.term-calendar-box .d-tables input').each(function (i, v) {
									var dateObj = new Date($(v).attr('data-term_date').replace(/\./g,'/'));
									// console.log(startDateObj, endDateObj, dateObj)
									if(dateObj > startDateObj  && dateObj < endDateObj && !$(v).is(':disabled')) $(v).addClass('inRange');
								});
							}

                    		$('.term-setting').removeClass('hide');
                    		if(blocklang == 'ko') {
								$('.term-setting .start-date').text(checkStartDate[0]+'년 '+checkStartDate[1]+'월 '+checkStartDate[2]+' 일');
								$('.term-setting .end-date').text(checkEndDate[0]+'년 '+checkEndDate[1]+'월 '+checkEndDate[2]+' 일');
                    		} else {
                    			$('.term-setting .start-date').text(checkStartDate[1]+'/'+checkStartDate[2]+'/'+checkStartDate[0]);
								$('.term-setting .end-date').text(checkEndDate[1]+'/'+checkEndDate[2]+'/'+checkEndDate[0]);
                    		}
						} else clickCheck = 0;
						clickCheck++;
					} else {
						if(exp == false) {
							dataCheck();
							this.classList.add('active');
							this.checked = true;
							var selectedDate = this.dataset.term_date;
							if(document.querySelector('#select-date-ymd')) {
								document.querySelector('#select-date-ymd').value = selectedDate;
								getDateTimeStr(blocklang, 'calendar');
							}
						} else {
							this.classList.toggle('active');
						}
						
						var date = this.dataset.date;
						var startCheck = this.parentNode.parentNode.parentNode.parentNode.parentNode.classList.contains('etc-start-date-picker'),
							endCheck = this.parentNode.parentNode.parentNode.parentNode.parentNode.classList.contains('etc-end-date-picker');

			            // document.querySelector('#etc-start-date-txt').classList.remove('active');
			            // document.querySelector('#etc-end-date-txt').classList.remove('active');

						if (startCheck) {
							document.querySelector('#etc-start-date-txt').value = date;
							document.querySelector('#etc-start-date-picker').style.display = 'none';
							document.querySelector('#etc-end-date-picker').style.display = 'block';
							// if(typeof exceptPicker != "undefined")
							// 	exceptPicker.generateDates(true);
							checkCalendarClick = false;

							setSelectedDates(date,'start');
							var i = 0;
							var width = 0;
							$('#etc-end-date-picker .Datepickk .d-table input + label').each(function () {
								if (i == 0) width = $(this).width();
								$(this).css('height', width+'px');
								i++;
							});
							var i = 0;
							var width = 0;
							$('#etc-start-date-picker .Datepickk .d-table input + label').each(function () {
								if (i == 0) width = $(this).width();
								$(this).css('height', width+'px');
								i++;
							});
						} else if(endCheck) {
							document.querySelector('#etc-end-date-txt').value = date;
							document.querySelector('#etc-end-date-picker').style.display = 'none';
							// if(typeof exceptPicker != "undefined")
							// 	exceptPicker.generateDates(true);
							checkCalendarClick = true;
							setSelectedDates(date,'end');
						} else {
							if(this.nextElementSibling.classList == 'exp') {
								getSelectedDates(date);
								checkCalendarClick = false;
							} else {
								return false;
							}
						}

						var startDate = $('#etc-start-date-txt').val();
						var endDate = $('#etc-end-date-txt').val();

						var checkStartDate = startDate.split('.');
						var checkEndDate = endDate.split('.');
						var checkStart = new Date(checkStartDate[0], (checkStartDate[1] * 1) - 1, checkStartDate[2]);
						var checkEnd = new Date(checkEndDate[0], (checkEndDate[1] * 1) - 1, checkEndDate[2]);
						if (checkStart.getTime() > checkEnd.getTime()) {
							$('#etc-end-date-txt').val(startDate);
							if(typeof exceptPicker != "undefined")
								exceptPicker.generateDates(true);
								setSelectedDates(startDate,'end');
							//return false;
						}

						
					}
				});
			}

			that.el.tables.appendChild(container);
		}

		that.el.tables.addEventListener('mouseover', highlightLegend);
		that.el.tables.addEventListener('mouseout', highlightLegend);

		function highlightLegend(e) {
			if (e.target.nodeName !== 'LABEL') return;

			var legendIds = e.target.getAttribute('data-legend-id') ? e.target.getAttribute('data-legend-id').split(' ') : [];
			if (!legendIds.length) return;

			legendIds.forEach(function (legendId) {
				var element = that.el.legend.querySelector('[data-legend-id="' + legendId + '"]');
				if (e.type == 'mouseover' && element) {
					var color = element.getAttribute('data-color') ? hexToRgb(element.getAttribute('data-color')) : null;
					element.setAttribute('style', 'background-color:rgba(' + color.r + ',' + color.g + ',' + color.b + ',0.35);');
				} else if (element) {
					element.removeAttribute('style');
				}
			});

			function hexToRgb(hex) {
				var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
				return result ? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16)
				} : null;
			}
		}
	}

	function dataCheck () {
		var date = document.querySelectorAll('.date-pick-input');
		for (var i=0; i<date.length;i++) {
			var ele = date[i];
			ele.classList.remove('active');
			ele.checked = false;
		}
	}

	function checkBoxAllFalse () {
		var termCalendar = document.querySelectorAll('.term-calendar')
		for (var i=0;i<termCalendar.length;i++) {
			var ele = termCalendar[i];
			ele.classList.remove('etc-active');
			ele.classList.remove('etc-start-active');
			ele.classList.remove('etc-end-active');
			ele.checked = false;
		}
	}

	function generateLegends() {
		var start = new Date(that.el.tables.childNodes[0].childNodes[0].getAttribute('data-date'));
		var end = new Date(that.el.tables.childNodes[months - 1].childNodes[82].getAttribute('data-date'));
		var _highlights = highlight.filter(function (x) {
			for (var m = 0; m < x.dates.length; m++) {
				if (x.dates[m].start < end && x.dates[m].end > start) {
					return true;
				}
			}
			return false;
		});
		var legends = [];
        for (var l = 0; l < _highlights.length; l++) {
            if ('legend' in _highlights[l] && _highlights[l].legend) {
                var oldLegend = container.querySelector('.d-legend-item[data-legend="' + _highlights[l].legend + '"][data-color="' + _highlights[l].backgroundColor + '"]');
                if (oldLegend == null) {
                    var legendItem = document.createElement('p');
                    legendItem.setAttribute('class', 'd-legend-item');
                    legendItem.setAttribute('data-legend', _highlights[l].legend);
                    legendItem.setAttribute('data-legend-id', highlight.indexOf(_highlights[l]));
                    legendItem.setAttribute('data-color', _highlights[l].backgroundColor);
                    var legendItemPoint = document.createElement('span');
                    legendItemPoint.setAttribute('style', 'background-color:' + _highlights[l].backgroundColor);
                    legendItem.appendChild(legendItemPoint);
                    that.el.legend.appendChild(legendItem);
                    legendItem.addEventListener('mouseover', hoverLegend);
                    legendItem.addEventListener('mouseout', hoverLegend);
                    legends.push(legendItem);
                } else {
                    legends.push(oldLegend);
                }
            }
        }
		[].slice.call(that.el.legend.querySelectorAll('.d-legend-item')).forEach(function (item) {
			if (legends.indexOf(item) < 0) {
				item.removeEventListener('mouseover', hoverLegend);
				item.removeEventListener('mouseout', hoverLegend);
				that.el.legend.removeChild(item);
			}
		});

		function hoverLegend(e) {
			[].slice.call(that.el.tables.querySelectorAll('[data-legend-id*="' + this.getAttribute('data-legend-id') + '"]')).forEach(function (element) {
				if (e.type == 'mouseover') element.classList.add('legend-hover');else element.classList.remove('legend-hover');
			});
		}
	}

	function parseMonth(month) {
		if (month > 11) month -= 12;
		else if (month < 0) month += 12;
		return month;
	}

	function generateDates(year, month, type) {
		dataCheck();
		var selectCanlendar = document.querySelector('#select-calendar');
		var dateTime = document.querySelector('#etc-start-date-txt').value;
		if (selectCanlendar.value == 'etc-end-date') dateTime = document.querySelector('#etc-end-date-txt').value;

		if (!type) {
			var dateAry = dateTime.split('.');
			year = (dateAry[0] * 1);
			month = (dateAry[1] * 1);
			currentYear = (dateAry[0] * 1);
			currentMonth = (dateAry[1] * 1);
			setDate();

			dataCheck();
		}

		var monthElements = that.el.querySelectorAll('.d-table');
		var ws = weekStart !== null ? weekStart : languages[lang].weekStart;

		var userStartDate = $('#etc-start-date-txt').val(),
			userEndDate = $('#etc-end-date-txt').val();

		[].slice.call(that.el.querySelectorAll('.d-table')).forEach(function (element, index) {
			var days = new Date(year, month + index, 0).getDate();
			var daysLast = new Date(year, month + index - 1, 0).getDate();
			var startDay = new Date(year, month + index - 1, 1).getDay();
			var startDate = null;
			var endDate = null;
			if (startDay - ws < 0) {
				startDay = 7 - ws;
			} else {
				startDay -= ws;
			}
			var monthText = languages[lang].monthNames[parseMonth(month - 1 + index)];
			element.setAttribute('data-month', monthText);

			[].slice.call(element.querySelectorAll('.d-table input')).forEach(function (inputEl, i) {
				var labelEl = inputEl.nextSibling;

				inputEl.checked = false;
				inputEl.removeAttribute('disabled');
				labelEl.removeAttribute('style');
				labelEl.removeAttribute('data-legend-id');
				labelEl.className = '';

				var date = null;
				var dateFormat = null;
				if (i < startDay) {
					labelEl.childNodes[0].innerHTML = daysLast - (startDay - i - 1);
					if (index == 0) {
						date = new Date(year, month + index - 2, daysLast - (startDay - i - 1));
						dateFormat = new Date(year, month + index - 2, daysLast - (startDay - i - 1)).format('yyyy.MM.dd');
						labelEl.className = 'prev';
					} else {
						date = '';
						labelEl.className = 'd-hidden';
						inputEl.setAttribute('disabled', true);
					}
				} else if (i < days + startDay) {
					date = new Date(year, month + index - 1, i - startDay + 1);
					dateFormat = new Date(year, month + index - 1, i - startDay + 1).format('yyyy.MM.dd');
					labelEl.childNodes[0].innerHTML = i - startDay + 1;
					labelEl.className = '';
				} else {
					labelEl.childNodes[0].innerHTML = i - days - startDay + 1;
					if (index == monthElements.length - 1) {
						date = new Date(year, month + index, i - days - startDay + 1);
						dateFormat = new Date(year, month + index, i - days - startDay + 1).format('yyyy.MM.dd');
						labelEl.className = 'next';
					} else {
						date = '';
						labelEl.className = 'd-hidden';
						inputEl.setAttribute('disabled', true);
					}
				}
				
				if(args.exp == true) {
					var dayEnabled = refreshDays(dateFormat,userStartDate,userEndDate);
					labelEl.className = (dayEnabled) ? 'exp' : 'disabled';
				}
				labelEl.setAttribute('label-date', dateFormat);

				if (date instanceof Date) {
					inputEl.setAttribute('data-date', dateFormat);
					inputEl.setAttribute('data-term_date', dateFormat);

					if (disabledDates.indexOf(date.getTime()) != -1 || disabledDays.indexOf(date.getDay()) != -1) {
						inputEl.setAttribute('disabled', true);
					}

					if (minDate && date < minDate || maxDate && date > maxDate) {
						inputEl.setAttribute('disabled', true);
						labelEl.className = 'd-hidden';
					}

					var _highlights = highlight.filter(function (x) {
						for (var m = 0; m < x.dates.length; m++) {
							if (date.getTime() >= x.dates[m].start.getTime() && date.getTime() <= x.dates[m].end.getTime()) {
								return true;
							}
						}
						return false;
					});

					if (_highlights.length > 0) {
						var bgColor = '';
						var legendIds = '';

						if (_highlights.length > 1) {
							var percent = Math.round(100 / _highlights.length);
							bgColor = 'background: linear-gradient(-45deg,';
							for (var z = 0; z < _highlights.length; z++) {
								legendIds += highlight.indexOf(_highlights[z]);
								if (z !== _highlights.length - 1) {
									legendIds += ' ';
								}
								bgColor += _highlights[z].backgroundColor + ' ' + percent * z + '%';
								if (z != _highlights.length - 1) {
									bgColor += ',';
									bgColor += _highlights[z].backgroundColor + ' ' + percent * (z + 1) + '%,';
								}
							}
							bgColor += ');';
						} else {
							bgColor = _highlights[0].backgroundColor ? 'background:' + _highlights[0].backgroundColor + ';' : '';
							legendIds += highlight.indexOf(_highlights[0]);
						}
						var Color = _highlights[0].color ? 'color:' + _highlights[0].color + ';' : '';
						labelEl.setAttribute('style', bgColor + Color);
						labelEl.setAttribute('data-legend-id', legendIds);
					}
				}
			});
		});

		generateLegends();

		var width = 0;
		$('#etc-except-date-picker.etc-except-date-picker .Datepickk .d-table input + label').each(function (idx, item) {
			if (idx == 0) width = $(this).width();
			$(this).css('height', width+'px');
		});
	};

	function setDate() {
		if (!that.el.tables.childNodes.length || !that.el.tables.childNodes[0].childNodes.length) return;

		resetCalendar();

		if (currentMonth > 12 || currentMonth < 1) {
			if (currentMonth > 12) {
				currentYear += 1;
				currentMonth -= 12;
			} else {
				currentYear -= 1;
				currentMonth += 12;
			}
		}
		if (maxDate && new Date(currentYear, currentMonth - 1 + months - 1, 1) >= new Date(maxDate).setDate(1)) {
			currentYear = maxDate.getFullYear();
			currentMonth = maxDate.getMonth() + 1 - months + 1;
			that.el.header.childNodes[3].setAttribute('style', 'visibility:hidden');
			that.el.header.childNodes[4].setAttribute('style', 'visibility:hidden');
		} else {
			that.el.header.childNodes[3].removeAttribute('style');
			that.el.header.childNodes[4].removeAttribute('style');
		}
		if (minDate && new Date(currentYear, currentMonth - 1, 1) <= new Date(minDate).setDate(1)) {
			currentYear = minDate.getFullYear();
			currentMonth = minDate.getMonth() + 1;
			that.el.header.childNodes[0].setAttribute('style', 'visibility:hidden');
			that.el.header.childNodes[1].setAttribute('style', 'visibility:hidden');
		} else {
			that.el.header.childNodes[0].removeAttribute('style');
			that.el.header.childNodes[1].removeAttribute('style');
		}
		for (var c = 0; c < months; c++) {
			var index = currentMonth - 1 + c;
			if (index > 11) {
				index -= 12;
			} else if (index < 0) {
				index += 12;
			}

			// that.el.monthPicker.childNodes[index].classList.add('current');
			that.el.newMonthPicker.childNodes[index].classList.add('current');
		}

		generateDates(currentYear, currentMonth, 'new');
		generateYears();
		var startmonth = languages[lang].monthNames[currentMonth - 1];
		var endmonth = '';
		if (months > 1) {
			endmonth += ' - ';
			var monthint = currentMonth - 1 + months - 1;
			if (monthint > 11) {
				monthint -= 12;
			} else if (monthint < 0) {
				monthint += 12;
			}
			endmonth += languages[lang].monthNames[monthint];
		}
		var yearname = currentMonth - 1 + months - 1 > 11 ? currentYear.toString() + '/' + (currentYear + 1).toString() : currentYear.toString();

		that.el.header.childNodes[2].childNodes[1].innerHTML = (lang == 'ko')? startmonth + endmonth : yearname;
		that.el.header.childNodes[2].childNodes[0].innerHTML = (lang == 'ko')? yearname+'.' : startmonth + endmonth;

		that.el.yearPicker.querySelector('[data-year="0"]').classList.add('current');
		that.el.newYearPicker.querySelector('[data-fullYear="'+currentYear+'"]').classList.add('current');
		if (currentMonth - 1 + months - 1 > 11) {
			that.el.yearPicker.querySelector('[data-year="1"]').classList.add('current');
			that.el.monthYearPicker.querySelector('[data-year="1"]').classList.add('current');
		}

		// var i = 0;
		// var width = 0;
		// $('#etc-end-date-picker .Datepickk .d-table input + label').each(function () {
		// 	if (i == 0) width = $(this).width();
		// 	$(this).css('height', width+'px');
		// 	i++;
		// });
		// var i = 0;
		// var width = 0;
		// $('#etc-start-date-picker .Datepickk .d-table input + label').each(function () {
		// 	if (i == 0) width = $(this).width();
		// 	$(this).css('height', width+'px');
		// 	i++;
		// });
		// var i = 0;
		// var width = 0;
		// $('#etc-except-date-picker.etc-except-date-picker .Datepickk .d-table input + label').each(function () {
		// 	if (i == 0) width = $(this).width();
		// 	$(this).css('height', width+'px');
		// 	i++;
		// });
		
		renderSelectedDates();
		if (onNavigation) onNavigation.call(that);
		checkBoxAllFalse();

		var startDate = document.querySelector('#etc-start-date-txt');
		var endDate = document.querySelector('#etc-end-date-txt');
		
		if(args.range) {
			if (startDate.value) {
				var termCalendar = document.querySelectorAll('.term-calendar');
				for (var i=0;i<termCalendar.length;i++) {
					var ele = termCalendar[i];
					if (ele.dataset.term_date == startDate.value) {
						ele.classList.add('etc-start-active');
						ele.checked = true;
						if (ele.dataset.term_date == endDate.value) {
							ele.classList.add('etc-end-active');
							ele.checked = true;
						}
					} else if (ele.dataset.term_date == endDate.value) {
						ele.classList.add('etc-end-active');
						ele.checked = true;
					}
				}
			}

			if (endDate.value) {
				document.querySelectorAll('.term-calendar').forEach(function (ele) {
					if (ele.dataset.term_date == endDate.value) {
						ele.classList.add('etc-end-active');
						ele.checked = true;
					}
				});
			}

			$('.term-calendar-box .d-tables input').removeClass('inRange');
			if(startDate.value && endDate.value) {
				var startDateObj = new Date(startDate.value.replace(/\./g,'/'));
				var endDateObj = new Date(endDate.value.replace(/\./g,'/'));
				$('.term-calendar-box .d-tables input').each(function (i, v) {
					var dateObj = new Date($(v).attr('data-term_date').replace(/\./g,'/'));
					if(dateObj > startDateObj  && dateObj < endDateObj && !$(v).is(':disabled')) $(v).addClass('inRange');
				});
			}
		}
		
	};

	function renderSelectedDates() {
		selectedDates.forEach(function (date) {
			date = new Date(date);
			var el = that.el.querySelector('[data-date="' + date.toJSON() + '"]');
			if (el) {
				el.checked = true;
			}
		});
		
		that.el.tables.classList.remove('before');
		if (range && selectedDates.length > 1) {
			var currentDate = new Date(currentYear, currentMonth - 1, 1);
			var sorted = selectedDates.sort(function (a, b) {
				return a.getTime() - b.getTime();
			});
			var first = that.el.querySelector('[data-date="' + sorted[0].toJSON() + '"]');
			if (!first && currentDate >= new Date(sorted[0].getFullYear(), sorted[0].getMonth(), 1) && currentDate <= new Date(sorted[1].getFullYear(), sorted[1].getMonth(), 1)) {
				that.el.tables.classList.add('before');
			}
		}
	};

	function resetCalendar() {
		[].slice.call(that.el.querySelectorAll('.d-table input')).forEach(function (inputEl) {
			inputEl.checked = false;
		});

		[].slice.call(that.el.monthPicker.querySelectorAll('.current')).forEach(function (monthPickEl) {
			monthPickEl.classList.remove('current');
		});

		[].slice.call(that.el.yearPicker.querySelectorAll('.current')).forEach(function (yearPickEl) {
			yearPickEl.classList.remove('current');
		});

		[].slice.call(that.el.newMonthPicker.querySelectorAll('.current')).forEach(function (monthPickEl) {
			monthPickEl.classList.remove('current');
		});

		[].slice.call(that.el.newYearPicker.querySelectorAll('.current')).forEach(function (yearPickEl) {
			yearPickEl.classList.remove('current');
		});
	};

	function nextMonth() {
		currentMonth += months;
		dataCheck();
		setDate();
		displaySelectedDates();
	};

	function prevMonth() {
		if(currentYear > 1900 || (currentYear == 1900 && currentMonth > 1)) currentMonth -= months;
		dataCheck();
		setDate();
		displaySelectedDates();
	};

	function nextYear() {
		currentYear += 1;
		dataCheck();
		setDate();
		displaySelectedDates();
	};

	function prevYear() {
		if(currentYear > 1900) currentYear -= 1;
		dataCheck();
		setDate();
		displaySelectedDates();
	};

	function selectDate(date, ignoreOnSelect) {
		date = new Date(date);
		date.setHours(0, 0, 0, 0);
		var year  = date.getFullYear();
        var month = date.getMonth()+ 1;
        var date  = date.getDate();
        if(parseInt(month) < 10) month = "0" + month;
        if(parseInt(date) < 10) date = "0" + date;
            
		var newDate = year + '.' + month + '.' + date;
		// var el = that.el.querySelector('[data-date="' + date.toJSON() + '"]');
		var el = that.el.querySelector('[data-date="' + newDate + '"]');

		if (range && el && el.checked) {
			el.classList.add('single');
		}

		if (el && !el.checked) {
			el.checked = true;
		}

		selectedDates.push(date);

		if (onSelect && !ignoreOnSelect) {
			onSelect.apply(date, [true]);
		}
	};

	function unselectDate(date, ignoreOnSelect) {
		date = new Date(date);
		date.setHours(0, 0, 0, 0);
		var el = that.el.querySelector('[data-date="' + date.toJSON() + '"]');
		if (el) {
			el.classList.remove('single');
			if (el.checked) {
				el.checked = false;
			}
		}

		selectedDates = selectedDates.filter(function (x) {
			x = new Date(x.replace(/\./g, '/'));
			return x.getTime() != date.getTime();
		});

		if (onSelect && !ignoreOnSelect) {
			onSelect.call(date, false);
		}
	};

	function unselectAll(ignoreOnSelect) {
		if(!selectedDates || selectedDates.length == 0) {
			selectedDates = exceptPicker.selectedDates;
		}
		
		selectedDates.forEach(function (date) {
			unselectDate(date, ignoreOnSelect);
		});
	};

	function unselectExceptDate(date, ignoreOnSelect) {
		date = new Date(date.replace(/\./g, '/'));
		date.setHours(0, 0, 0, 0);
		
		var el = that.el.querySelector('[data-date="' + date.format('yyyy.MM.dd') + '"]');
		if (el) {
			el.classList.remove('active');
			if (el.checked) {
				el.checked = false;
			}
		}

		selectedDates = selectedDates.filter(function (x) {
			x = new Date(x.replace(/\./g, '/'));
			return x.getTime() != date.getTime();
		});

		var str = selectedDates.join(',');
		document.querySelector('#select-except-date').value = str;
	};

	function unselectExceptAll(ignoreOnSelect) {
		selectedDates = exceptPicker.selectedDates;
		
		selectedDates.forEach(function (date) {
			unselectExceptDate(date, ignoreOnSelect);
		});
	};

	function inputChange(e) {
		var input = this;
		var date = new Date(input.getAttribute('data-date'));
		input.classList.remove('single');
		if (locked) {
			return;
		}
		if (range) {
			that.el.tables.classList.remove('before');
		}
		if (input.checked) {
			if (maxSelections && selectedDates.length > maxSelections - 1) {
				var length = selectedDates.length;
				for (length; length > maxSelections - 1; length--) {
					unselectDate(selectedDates[0]);
				}
			}

			if (range && selectedDates.length) {
				var first = that.el.querySelector('[data-date="' + selectedDates[0].toJSON() + '"]');
				if (!first && date > selectedDates[0]) {
					that.el.tables.classList.add('before');
				}
			}

			selectedDates.push(date);

			if (closeOnSelect) {
				that.hide();
			}
		} else {
			if (range && selectedDates.length == 1 && selectedDates[0].getTime() == date.getTime()) {
				selectDate(date);
				input.classList.add('single');
			} else {
				selectedDates = selectedDates.filter(function (x) {
					return x.getTime() != date.getTime();
				});
			}
		}

		if (onSelect) {
			onSelect.call(date, input.checked);
		}
	};

	function setRange(val) {
		if (val) {
			range = true;
			that.el.tables.classList.add('range');
		} else {
			range = false;
			that.el.tables.classList.remove('range');
		}
	};

	function show(properties) {
		if (!that.inline && that.container === document.body) {
			document.body.classList.add('d-noscroll');
		}
		setArgs(properties);
		var handler = function handler() {
			that.el.classList.remove('d-show');
			that.el.calendar.removeEventListener(whichAnimationEvent(), handler);
		};
		that.el.calendar.addEventListener(whichAnimationEvent(), handler);
		that.el.classList.add('d-show');
		container.appendChild(that.el);
		opened = true;
		if (startDate) {
			currentMonth = startDate.getMonth() + 1;
			currentYear = startDate.getFullYear();
		}
		setDate();
	};

	function hide() {
		document.body.classList.remove('d-noscroll');
		var handler = function handler() {
			that.el.parentNode.removeChild(that.el);
			opened = false;
			that.el.classList.remove('d-hide');
			if (typeof onClose == 'function') {
				onClose.apply(that);
			}
			that.el.removeEventListener(whichAnimationEvent(), handler);
		};
		that.el.addEventListener(whichAnimationEvent(), handler);
		that.el.classList.add('d-hide');
	};

	function bindEvents() {
		that.el.header.childNodes[0].addEventListener(eventName, prevYear);
		that.el.header.childNodes[1].addEventListener(eventName, prevMonth);
		that.el.header.childNodes[3].addEventListener(eventName, nextMonth);
		that.el.header.childNodes[4].addEventListener(eventName, nextYear);
		// that.el.header.childNodes[2].childNodes[0].addEventListener(eventName,function(){
		// 	generateYears();
		// 	if(that.el.yearPicker.classList.contains('d-show')){
		// 		that.el.yearPicker.classList.remove('d-show');
		// 	}else{
		// 		that.el.yearPicker.classList.add('d-show');
		// 	}
		// 	that.el.monthPicker.classList.remove('d-show');
		// });
		// that.el.header.childNodes[2].childNodes[1].addEventListener(eventName,function(){
		// 	if(that.el.monthPicker.classList.contains('d-show')){
		// 		that.el.monthPicker.classList.remove('d-show');
		// 	}else{
		// 		that.el.monthPicker.classList.add('d-show');
		// 	}
		// 	that.el.yearPicker.classList.remove('d-show');
		// });
		that.el.overlay.addEventListener(eventName, function () {
			if (closeOnClick) {
				that.hide();
			}
		});
		
		[].slice.call(that.el.monthPicker.childNodes).forEach(function (monthPicker) {
			monthPicker.addEventListener(eventName, function () {
				currentMonth = parseInt(this.getAttribute('data-month'));
				setDate();
				that.el.monthPicker.classList.remove('d-show');
			});
		});

		[].slice.call(that.el.yearPicker.childNodes).forEach(function (yearPicker) {
			yearPicker.addEventListener(eventName, function () {
				currentYear += parseInt(this.getAttribute('data-year'));
				setDate();
				that.el.yearPicker.classList.remove('d-show');
			});
		});

		[].slice.call(that.el.newMonthPicker.childNodes).forEach(function (monthPicker) {
			monthPicker.addEventListener(eventName, function () {
				currentMonth = parseInt(this.getAttribute('data-month'));
				setDate();
				that.el.monthYearPicker.classList.remove('d-show');
				displaySelectedDates();
			});
		});

		[].slice.call(that.el.newYearPicker.childNodes).forEach(function (yearPicker) {
			yearPicker.addEventListener(eventName, function () {
				currentYear = parseInt(this.getAttribute('data-fullYear'));
				setDate();
				displaySelectedDates();
			});
		});

		that.el.monthYearPicker.querySelector('.close-picker').addEventListener(eventName, function() {
			that.el.monthYearPicker.classList.remove('d-show');
		});

		var startX = 0;
		var distance = 0;
		that.el.calendar.addEventListener('touchstart', function (e) {
			startX = e.changedTouches[0].clientX || e.originalEvent.changedTouches[0].clientX;
			//e.preventDefault();
		});

		that.el.calendar.addEventListener('touchmove', function (e) {
			distance = e.changedTouches[0].clientX - startX || e.originalEvent.changedTouches[0].clientX - startX;
			e.preventDefault();
		});

		that.el.calendar.addEventListener('touchend', function (e) {
			if (distance > 50) {
				prevMonth();
			} else if (distance < -50) {
				nextMonth();
			}
			distance = 0;
		});
	};

	function setArgs(x) {
		for (var key in x) {
			if (key in that) {
				that[key] = x[key];
			}
		};
	};

	function init() {
		that.el = document.createElement('div');
		that.el.classList.add('Datepickk');
		that.el.classList.add(getBrowserVersion().type);
		that.el.innerHTML = template;
		that.el.calendar = that.el.childNodes[1];
		that.el.titleBox = that.el.childNodes[0];
		that.el.button = that.el.childNodes[3];
		that.el.header = that.el.calendar.childNodes[0];
		that.el.monthPicker = that.el.calendar.childNodes[1];
		that.el.yearPicker = that.el.calendar.childNodes[2];
		that.el.tables = that.el.calendar.childNodes[5];
		that.el.days = that.el.calendar.childNodes[4];
		that.el.overlay = that.el.childNodes[4];
		that.el.legend = that.el.childNodes[2];

		that.el.monthYearPicker = that.el.calendar.childNodes[3];
		that.el.newMonthPicker = that.el.monthYearPicker.childNodes[1].childNodes[1];
		that.el.newYearPicker = that.el.monthYearPicker.childNodes[1].childNodes[0];

		setArgs(args);
		generateInputs(args.exp, args.range);
		generateDaynames();
		bindEvents();

		if (inline) {
			show();
		}
	}

	that.show = show;
	that.hide = hide;
	that.selectDate = selectDate;
	that.unselectAll = unselectAll;
	that.unselectDate = unselectDate;
	that.unselectExceptAll = unselectExceptAll;
	that.unselectExceptDate = unselectExceptDate;
	that.generateDates = generateDates;
	that.setSelectedDates = setSelectedDates;

	function currentDateGetter() {
		return new Date(currentYear, currentMonth - 1, 1);
	}
	function currentDateSetter(x) {
		x = new Date(x);
		currentMonth = x.getMonth() + 1;
		currentYear = x.getFullYear();
		setDate();
	}

	function setSelectedDates(date, type) {
		var dp = moment(date.replace(/\./g, '/')), sdate,
			selected = document.querySelector('#select-except-date').value,
			reset = [],
			startDate = document.querySelector('#etc-start-date-txt').value,
			endDate = document.querySelector('#etc-end-date-txt').value;
		selected = (selected == '-')? '':selected;
		if(selected) {
			// console.log(selected);
			var dates = selected.split(',');
			document.querySelector('#etc-except-date').value = dates[0];
			dates.forEach(function(v,i,el) {
				sdate = moment(v.replace(/\./g, '/'));
				var exceptPickerDate = exceptPicker.container.querySelector('[data-date="' + v + '"]');
				var exceptPickerDateDisabled = (exceptPickerDate == null || typeof exceptPickerDate == 'undefined')? '':exceptPickerDate.getAttribute('disabled');
				
				if(type == 'start') {
					if(dp <= sdate && exceptPickerDateDisabled != 'true') {
						reset.push(v);
						//exceptPicker.container.querySelector('[data-date="' + v + '"]').classList.add('active');
					}
				} else if(type == 'end') {
					if(dp >= sdate && exceptPickerDateDisabled != 'true') { 
						reset.push(v);
						//exceptPicker.container.querySelector('[data-date="' + v + '"]').classList.add('active');
					}
				} else {
					if(exceptPickerDateDisabled != 'true'){
						reset.push(v);
					}
				}
			});

			var reSelected = reset.join(',');

			if(startDate == endDate || reset.length == 0) {
				document.querySelector('#etc-except-date').value = '-';
				document.querySelector('#select-except-date').value = '';
				reSelected = '';
			}

			document.querySelector('#select-except-date').value = reSelected;
		}

	}

	function getSelectedDates(date) {
		var selected = [],
			cal = args.container,
			checked = cal.querySelectorAll('input.active');
		
		if(cal.id != 'etc-except-date-picker') return;

		var userStartDate = document.querySelector('#etc-start-date-txt').value,
			userEndDate = document.querySelector('#etc-end-date-txt').value,
			currentDates = document.querySelector('#select-except-date').value,
			etcDateWeek = document.querySelector('#etc-date-week').value,
			termDays = (document.querySelector('#term-days'))? document.querySelector('#term-days').value:'';
		var exceptPickerContainer = document.querySelector('#etc-except-date-picker');
		var exceptPickerDate = exceptPickerContainer.querySelector('[data-date="' + date + '"]');
		var exceptPickerDateDisabled = (exceptPickerDate == null || typeof exceptPickerDate == 'undefined')? '':exceptPickerDate.getAttribute('disabled');
		var termDaysArr = new Array();
		var enableDays = new Array();
		
		if(termDays) {
			termDaysArr = termDays.split('|');
			var daysObj = {
		        'sun': 0,
		        'mon': 1,
		        'tue': 2,
		        'wed': 3,
		        'thu': 4,
		        'fri': 5,
		        'sat': 6,
		    }
		    
		    if(termDaysArr.length > 0) {
		        $.each(termDaysArr, function(i, v){
		        	enableDays.push(daysObj[v]);
		        });
		    }
		}
		
		userStartDate = new Date(userStartDate.replace(/\./g, '/'));
		userEndDate = new Date(userEndDate.replace(/\./g, '/'));
		currentDates = (currentDates == '-')? '':currentDates;

		var elapsedMSec = userEndDate.getTime() - userStartDate.getTime(); // 172800000
		var elapsedDates = 0;
		
    	if(etcDateWeek == 'A') {
    		elapsedDates = (elapsedMSec / 1000 / 60 / 60 / 24) + 1;
    	} else {
    		while(true) {  
				var temp_date = userStartDate;
				if(temp_date.getTime() > userEndDate.getTime()) {	
					break;
				} else {
					var tmp = temp_date.getDay();
					if(termDaysArr.length > 0) {
						if(enableDays.indexOf(tmp) > -1) elapsedDates++;
					} else {
						if(etcDateWeek == 'W') { //주중
							if(tmp != 0 && tmp != 6) elapsedDates++;
						} else { //주말
							if(tmp == 0 || tmp == 6) elapsedDates++;
						}
					}
					
	        		temp_date.setDate(userStartDate.getDate() + 1); 
	    		}
			}
    	}
		// console.log("count : " + elapsedDates);	
		// console.log(currentDates);

		selected = (currentDates != '')? currentDates.split(','):[];	
		if(typeof date != 'undefined'){
			if(!selected.includes(date)) {
				selected.push(date);
			} else {
				selected.splice(selected.indexOf(date), 1);
			}
		}
		// console.log(selected, date);
		if(elapsedDates == selected.length) {
			selected.splice(selected.indexOf(date), 1);
			exceptPickerContainer.querySelector('[data-date="' + date + '"]').classList.remove('active');
			exceptPickerContainer.querySelector('input[data-term_date="' + date + '"]').checked = false;
			alert($.lang[LANG]['config.form.date.excludeDate.all']);
		}

		// console.log(selected);
		var str = selected.sort().join(',');
		var selectedArr = selected.sort();
		document.querySelector('#select-except-date').value = str;
		document.querySelector('#etc-except-date').value = (selectedArr[0])? selectedArr[0]:'-';

		if(document.querySelector('.etc-except-date-status') != null) {
			if(selected.length > 1) {
				document.querySelector('.etc-except-date-status').innerText = '외 '+(selected.length-1)+'건'
			} else {
				document.querySelector('.etc-except-date-status').innerText = '';
			}
		}
		
		if(selected.length > 0) {
			$('.unselect-all').removeClass('disabled');
		} else {
			$('.unselect-all').addClass('disabled');
		}
        
		return selected;
	}

	Object.defineProperties(that, {
		"selectedDates": {
			get: function get() {
				return getSelectedDates();
				// return selectedDates.sort(function (a, b) {
				// 	return a.getTime() - b.getTime();
				// });
			}
		},
		"range": {
			get: function get() {
				return range;
			},
			set: function set(x) {
				setRange(x);
				if (x) {
					maxSelections = 2;
				}
			}
		},
		"button": {
			get: function get() {
				return button;
			},
			set: function set(x) {
				if (typeof x == 'string') {
					button = x;
				} else {
					button = null;
				}
				that.el.button.innerHTML = button ? button : '';
			}
		},
		"title": {
			get: function get() {
				return title;
			},
			set: function set(x) {
				if (typeof x == 'string') {
					title = x;
				} else {
					title = null;
				}
				that.el.titleBox.innerText = title ? title : '';
			}
		},
		"lang": {
			get: function get() {
				return lang;
			},
			set: function set(x) {
				if (x in languages) {
					lang = x;
					generateDaynames();
					setDate();
				} else {
					console.error('Language not found');
				}
			}
		},
		"weekStart": {
			get: function get() {
				return weekStart !== null ? weekStart : languages[lang].weekStart;
			},
			set: function set(x) {
				if (typeof x == 'number' && x > -1 && x < 7) {
					weekStart = x;
					generateDaynames();
					setDate();
				} else {
					console.error('weekStart must be a number between 0 and 6');
				}
			}
		},
		"months": {
			get: function get() {
				return months;
			},
			set: function set(x) {
				if (typeof x == 'number' && x > 0) {
					months = x;
					generateDaynames();
					generateInputs(args.exp, args.range);
					setDate();

					if (months == 1) {
						that.el.classList.remove('multi');
					} else {
						that.el.classList.add('multi');
					}
				} else {
					console.error('months must be a number > 0');
				}
			}
		},
		"isOpen": {
			get: function get() {
				return opened;
			}
		},
		"closeOnSelect": {
			get: function get() {
				return closeOnSelect;
			},
			set: function set(x) {
				if (x) {
					closeOnSelect = true;
				} else {
					closeOnSelect = false;
				}
			}
		},
		"disabledDays": {
			get: function get() {
				return disabledDays;
			},
			set: function set(x) {
				if (x instanceof Array) {
					for (var i = 0; i < x.length; i++) {
						if (typeof x[i] == 'number') {
							disabledDays.push(x[i]);
						}
					}
				} else if (typeof x == 'number') {
					disabledDays = [x];
				} else if (!x) {
					disabledDays = [];
				}
				setDate();
			}
		},
		"disabledDates": {
			get: function get() {
				return disabledDates.map(function (x) {
					return new Date(x);
				});
			},
			set: function set(x) {
				if (x instanceof Array) {
					x.forEach(function (date) {
						if (date instanceof Date) {
							disabledDates.push(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime());
						}
					});
				} else if (x instanceof Date) {
					disabledDates = [new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime()];
				} else if (!x) {
					disabledDates = [];
				}
				setDate();
			}
		},
		"highlight": {
			get: function get() {
				return highlight;
			},
			set: function set(x) {
				if (x instanceof Array) {
					x.forEach(function (hl) {
						if (hl instanceof Object) {
							var highlightObj = {};
							highlightObj.dates = [];

							if ('start' in hl) {
								highlightObj.dates.push({
									start: new Date(hl.start.getFullYear(), hl.start.getMonth(), hl.start.getDate()),
									end: 'end' in hl ? new Date(hl.end.getFullYear(), hl.end.getMonth(), hl.end.getDate()) : new Date(hl.start.getFullYear(), hl.start.getMonth(), hl.start.getDate())
								});
							} else if ('dates' in hl && hl.dates instanceof Array) {
								hl.dates.forEach(function (hlDate) {
									highlightObj.dates.push({
										start: new Date(hlDate.start.getFullYear(), hlDate.start.getMonth(), hlDate.start.getDate()),
										end: 'end' in hlDate ? new Date(hlDate.end.getFullYear(), hlDate.end.getMonth(), hlDate.end.getDate()) : new Date(hlDate.start.getFullYear(), hlDate.start.getMonth(), hlDate.start.getDate())
									});
								});
							}

							highlightObj.color = hl.color;
							highlightObj.backgroundColor = hl.backgroundColor;
							highlightObj.legend = 'legend' in hl ? hl.legend : null;

							highlight.push(highlightObj);
						}
					});
				} else if (x instanceof Object) {
					var highlightObj = {};
					highlightObj.dates = [];

					if ('start' in x) {
						highlightObj.dates.push({
							start: new Date(x.start.getFullYear(), x.start.getMonth(), x.start.getDate()),
							end: 'end' in x ? new Date(x.end.getFullYear(), x.end.getMonth(), x.end.getDate()) : new Date(x.start.getFullYear(), x.start.getMonth(), x.start.getDate())
						});
					} else if ('dates' in x && x.dates instanceof Array) {
						x.dates.forEach(function (hlDate) {
							highlightObj.dates.push({
								start: new Date(hlDate.start.getFullYear(), hlDate.start.getMonth(), hlDate.start.getDate()),
								end: 'end' in hlDate ? new Date(hlDate.end.getFullYear(), hlDate.end.getMonth(), hlDate.end.getDate()) : new Date(hlDate.start.getFullYear(), hlDate.start.getMonth(), hlDate.start.getDate())
							});
						});
					}

					highlightObj.color = x.color;
					highlightObj.backgroundColor = x.backgroundColor;
					highlightObj.legend = 'legend' in x ? x.legend : null;

					highlight.push(highlightObj);
				} else if (!x) {
					highlight = [];
				}

				setDate();
			}
		},
		"onClose": {
			set: function set(callback) {
				onClose = callback;
			}
		},
		"onSelect": {
			set: function set(callback) {
				onSelect = callback;
			}
		},
		"today": {
			get: function get() {
				return today;
			},
			set: function set(x) {
				if (x) {
					today = true;
				} else {
					today = false;
				}
			}
		},
		"daynames": {
			get: function get() {
				return daynames;
			},
			set: function set(x) {
				if (x) {
					daynames = true;
				} else {
					daynames = false;
				}
				generateDaynames();
			}
		},
		"fullscreen": {
			get: function get() {
				return that.el.classList.contains('fullscreen');
			},
			set: function set(x) {
				if (x) {
					that.el.classList.add('fullscreen');
				} else {
					that.el.classList.remove('fullscreen');
				}
			}
		},
		"locked": {
			get: function get() {
				return locked;
			},
			set: function set(x) {
				if (x) {
					locked = true;
					that.el.tables.classList.add('locked');
				} else {
					locked = false;
					that.el.tables.classList.remove('locked');
				}
			}
		},
		"maxSelections": {
			get: function get() {
				return maxSelections;
			},
			set: function set(x) {
				if (typeof x == 'number' && !range) {
					maxSelections = x;
				} else {
					if (range) {
						maxSelections = 2;
					} else {
						maxSelections = null;
					}
				}
			}
		},
		"onConfirm": {
			set: function set(callback) {
				if (typeof callback == 'function') {
					onConfirm = callback.bind(that);
					that.el.button.addEventListener(eventName, onConfirm);
				} else if (!callback) {
					that.el.button.removeEventListener(eventName, onConfirm);
					onConfirm = null;
				}
			}
		},
		"onNavigation": {
			set: function set(callback) {
				if (typeof callback == 'function') {
					onNavigation = callback.bind(that);
				} else if (!callback) {
					onNavigation = null;
				}
			}
		},
		"closeOnClick": {
			get: function get() {
				return closeOnClick;
			},
			set: function set(x) {
				if (x) {
					closeOnClick = true;
				} else {
					closeOnClick = false;
				}
			}
		},
		"currentDate": {
			get: currentDateGetter,
			set: currentDateSetter
		},
		"setDate": {
			set: currentDateSetter
		},
		"startDate": {
			get: function get() {
				return startDate;
			},
			set: function set(x) {
				if (x) {
					startDate = new Date(x);
				} else {
					startDate = null;
					currentYear = new Date().getFullYear();
					currentMonth = new Date().getMonth() + 1;
				}
				setDate();
			}
		},
		"minDate": {
			get: function get() {
				return minDate;
			},
			set: function set(x) {
				minDate = x ? new Date(x) : null;
				setDate();
			}
		},
		"maxDate": {
			get: function get() {
				return maxDate;
			},
			set: function set(x) {
				maxDate = x ? new Date(x) : null;
				setDate();
			}
		},
		"container": {
			get: function get() {
				return container;
			},
			set: function set(x) {
				if (x instanceof String) {
					var y = document.querySelector(x);
					if (y) {
						container = y;
						if (container != document.body) {
							that.el.classList.add('wrapped');
						} else {
							that.el.classList.remove('wrapped');
						}
					} else {
						console.error("Container doesn't exist");
					}
				} else if (x instanceof HTMLElement) {
					container = x;
					if (container != document.body) {
						that.el.classList.add('wrapped');
					} else {
						that.el.classList.remove('wrapped');
					}
				} else {
					console.error("Invalid type");
				}
			}
		},
		"inline": {
			get: function get() {
				return inline;
			},
			set: function set(x) {
				if (x) {
					inline = true;
					that.el.classList.add('inline');
				} else {
					inline = false;
					that.el.classList.remove('inline');
				}
			}
		},
		"exp": {
			get: function get() {
				return exp;
			},
			set: function set(x) {
				if (x) {
					exp = true;
					that.el.tables.classList.add('exp');
				} else {
					exp = false;
					that.el.tables.classList.remove('exp');
				}
			}
		},

	});

	init();
	setDate();

	return Object.freeze(that);
} /*!
  * Datepickk
  * Docs & License: https://crsten.github.com/datepickk
  * (c) 2017 Carsten Jacobsen
  */

;

function whichAnimationEvent() {
	var t;
	var el = document.createElement('fakeelement');
	var transitions = {
		'animation': 'animationend',
		'OAnimation': 'oanimationend',
		'MozAnimation': 'animationend',
		'WebkitAnimation': 'webkitAnimationEnd',
		'': 'MSAnimationEnd'
	};

	for (t in transitions) {
		if (el.style[t] !== undefined) {
			return transitions[t];
		}
	}
}

var CURRENT_YEAR = new Date().getFullYear();
var yearList = '';
for(var i = 1900-CURRENT_YEAR; i <= 15; i++) {
	yearList += '<div data-year="'+i+'"></div>';
}
var monthList = '<div data-month="1">1</div>' +
'<div data-month="2">2</div>' +
'<div data-month="3">3</div>' +
'<div data-month="4">4</div>' +
'<div data-month="5">5</div>' +
'<div data-month="6">6</div>' +
'<div data-month="7">7</div>' +
'<div data-month="8">8</div>' +
'<div data-month="9">9</div>' +
'<div data-month="10">10</div>' +
'<div data-month="11">11</div>' +
'<div data-month="12">12</div>';

var template = '<div class="d-title"></div><div class="d-calendar"><div class="d-header"><i id="dy-previous"><svg viewBox="0 0 14 14" width="14" height="14"><polygon points="8 2 7 1 1 7 7 13 8 12 3 7 "></polygon><polygon points="13 2 12 1 6 7 12 13 13 12 8 7 "></polygon></svg></i><i id="d-previous"><svg viewBox="0 0 14 14" width="14" height="14"><polygon points="9 1 10 2 5 7 10 12 9 13 3 7 "></polygon></svg></i><p><span class="d-year"></span><span class="d-month"></span></p><i id="d-next"><svg viewBox="0 0 14 14" width="14" height="14"><polygon points="5 1 4 2 9 7 4 12 5 13 11 7 "></polygon></svg></i><i id="dy-next"><svg viewBox="0 0 14 14" width="14" height="14"><polygon points="7 1 6 2 11 7 6 12 7 13 13 7 "></polygon><polygon points="2 1 1 2 6 7 1 12 2 13 8 7 "></polygon></svg></i></div>'+
'<div class="d-month-picker">' + monthList + '</div>' +
'<div class="d-year-picker">' + yearList + '</div>'+
'<div class="d-month-year-picker">'+
	'<div class="pick-header display-flex align-items-center"><div class="year">'+$.lang[LANG]['config.form.date.year']+'</div><div class="month">'+$.lang[LANG]['config.form.date.month']+'<span class="close-picker hand"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="10" height="10"><path d="M8.71 8l7.15-7.15c0.2-0.2 0.2-0.51 0-0.71s-0.51-0.2-0.71 0L8 7.29 0.85 0.15c-0.2-0.2-0.51-0.2-0.71 0s-0.2 0.51 0 0.71L7.29 8l-7.15 7.15c-0.2 0.2-0.2 0.51 0 0.71C0.24 15.95 0.37 16 0.5 16s0.26-0.05 0.35-0.15L8 8.71l7.15 7.15c0.1 0.1 0.23 0.15 0.35 0.15s0.26-0.05 0.35-0.15c0.2-0.2 0.2-0.51 0-0.71L8.71 8z"></path></svg></span></div></div>' +
	'<div class="pick-body display-flex">'+
		'<div class="year-picker">' + yearList + '</div>'+
		'<div class="month-picker">' + monthList + '</div>' +
	'</div>'+
'</div>' +
'<div class="d-weekdays"></div>' +
'<div class="d-tables"></div>' +
'</div>' +
'<div class="d-legend"></div>' +
'<button class="d-confirm"></button>' +
'<div class="d-overlay"></div>';

var getBrowserVersion = function getBrowserVersion() {
	var browser = {
		type: null,
		version: null
	};

	var ua = navigator.userAgent,
		tem,
		ios,
		M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	ios = ua.match(/(iphone|ipad)\s+OS\s+([\d+_]+\d+)/i) || [];
	if (/trident/i.test(M[1])) {
		tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
		browser.type = 'MSIE';
		browser.version = parseInt(tem[1]);
		return browser;
	}
	if (M[1] === 'Chrome') {
		tem = ua.match(/\bOPR\/(\d+)/);
		if (tem != null) return 'Opera ' + tem[1];
	}
	if (ios[1]) {
		return browser = {
			type: 'iOS',
			version: ios[2]
		};
	}
	M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
	if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
	browser.type = M[0];
	browser.version = parseInt(M[1]);

	return browser;
};

exports.default = Datepickk;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ])["default"];
});

Date.prototype.format = function (f) {
	if (!this.valueOf()) return " ";

	var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
	var d = this;
	
	return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function(da) {
		switch (da) {
			case "yyyy": return d.getFullYear();
			case "yy": return (d.getFullYear() % 1000).zf(2);
			case "MM": return (d.getMonth() + 1).zf(2);
			case "dd": return d.getDate().zf(2);
			case "E": return weekName[d.getDay()];
			case "HH": return d.getHours().zf(2);
			case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
			case "mm": return d.getMinutes().zf(2);
			case "ss": return d.getSeconds().zf(2);
			case "a/p": return d.getHours() < 12 ? "오전" : "오후";
			default: return da;
		}
	});
};

String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

var checkCalendarClick = true;
if(document.querySelector('.prod-modal') !== null) {
	document.querySelector('.prod-modal').addEventListener('click', function (e) {
	    dataCheck(e.target.parentNode);
	    if (checkCalendarClick && $('#etc-start-date-txt').length) {
	    	displaySelectedDates();
	        document.querySelector('#etc-start-date-txt').classList.remove('active');
	        document.querySelector('#etc-end-date-txt').classList.remove('active');
	        document.querySelector('#etc-except-date').classList.remove('active');
	        document.querySelector('#etc-start-date-picker').style.display = 'none';
	        document.querySelector('#etc-end-date-picker').style.display = 'none';
	        document.querySelector('#etc-except-date-picker').style.display = 'none';
	    }
	});
}

function dataCheck (ele) {
    if (ele.classList == 'pace-disable') {
        checkCalendarClick = true;
        // document.querySelector('#etc-start-date-txt').classList.remove('active');
        // document.querySelector('#etc-end-date-txt').classList.remove('active');
        // document.querySelector('#etc-except-date').classList.remove('active');
        return false;
    } else if (ele.classList == 'd-header' || 
        ele.classList == 'd-next' ||
        ele.classList == 'd-previous') {
        checkCalendarClick = false;
        setTimeout(function () {
            checkCalendarClick = true;
        }, 300);
        return false;
    } else if (ele.classList == 'etc-date' || ele.classList == 'etc-content') {
        checkCalendarClick = true;
        return false;
    }

    var classCheck = ele.parentNode.classList;
    if (classCheck == 'd-header' || 
        classCheck == 'd-next' || 
        classCheck == 'd-previous') {
        checkCalendarClick = false;
        setTimeout(function () {
            checkCalendarClick = true;
        }, 300);
        return false;
    } else if (classCheck == 'etc-date' || classCheck == 'etc-content') {
    	displaySelectedDates();
    	switch(ele.children[0].id) {
    		case "etc-start-date":
		        document.querySelector('#etc-end-date-txt').classList.remove('active');
		        document.querySelector('#etc-except-date').classList.remove('active');
		        document.querySelector('#etc-end-date-picker').style.display = 'none';
		        document.querySelector('#etc-except-date-picker').style.display = 'none';
    			break;

    		case "etc-end-date":
		        document.querySelector('#etc-start-date-txt').classList.remove('active');
		        document.querySelector('#etc-except-date').classList.remove('active');
		        document.querySelector('#etc-start-date-picker').style.display = 'none';
		        document.querySelector('#etc-except-date-picker').style.display = 'none';
    			break;

    		case "etc-except-date":
		        document.querySelector('#etc-start-date-txt').classList.remove('active');
		        document.querySelector('#etc-end-date-txt').classList.remove('active');
		        document.querySelector('#etc-start-date-picker').style.display = 'none';
		        document.querySelector('#etc-end-date-picker').style.display = 'none';
    			break;

    		default:
		        document.querySelector('#etc-start-date-txt').classList.remove('active');
		        document.querySelector('#etc-end-date-txt').classList.remove('active');
		        document.querySelector('#etc-except-date').classList.remove('active');
		        document.querySelector('#etc-start-date-picker').style.display = 'none';
		        document.querySelector('#etc-end-date-picker').style.display = 'none';
		        document.querySelector('#etc-except-date-picker').style.display = 'none';

    			break;
    	}    	
        checkCalendarClick = false;
        return false;
    } else if (classCheck == 'pace-disable') {
        checkCalendarClick = true;
        return false;
    } else {
        dataCheck(ele.parentNode);
    }
}
function displaySelectedDates() {
	var selectedExceptDate = (document.querySelector('#select-except-date'))? document.querySelector('#select-except-date').value:'';
	selectedExceptDate = (selectedExceptDate == '-')? '':selectedExceptDate;
	var selecteDateYMD = document.querySelector('#select-date-ymd');

	if(selectedExceptDate.length > 0) {
		var dates = selectedExceptDate.split(',');
		var exceptPickerContainer = document.querySelector('#etc-except-date-picker');
		dates.forEach(function(v,i,el) {
			var exceptPickerDate = exceptPickerContainer.querySelector('[data-date="' + v + '"]');
			var exceptPickerDate2 = exceptPickerContainer.querySelector('[data-term_date="' + v + '"]:not(disabled)');
			if(exceptPickerDate) {
				exceptPickerDate.classList.add('active');
				if(exceptPickerDate.getAttribute('disabled') == 'true') {
					exceptPickerDate.classList.remove('active');
				}
			}
			if(exceptPickerDate2) exceptPickerDate2.checked = true;
		});

		$('.unselect-all').removeClass('disabled');
	} else {
		if(document.querySelector('.etc-except-date-status')) document.querySelector('.etc-except-date-status').innerText = '';
		$('.unselect-all').addClass('disabled');
	}

	if(selecteDateYMD){
		var activeDate = selecteDateYMD.value;
		$('.Datepickk input[data-term_date="'+activeDate+'"]').addClass('active').prop('checked', true);
	}
}
function setExceptPicker() {
	var $days = $('#etc-except-date-picker .date-pick-input'),
		userStartDate = $('#etc-start-date-txt').val(),
		userEndDate = $('#etc-end-date-txt').val(),
		dateWeek = $('#etc-date-week').val();
		exceptPicker.disabledDays = null;
        if(dateWeek == 'W') {
            exceptPicker.disabledDays = [0, 6];
        } else if(dateWeek == 'K') {
            exceptPicker.disabledDays = [1, 2, 3, 4, 5];
        } else {
            exceptPicker.disabledDays = null;
        }
	$.each($days, function(i,v) {
		// console.log($(this));
		var s = $(this).attr('data-date'),
			c = refreshDays(s,userStartDate,userEndDate);
		(c) ? $(this).next().removeClass('disabled').addClass('exp') : $(this).next().removeClass('exp').addClass('disabled');
	});

	displaySelectedDates();
}

function refreshDays(d,s,e) {
	var _start = s.replace(/\./g, '-'),
		_end = e.replace(/\./g, '-'),
		_day = d.replace(/\./g, '-');

	var dp = moment(_day),
		start = moment(_start),
		end = moment(_end);

	return (dp < start || dp > end) ? false : true;
}