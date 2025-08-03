(function ($) {
	if(typeof jQuery === 'undefined') {
		throw 'jQuery not loaded';
	}
	var datepicker = function(elem, opt) {
		var picker = {},
		widget = false,

		getTemplateHead = function() {
			var template = '';
			template += '<div class="ui-datepicker-close" style="' + (opt.showClose === false ? ' display: none; ' : '') + '">&times;</div>';
			if(opt.theme == 'duration' || opt.theme == 'duration-mobile') {
				var d_today = convertDateString(new Date().getTime());
				var d_yesterday = convertDateString(new Date().getTime() - 86400000);
				var d_7daysago = convertDateString(new Date().getTime() - (86400000 * 7));
				var d_30daysago = convertDateString(new Date().getTime() - (86400000 * 30));

				var d_closest_monday = convertDateString(new Date(new Date(new Date().setDate(new Date().getDate() - (new Date().getDay() == 0 ? 6 : new Date().getDay() - 1)))));
				var d_closest_sunday = convertDateString(new Date(new Date(new Date().setDate(new Date().getDate() - (new Date().getDay() == 0 ? 6 : new Date().getDay() - 1 - 6)))));
				var d_lastweek_monday = convertDateString(new Date(new Date(new Date().setDate(new Date().getDate() - (new Date().getDay() == 0 ? 6 : new Date().getDay() - 1))) - (86400000 * 7)));
				var d_lastweek_sunday = convertDateString(new Date(new Date(new Date().setDate(new Date().getDate() - (new Date().getDay() == 0 ? 6 : new Date().getDay() - 1 - 6))) - (86400000 * 7)));
				var d_thismonth_firstday = convertDateString(new Date(new Date().setDate(1)));
				var d_thismonth_lastday = convertDateString(new Date(new Date(new Date().setMonth(new Date().getMonth()+1)).setDate(0)));
				var d_lastmonth_firstday = convertDateString(new Date(new Date(new Date().setMonth(new Date().getMonth()-1)).setDate(1)));
				var d_lastmonth_lastday = convertDateString(new Date(new Date(new Date().setMonth(new Date().getMonth())).setDate(0)));

				template += '<div class="ui-datepicker-selectduration">\
								<div class="ui-datepicker-selectduration-item" data-start_date="' + d_today + '" data-end_date="' + d_today + '">' + $.lang[LANG]['shopping.statistics.today'] + '</div>\
								<div class="ui-datepicker-selectduration-item" data-start_date="' + d_yesterday + '" data-end_date="' + d_yesterday + '">' + $.lang[LANG]['shopping.statistics.yesterday'] + '</div>\
								<div class="ui-datepicker-selectduration-item" data-start_date="' + d_7daysago + '" data-end_date="' + d_yesterday + '">' + $.lang[LANG]['shopping.statistics.7daysago'] + '</div>\
								<div class="ui-datepicker-selectduration-item" data-start_date="' + d_30daysago + '" data-end_date="' + d_yesterday + '">' + $.lang[LANG]['shopping.statistics.30daysago'] + '</div>\
								<div class="ui-datepicker-selectduration-item" data-start_date="' + d_lastweek_monday + '" data-end_date="' + d_lastweek_sunday + '">' + $.lang[LANG]['shopping.statistics.lastweek'] + '</div>\
								<div class="ui-datepicker-selectduration-item" data-start_date="' + d_closest_monday + '" data-end_date="' + d_closest_sunday + '">' + $.lang[LANG]['shopping.statistics.thisweek'] + '</div>\
								<div class="ui-datepicker-selectduration-item" data-start_date="' + d_lastmonth_firstday + '" data-end_date="' + d_lastmonth_lastday + '">' + $.lang[LANG]['shopping.statistics.lastmonth'] + '</div>\
								<div class="ui-datepicker-selectduration-item" data-start_date="' + d_thismonth_firstday + '" data-end_date="' + d_thismonth_lastday + '">' + $.lang[LANG]['shopping.statistics.thismonth'] + '</div>\
							</div>\
				';
			}
			template += '<div class="ui-datepicker-inline ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all ui-datepicker-multi ' + (opt.viewCount > 1 ? ('ui-datepicker-multi-' + opt.viewCount) : '')  + ' " style="display: block;">\
			';

			return template;
		},
		getDurationTemplateBody = function() {
			var leftStartDate = '';
			var rightStartDate = '';

			if(picker.leftDispDate) {
				leftStartDate = picker.leftDispDate;
			} else {
				leftStartDate = picker.leftCurrentDate;
			}

			if(picker.rightDispDate) {
				rightStartDate = picker.rightDispDate;
			} else {
				rightStartDate = picker.rightCurrentDate;
			}

			var leftCurrentDateArr 		= leftStartDate.split("-");
	        var leftCurrentDateYear 	= leftCurrentDateArr[0];
	        var leftCurrentDateMonth 	= leftCurrentDateArr[1];
	        var leftCurrentDateDay 		= leftCurrentDateArr[2];

			var rightCurrentDateArr 	= rightStartDate.split("-");
	        var rightCurrentDateYear 	= rightCurrentDateArr[0];
	        var rightCurrentDateMonth 	= rightCurrentDateArr[1];
	        var rightCurrentDateDay 	= rightCurrentDateArr[2];


        	var sundayClass = ' date-sunday ';
        	var saturdayClass = ' date-saturday ';
        	var holidayClass = ' date-holiday ';
        	var useableClass = ' ui-state-default ';
        	var activeClass = ' dp-highlight ';
        	var startClass = ' dp-first ';
        	var endClass = ' dp-end ';
        	var betweenClass = ' pd-between ';

	       	var template = '';


	        if(opt.minDate) {
	        	var minDateTime = getDateTime(opt.minDate);
	        }

	        if(opt.maxDate) {
	        	var maxDateTime = getDateTime(opt.maxDate);
	        }

	        var currentDateArr;
			var currentDateYear;
			var currentDateMonth;
			var currentDateDay;

	        for(var i=0; i<2; i++) {
	        	if(i == 0) {
	        		currentDateArr   	= leftCurrentDateArr;	
					currentDateYear 	= leftCurrentDateYear;
					currentDateMonth 	= leftCurrentDateMonth;
					currentDateDay 		= leftCurrentDateDay;
	        	} else if(i == 1) {
	        		currentDateArr 		= rightCurrentDateArr;	
					currentDateYear 	= rightCurrentDateYear;
					currentDateMonth 	= rightCurrentDateMonth;
					currentDateDay 		= rightCurrentDateDay;
	        	}
				var currentStartDate = new Date(currentDateYear, Number(currentDateMonth)-1, 1);
				var currentEndDate = new Date(currentDateYear, Number(currentDateMonth), 0);
				var currentStartDay = 1;
				var currentEndDay = currentEndDate.getDate();
				var dayArr = new Array();
				var startWeek = currentStartDate.getDay();

				var currentYear = currentStartDate.getFullYear();
				var currentMonth = (Number(currentStartDate.getMonth())+1) < 10 ? "0" + (Number(currentStartDate.getMonth())+1) : Number(currentStartDate.getMonth())+1;


				for (var ii=0; ii<startWeek; ii++) {
					dayArr[ii] = '';
				}		

				for(var ii=1; ii<=currentEndDay; ii++) {
					dayArr[startWeek] = ii;
					startWeek++;
				}

				template += '<div class="ui-datepicker-group ' + (i==0 ? ' ui-datepicker-group-left ' : ' ui-datepicker-group-right ') + '">\
								<div class="ui-datepicker-datetitle">' + (i == 0 ? $.lang[LANG]['shopping.statistics.startdate'] : $.lang[LANG]['shopping.statistics.enddate'] ) + '</div>\
									<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix ui-corner-left">';
				if(opt.minDate) {
					if(minDateTime < new Date(currentYear-1, currentMonth, 0).getTime()) {
						template += '<a class="ui-datepicker-prev-year ui-corner-all" title="이전년도">\
										<span class="ui-icon ui-icon-circle-triangle-w">' + opt.prevYearText + '</span>\
									</a>';
					}
					if(minDateTime < new Date(currentYear, currentMonth-1, 0).getTime()) {
						template += '<a class="ui-datepicker-prev ui-corner-all" title="이전">\
							                <span class="ui-icon ui-icon-circle-triangle-w">' + opt.prevText + '</span>\
							         </a>';
					}
				} else {
					template += '<a class="ui-datepicker-prev-year ui-corner-all" title="이전년도">\
									<span class="ui-icon ui-icon-circle-triangle-w">' + opt.prevYearText + '</span>\
								</a>';

					template += '<a class="ui-datepicker-prev ui-corner-all" title="이전">\
						                <span class="ui-icon ui-icon-circle-triangle-w">' + opt.prevText + '</span>\
						         </a>';

				}

				if(opt.maxDate) {
					if(maxDateTime > new Date(currentYear+1, currentMonth-1, 0).getTime()) {
						template += '<a class="ui-datepicker-next-year ui-corner-all" title="다음년도">\
										<span class="ui-icon ui-icon-circle-triangle-e">' + opt.nextYearText + '</span>\
									</a>';
					}
					if(maxDateTime > new Date(currentYear, currentMonth, 0).getTime()) {
						template += '<a class="ui-datepicker-next ui-corner-all" data-handler="next" data-event="click" title="다음">\
							              <span class="ui-icon ui-icon-circle-triangle-e">' + opt.nextText + '</span>\
							         </a>';		            
					}
				} else {
					template += '<a class="ui-datepicker-next-year ui-corner-all" title="다음년도">\
									<span class="ui-icon ui-icon-circle-triangle-e">' + opt.nextYearText + '</span>\
								</a>';

					template += '<a class="ui-datepicker-next ui-corner-all" data-handler="next" data-event="click" title="다음">\
						              <span class="ui-icon ui-icon-circle-triangle-e">' + opt.nextText + '</span>\
						         </a>';		            
				}



				template += '<div class="ui-datepicker-title">\
						    	<span class="ui-datepicker-year">' + currentYear + '</span>.&nbsp;<span class="ui-datepicker-month ui-datepicker-m3">' + currentMonth + '</span>\
						     </div>\
						</div>';


				template += ' <table class="ui-datepicker-calendar ' + (opt.range ? ' ui-datepicker-range ' : '')  + '">\
		            <thead>\
		                <tr>';

		        for(var ii=0; ii<=6; ii++) {
		        	template += '<th class="' + (ii==0 || ii==6 ? 'ui-datepicker-week-end' : '') + '">\
		                        	<span class="' + (ii==0 ? ' Sunday' : '') + (ii==6 ? ' Saturday' : '') + '">' + opt.weekText[ii] + '</span>\
		                    	</th>';
		        }
		        
		        template += '</tr>\
		            	</thead>';


		        template += '<tbody>';

	        	var pickerDateTime = '';


	        	if(opt.range === false) {
	        		if(opt.multiSelect === false) {
	        			if(picker.currentDate) {
		        			var pickerDate = picker.currentDate;
		        			var pickerDateArr = pickerDate.split("-");
		        			var pickerYear = pickerDateArr[0];
		        			var pickerMonth = pickerDateArr[1];
		        			var pickerDay = pickerDateArr[2];
		        			pickerDateTime = new Date(pickerYear, Number(pickerMonth)-1, pickerDay).getTime();
		        		}
	        		} else {
	        			var pickerDateArr = new Array();
	        			$(picker.currentDateArr).each(function() {
	        				var pickerDateSplit = this.split("-");
	        				var pickerYear = pickerDateSplit[0];
	        				var pickerMonth = pickerDateSplit[1];
	        				var pickerDay = pickerDateSplit[2];
	        				pickerDateTime = new Date(pickerYear, Number(pickerMonth)-1, pickerDay).getTime();
	        				pickerDateArr.push(pickerDateTime);
	        			});
	        		}
	        	} else {
	        		// if(i == 0) {
		        		var pickerStartDate = picker.startDate;
		        		var pickerStartDateArr = pickerStartDate.split("-");
		        		var pickerStartYear = pickerStartDateArr[0];
		        		var pickerStartMonth = pickerStartDateArr[1];
		        		var pickerStartDay = pickerStartDateArr[2];

		        		var pickerEndDate = picker.endDate;
		        		var pickerEndDateArr = pickerEndDate.split("-");
		        		var pickerEndYear = pickerEndDateArr[0];
		        		var pickerEndMonth = pickerEndDateArr[1];
		        		var pickerEndDay = pickerEndDateArr[2];

		        		pickerStartDateTime = new Date(pickerStartYear, Number(pickerStartMonth)-1, pickerStartDay).getTime();
		        		pickerEndDateTime = new Date(pickerEndYear, Number(pickerEndMonth)-1, pickerEndDay).getTime();
					// }
	        	}



		        $(dayArr).each(function(key) {
		        	var tdClass = '';
		        	var aClass = '';
		        	if(key == 0 || key % 7 == 0) {
		        		template += '<tr>';
		        		tdClass += sundayClass;
		        	}

		        	if(key % 7 == 6) tdClass += saturdayClass;

		        	

		        	if(this != '') {
		        		aClass += useableClass;
						var currentDateTime = new Date(currentYear, currentMonth-1, this).getTime();
		        		if(opt.range === false) {
		        			if(opt.multiSelect === false) {
					        	if(currentDateTime == pickerDateTime) tdClass += activeClass;
					        } else {
					        	if(pickerDateArr.indexOf(currentDateTime) > -1) tdClass += activeClass;
					        }
				        } else {
				        	var flag = false;
				        	if(currentDateTime == pickerStartDateTime) {
				        		tdClass += activeClass + startClass;
				        	}

			        		if(currentDateTime > pickerStartDateTime && currentDateTime < pickerEndDateTime) {
			        			tdClass += activeClass + betweenClass;
			        		}

				        	if(currentDateTime == pickerEndDateTime) {
				        		tdClass += activeClass + endClass;
				        		flag = false;
				        	}
				        }

				        if(opt.minDate) {
				        	if(currentDateTime < minDateTime) {
				        		tdClass = ' ui-state-disabled ';
				        		aClass = '';
				        	}
				        }

				        if(opt.maxDate) {
							if(currentDateTime > maxDateTime) {
								tdClass = ' ui-state-disabled ';
								aClass = '';
							}				        	
				        }

				        if(opt.disabledDays) {
				        	if($.inArray(currentDateTime, picker.disabledDateTime) > -1) {
								tdClass = ' ui-state-disabled ';
								aClass = '';
				        	}
				        }

				        if(opt.holidays) {
				        	if($.inArray(currentDateTime, picker.holidaysDateTime) > -1) {
								tdClass += ' date-holiday ';
				        	}
				        }

				        if(currentDateTime == new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime()) {
				        	tdClass += ' ui-datepicker-today ';
				        }

			        }


		        	template += '<td class="' + tdClass + '" data-handler="selectDay" data-event="click" data-month="' + currentMonth + '" data-year="' + currentYear + '" data-day="' + (this < 10 ? '0' + this : this) + '">\
		                       	 	<a class="' + aClass + '">' + (this != '' ? this : '') + '</a>\
		                    	</td>';

		        	if(key > 0 && key % 7 == 6) {
		        		template += '</tr>';
		        	}
		        });

		        template += '</tbody>';
		        template += '</table>'
		        template += '</div>';
			}

			if(opt.useTime === true) template += getTimeTemplate();

			return template;
		},

		getTemplateBody = function() {

			var startDate = '';

	        if(picker.dispDate) {
	        	startDate = picker.dispDate;
	        } else {
	        	startDate = picker.currentDate;
	        }

	        var currentDateArr = startDate.split("-");
	        var currentDateYear = currentDateArr[0];
	        var currentDateMonth = currentDateArr[1];
	        var currentDateDay = currentDateArr[2];


        	var sundayClass = ' date-sunday ';
        	var saturdayClass = ' date-saturday ';
        	var holidayClass = ' date-holiday ';
        	var useableClass = ' ui-state-default ';
        	var activeClass = ' dp-highlight ';
        	var startClass = ' dp-first ';
        	var endClass = ' dp-end ';
        	var betweenClass = ' pd-between ';

	       	var template = '';


	        if(opt.minDate) {
	        	var minDateTime = getDateTime(opt.minDate);
	        }

	        if(opt.maxDate) {
	        	var maxDateTime = getDateTime(opt.maxDate);
	        }

	       
			for(var i=0; i<opt.viewCount; i++) {
				var currentStartDate = new Date(currentDateYear, Number(currentDateMonth)-1+i, 1);
				var currentEndDate = new Date(currentDateYear, Number(currentDateMonth)+i, 0);
				var currentStartDay = 1;
				var currentEndDay = currentEndDate.getDate();
				var dayArr = new Array();
				var startWeek = currentStartDate.getDay();

				var currentYear = currentStartDate.getFullYear();
				var currentMonth = (Number(currentStartDate.getMonth())+1) < 10 ? "0" + (Number(currentStartDate.getMonth())+1) : Number(currentStartDate.getMonth())+1;

				if(i == 0) {
					picker.dispYear = currentDateYear;
					picker.dispMonth = currentDateMonth;
				}

				for (var ii=0; ii<startWeek; ii++) {
					dayArr[ii] = '';
				}		

				for(var ii=1; ii<=currentEndDay; ii++) {
					dayArr[startWeek] = ii;
					startWeek++;
				}

				template += '<div class="ui-datepicker-group">\
									<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix ui-corner-left">';
				if(i == 0) {
					if(opt.minDate) {
						if(minDateTime < new Date(currentYear-1, currentMonth, 0).getTime()) {
							template += '<a class="ui-datepicker-prev-year ui-corner-all" title="이전년도">\
											<span class="ui-icon ui-icon-circle-triangle-w">' + opt.prevYearText + '</span>\
										</a>';
						}
						if(minDateTime < new Date(currentYear, currentMonth-1, 0).getTime()) {
							template += '<a class="ui-datepicker-prev ui-corner-all" title="이전">\
								                <span class="ui-icon ui-icon-circle-triangle-w">' + opt.prevText + '</span>\
								         </a>';
						}
					} else {
						template += '<a class="ui-datepicker-prev-year ui-corner-all" title="이전년도">\
										<span class="ui-icon ui-icon-circle-triangle-w">' + opt.prevYearText + '</span>\
									</a>';

						template += '<a class="ui-datepicker-prev ui-corner-all" title="이전">\
							                <span class="ui-icon ui-icon-circle-triangle-w">' + opt.prevText + '</span>\
							         </a>';

					}
				} 

				if(i == (opt.viewCount - 1)) {
					if(opt.maxDate) {
						if(maxDateTime > new Date(currentYear+1, currentMonth-1, 0).getTime()) {
							template += '<a class="ui-datepicker-next-year ui-corner-all" title="다음년도">\
											<span class="ui-icon ui-icon-circle-triangle-e">' + opt.nextYearText + '</span>\
										</a>';
						}
						if(maxDateTime > new Date(currentYear, currentMonth, 0).getTime()) {
							template += '<a class="ui-datepicker-next ui-corner-all" data-handler="next" data-event="click" title="다음">\
								              <span class="ui-icon ui-icon-circle-triangle-e">' + opt.nextText + '</span>\
								         </a>';		            
						}
					} else {
						template += '<a class="ui-datepicker-next-year ui-corner-all" title="다음년도">\
										<span class="ui-icon ui-icon-circle-triangle-e">' + opt.nextYearText + '</span>\
									</a>';

						template += '<a class="ui-datepicker-next ui-corner-all" data-handler="next" data-event="click" title="다음">\
							              <span class="ui-icon ui-icon-circle-triangle-e">' + opt.nextText + '</span>\
							         </a>';		            
					}
				} 



				template += '<div class="ui-datepicker-title">\
						    	<span class="ui-datepicker-year">' + currentYear + '</span>.&nbsp;<span class="ui-datepicker-month ui-datepicker-m3">' + currentMonth + '</span>\
						     </div>\
						</div>';


				template += ' <table class="ui-datepicker-calendar ' + (opt.range ? ' ui-datepicker-range ' : '')  + '">\
		            <thead>\
		                <tr>';

		        for(var ii=0; ii<=6; ii++) {
		        	template += '<th class="' + (ii==0 || ii==6 ? 'ui-datepicker-week-end' : '') + '">\
		                        	<span class="' + (ii==0 ? ' Sunday' : '') + (ii==6 ? ' Saturday' : '') + '">' + opt.weekText[ii] + '</span>\
		                    	</th>';
		        }
		        
		        template += '</tr>\
		            	</thead>';


		        template += '<tbody>';

	        	var pickerDateTime = '';


	        	if(opt.range === false) {
	        		if(opt.multiSelect === false) {
	        			if(picker.currentDate) {
		        			var pickerDate = picker.currentDate;
		        			var pickerDateArr = pickerDate.split("-");
		        			var pickerYear = pickerDateArr[0];
		        			var pickerMonth = pickerDateArr[1];
		        			var pickerDay = pickerDateArr[2];
		        			pickerDateTime = new Date(pickerYear, Number(pickerMonth)-1, pickerDay).getTime();
		        		}
	        		} else {
	        			var pickerDateArr = new Array();
	        			$(picker.currentDateArr).each(function() {
	        				var pickerDateSplit = this.split("-");
	        				var pickerYear = pickerDateSplit[0];
	        				var pickerMonth = pickerDateSplit[1];
	        				var pickerDay = pickerDateSplit[2];
	        				pickerDateTime = new Date(pickerYear, Number(pickerMonth)-1, pickerDay).getTime();
	        				pickerDateArr.push(pickerDateTime);
	        			});
	        		}
	        	} else {
	        		if(picker.startDate) {
		        		var pickerStartDate = picker.startDate;
		        		var pickerStartDateArr = pickerStartDate.split("-");
		        		var pickerStartYear = pickerStartDateArr[0];
		        		var pickerStartMonth = pickerStartDateArr[1];
		        		var pickerStartDay = pickerStartDateArr[2];

		        		var pickerEndDate = picker.endDate;
		        		var pickerEndDateArr = pickerEndDate.split("-");
		        		var pickerEndYear = pickerEndDateArr[0];
		        		var pickerEndMonth = pickerEndDateArr[1];
		        		var pickerEndDay = pickerEndDateArr[2];

		        		pickerStartDateTime = new Date(pickerStartYear, Number(pickerStartMonth)-1, pickerStartDay).getTime();
		        		pickerEndDateTime = new Date(pickerEndYear, Number(pickerEndMonth)-1, pickerEndDay).getTime();
					}
	        	}



		        $(dayArr).each(function(key) {
		        	var tdClass = '';
		        	var aClass = '';
		        	if(key == 0 || key % 7 == 0) {
		        		template += '<tr>';
		        		tdClass += sundayClass;
		        	}

		        	if(key % 7 == 6) tdClass += saturdayClass;

		        	

		        	if(this != '') {
		        		aClass += useableClass;
						var currentDateTime = new Date(currentYear, currentMonth-1, this).getTime();
		        		if(opt.range === false) {
		        			if(opt.multiSelect === false) {
					        	if(currentDateTime == pickerDateTime) tdClass += activeClass;
					        } else {
					        	if(pickerDateArr.indexOf(currentDateTime) > -1) tdClass += activeClass;
					        }
				        } else {
				        	var flag = false;
				        	if(currentDateTime == pickerStartDateTime) {
				        		tdClass += activeClass + startClass;
				        	}

			        		if(currentDateTime > pickerStartDateTime && currentDateTime < pickerEndDateTime) {
			        			tdClass += activeClass + betweenClass;
			        		}

				        	if(currentDateTime == pickerEndDateTime) {
				        		tdClass += activeClass + endClass;
				        		flag = false;
				        	}
				        }

				        if(opt.minDate) {
				        	if(currentDateTime < minDateTime) {
				        		tdClass = ' ui-state-disabled ';
				        		aClass = '';
				        	}
				        }

				        if(opt.maxDate) {
							if(currentDateTime > maxDateTime) {
								tdClass = ' ui-state-disabled ';
								aClass = '';
							}				        	
				        }

				        if(opt.disabledDays) {
				        	if($.inArray(currentDateTime, picker.disabledDateTime) > -1) {
								tdClass = ' ui-state-disabled ';
								aClass = '';
				        	}
				        }

				        if(opt.holidays) {
				        	if($.inArray(currentDateTime, picker.holidaysDateTime) > -1) {
								tdClass += ' date-holiday ';
				        	}
				        }

				        if(currentDateTime == new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime()) {
				        	tdClass += ' ui-datepicker-today ';
				        }

			        }


		        	template += '<td class="' + tdClass + '" data-handler="selectDay" data-event="click" data-month="' + currentMonth + '" data-year="' + currentYear + '" data-day="' + (this < 10 ? '0' + this : this) + '">\
		                       	 	<a class="' + aClass + '">' + (this != '' ? this : '') + '</a>\
		                    	</td>';

		        	if(key > 0 && key % 7 == 6) {
		        		template += '</tr>';
		        	}
		        });

		        template += '</tbody>';
		        template += '</table>'
		        template += '</div>';
			}

			if(opt.useTime === true) template += getTimeTemplate();

			return template;
		},

		getTemplateFoot = function() {
			var template = '';
			if(opt.theme == 'duration') {
				template += '<div class="ui-datepicker-btn"><button type="button" class="btn ui-datepicker-btn-cancel">취소</button> <button type="button" class="btn ui-datepicker-btn-apply">적용</button></div>';
			}

			template += '</div>';
			return template;
		},


		getTemplate = function() {

			var template = $("<div>").addClass("uis-datepicker" + (opt.theme ? "-" + opt.theme : "")).addClass("hasDatepicker");

			template.append(getTemplateHead());

			if(opt.theme == 'duration') {
		        template.find(".ui-datepicker-inline").append(getDurationTemplateBody());	
		    } else {
		        template.find(".ui-datepicker-inline").append(getTemplateBody());
		    }
   
			template.append(getTemplateFoot());

			return template;
		},

		getTimeTemplate = function() {
			var template = '\
				<div class="ui-datepicker-time">\
					<div class="datepicker-timebar datepicker-hour">\
						<div class="datepicker-timebar-button up" data-value="1">\
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none">\
								<path d="M2.70711 15.7071L12.6066 5.80761M21.0919 15.7071L11.1924 5.80761" stroke="black" stroke-width="2"/>\
							</svg>\
						</div>\
						<div style="height: 50px;">\
							<input type="text" name="" value="' + picker.currentHour + '" class="hour" maxlength="2" />\
						</div>\
						<div class="datepicker-timebar-button down" data-value="-1">\
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none">\
								<path d="M21.0919 8.29289L11.1924 18.1924M2.70711 8.29289L12.6066 18.1924" stroke="black" stroke-width="2"/>\
							</svg>\
						</div>\
					</div>\
					<div class="datepicker-timebar-separator">\
						<div>:</div>\
					</div>\
					<div class="datepicker-timebar datepicker-minute">\
						<div class="datepicker-timebar-button up" data-value="1">\
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none">\
								<path d="M2.70711 15.7071L12.6066 5.80761M21.0919 15.7071L11.1924 5.80761" stroke="black" stroke-width="2"/>\
							</svg>\
						</div>\
						<div style="height: 50px;">\
							<input type="text" name="" value="' + picker.currentMinute + '" class="minute" maxlength="2" />\
						</div>\
						<div class="datepicker-timebar-button down" data-value="-1">\
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none">\
								<path d="M21.0919 8.29289L11.1924 18.1924M2.70711 8.29289L12.6066 18.1924" stroke="black" stroke-width="2"/>\
							</svg>\
						</div>\
					</div>\
				</div>\
			';

			return template;
		},

		getDateTime = function (dateString) {
			var dateArr = new Array();
			var no = getNumber(dateString);
			dateArr[0] = no.substr(0,4);
			dateArr[1] = no.substr(4,2);
			dateArr[2] = no.substr(6,2);
			return new Date(dateArr[0], dateArr[1], dateArr[2]).getTime();
		},

		convertDateString = function(datetime) {
			var date = new Date(datetime);
			var year = date.getFullYear().toString();
			var month = (date.getMonth() + 1).toString();
			var day = date.getDate().toString();
			if(month < 10) month = '0' + month;
			if(day < 10) day = '0' + day;
			return year + '-' + month + '-' + day;
		},

		getNumber = function (dateString) {
			var no = dateString.toString().replace(/[^0-9]/g,'');
			return no;
		},

		dateFormatting = function (dateString) {
			if(!dateString) return '';
			
			var dateArr = new Array();
			var no = getNumber(dateString);



			var yearPos=0;
			var monthPos=1;
			var dayPos=2;				

			if(opt.format) {
				yearPos = opt.format.indexOf('%Y');
				monthPos = opt.format.indexOf('%m');
				dayPos = opt.format.indexOf('%d');
			}

			var formatArr = new Array();
			if(yearPos > -1) formatArr[yearPos] = 'Y';
			if(monthPos > -1) formatArr[monthPos] = 'm';
			if(dayPos > -1) formatArr[dayPos] = 'd';

			var formatStrLen = new Array();
			formatStrLen['Y'] = 4;
			formatStrLen['m'] = 2;
			formatStrLen['d'] = 2;

			var strPos = 0;

			var filterFormatArr = formatArr.filter(function(format) {return format != ''});

			$(filterFormatArr).each(function() {
				dateArr[this] = no.substr(strPos, formatStrLen[this]);
				strPos+= formatStrLen[this];

			});

			var returnString = '';

			returnString = dateArr['Y'] + '-' + dateArr['m'] + '-' + dateArr['d'];
			return returnString;
		},

		dateCustomFormatting = function (dateString) {
			if(!dateString) return '';
			var dateArr = new Array();
			var no = getNumber(dateString);
			dateArr[0] = no.substr(0,4);
			dateArr[1] = no.substr(4,2);
			dateArr[2] = no.substr(6,2);

			var returnString = '';

			if(opt.format) {
				returnString = opt.format.replace('%Y', dateArr[0]).replace('%m', dateArr[1]).replace('%d', dateArr[2]);
			} else {
				returnString = dateArr[0] + '-' + dateArr[1] + '-' + dateArr[2];
			}

			return returnString;
		},

		create = function() {
			var data = elem.val();
			if(data) {
				if(opt.theme == 'duration') {
					opt.range = true;
					opt.multiSelect = false;
					opt.useTime = false;
				}

				if(opt.range === false) {
					if(opt.multiSelect === false) {
						if(opt.useTime === true) {
							var dataArr = data.split(' ');
							if(dataArr[1]) {
								var hourMinute = dataArr[1].split(":");
								var hour = hourMinute[0];
								var minute = hourMinute[1];
							}
							setHour(hour);
							setMinute(minute);
							data = dataArr[0];
						}
						setDate(dateFormatting(data));
					} else {
						var arr = data.split(",");
						$(arr).each(function(idx) {
							setDateArray(dateFormatting(arr[idx]));
						});
						
					}
				} else {
					var dataArr = data.split(",");
					setStartDate(dateFormatting(dataArr[0]));
					setEndDate(dateFormatting(dataArr[1]));
				}
			} else {
				if(opt.theme == 'duration') {
					picker.leftDispDate = convertDateString(new Date().getTime());
					picker.rightDispDate = convertDateString(new Date().getTime());
				} else {
					picker.dispDate = convertDateString(new Date().getTime());
				}
				if(opt.range === true) {
					picker.startDate = picker.dispDate;
					picker.endDate = picker.dispDate;
				}
				if(opt.useTime === true) {
					if(!picker.currentHour) picker.currentHour = 0;
					if(!picker.currentMinute) picker.currentMinute = 0;
				}
			}

			if(opt.monthStep > opt.viewCount) opt.monthStep = opt.viewCount;

			widget = getTemplate();

			if(opt.css) {
				$.each(opt.css, function(styleName, styleValue) {
					widget.css(styleName, styleValue);
				})
			}

			drawDuration();

			return widget;
		},

		updateDay = function() {

			if(opt.disabledDays) {
				picker.disabledDateTime = new Array();
				$(opt.disabledDays).each(function() {
					picker.disabledDateTime.push(getDateTime(this));
				});
			}

	        if(opt.holidays) {
	        	picker.holidaysDateTime = new Array();
	        	$(opt.holidays).each(function() {
					picker.holidaysDateTime.push(getDateTime(this));
	        	});
	        }

	        if(!widget) return;

	        if(opt.theme == 'duration') {
				widget.find(".ui-datepicker-inline").html(getDurationTemplateBody());
			} else {
				widget.find(".ui-datepicker-inline").html(getTemplateBody());
			}

			if(opt.range === false) {
				if(opt.multiSelect === true) {
					widget.find(".ui-state-default").on("click", function() {
						$(this).closest("td").toggleClass("dp-highlight");
						setDateArray($(this).closest("td").data("year").toString() + '-' + $(this).closest("td").data("month").toString() + '-' + $(this).closest("td").data("day").toString());
					});
				} else {
					widget.find(".ui-state-default").on("click", function() {
						widget.find(".ui-state-default").closest("td").removeClass("dp-highlight");
						$(this).closest("td").addClass("dp-highlight");
						setDate($(this).closest("td").data("year").toString() + '-' + $(this).closest("td").data("month").toString() + '-' + $(this).closest("td").data("day").toString());
					});
				}
			} else {
				if(opt.theme == 'duration') {
					if(opt.theme == 'duration' && $(window).width() < 768) {

						widget.find(".ui-state-default").on("click", function(e) {
							widget.find(".ui-datepicker-selectduration .ui-datepicker-selectduration-item").removeClass("active");
							if(!picker.startDate) {
								setStartDate($(this).closest("td").data("year").toString() + '-' + $(this).closest("td").data("month").toString() + '-' + $(this).closest("td").data("day").toString());
								drawDuration();
							} else if(!picker.endDate) {
								setEndDate($(this).closest("td").data("year").toString() + '-' + $(this).closest("td").data("month").toString() + '-' + $(this).closest("td").data("day").toString());
								drawDuration();
							} else {
								setEndDate('');
								setStartDate($(this).closest("td").data("year").toString() + '-' + $(this).closest("td").data("month").toString() + '-' + $(this).closest("td").data("day").toString());
								picker.rightDispDate = picker.leftDispDate;
								drawDuration();
							}
						});
					} else {
						widget.find(".ui-datepicker-group-left .ui-state-default").on("click", function(e) {
							widget.find(".ui-datepicker-selectduration .ui-datepicker-selectduration-item").removeClass("active");
							setStartDate($(this).closest("td").data("year").toString() + '-' + $(this).closest("td").data("month").toString() + '-' + $(this).closest("td").data("day").toString());
							drawDuration();
						});

						widget.find(".ui-datepicker-group-right .ui-state-default").on("click", function(e) {
							widget.find(".ui-datepicker-selectduration .ui-datepicker-selectduration-item").removeClass("active");
							setEndDate($(this).closest("td").data("year").toString() + '-' + $(this).closest("td").data("month").toString() + '-' + $(this).closest("td").data("day").toString());
							drawDuration();
						});
					}
				} else {
					widget.find(".ui-state-default").on("click", function(e) {
						if(!picker.startDate) {
							setStartDate($(this).closest("td").data("year").toString() + '-' + $(this).closest("td").data("month").toString() + '-' + $(this).closest("td").data("day").toString());
							drawDuration();
						} else if(!picker.endDate) {
							setEndDate($(this).closest("td").data("year").toString() + '-' + $(this).closest("td").data("month").toString() + '-' + $(this).closest("td").data("day").toString());
							drawDuration();
						} else {
							setEndDate('');
							setStartDate($(this).closest("td").data("year").toString() + '-' + $(this).closest("td").data("month").toString() + '-' + $(this).closest("td").data("day").toString());
							drawDuration();
						}
					});
				}
			}	

			if(opt.theme == 'duration') {
				widget.find(".ui-datepicker-group-left .ui-datepicker-next").on("click", function() {
					picker.leftDispDate = convertDateString(new Date(getDateTime(picker.leftDispDate)).setMonth(new Date(getDateTime(picker.leftDispDate)).getMonth()+opt.monthStep));
					updateDay();
				});

				widget.find(".ui-datepicker-group-left .ui-datepicker-prev").on("click", function() {
					picker.leftDispDate = convertDateString(new Date(getDateTime(picker.leftDispDate)).setMonth(new Date(getDateTime(picker.leftDispDate)).getMonth()-opt.monthStep));
					updateDay();
				});

				widget.find(".ui-datepicker-group-left .ui-datepicker-next-year").on("click", function() {
					picker.leftDispDate = convertDateString(new Date(getDateTime(picker.leftDispDate)).setYear(new Date(getDateTime(picker.leftDispDate)).getFullYear()+1));
					updateDay();
				});

				widget.find(".ui-datepicker-group-left .ui-datepicker-prev-year").on("click", function() {
					picker.leftDispDate = convertDateString(new Date(getDateTime(picker.leftDispDate)).setYear(new Date(getDateTime(picker.leftDispDate)).getFullYear()-1));
					updateDay();
				});

				widget.find(".ui-datepicker-group-right .ui-datepicker-next").on("click", function() {
					picker.rightDispDate = convertDateString(new Date(getDateTime(picker.rightDispDate)).setMonth(new Date(getDateTime(picker.rightDispDate)).getMonth()+opt.monthStep));
					updateDay();
				});

				widget.find(".ui-datepicker-group-right .ui-datepicker-prev").on("click", function() {
					picker.rightDispDate = convertDateString(new Date(getDateTime(picker.rightDispDate)).setMonth(new Date(getDateTime(picker.rightDispDate)).getMonth()-opt.monthStep));
					updateDay();
				});

				widget.find(".ui-datepicker-group-right .ui-datepicker-next-year").on("click", function() {
					picker.rightDispDate = convertDateString(new Date(getDateTime(picker.rightDispDate)).setYear(new Date(getDateTime(picker.rightDispDate)).getFullYear()+1));
					updateDay();
				});

				widget.find(".ui-datepicker-group-right .ui-datepicker-prev-year").on("click", function() {
					picker.rightDispDate = convertDateString(new Date(getDateTime(picker.rightDispDate)).setYear(new Date(getDateTime(picker.rightDispDate)).getFullYear()-1));
					updateDay();
				});
			} else {
				widget.find(".ui-datepicker-next").on("click", function() {
					picker.dispDate = convertDateString(new Date(getDateTime(picker.dispDate)).setMonth(new Date(getDateTime(picker.dispDate)).getMonth()+opt.monthStep));
					updateDay();
				});

				widget.find(".ui-datepicker-prev").on("click", function() {
					picker.dispDate = convertDateString(new Date(getDateTime(picker.dispDate)).setMonth(new Date(getDateTime(picker.dispDate)).getMonth()-opt.monthStep));
					updateDay();
				});

				widget.find(".ui-datepicker-next-year").on("click", function() {
					picker.dispDate = convertDateString(new Date(getDateTime(picker.dispDate)).setYear(new Date(getDateTime(picker.dispDate)).getFullYear()+1));
					updateDay();
				});

				widget.find(".ui-datepicker-prev-year").on("click", function() {
					picker.dispDate = convertDateString(new Date(getDateTime(picker.dispDate)).setYear(new Date(getDateTime(picker.dispDate)).getFullYear()-1));
					updateDay();
				});
			}

			widget.find(".ui-datepicker-close").on("click", function() {
				hide();
			});

			if(opt.useTime === true) {
				widget.find(".datepicker-hour .datepicker-timebar-button").on("click", function() {
					if(opt.range === false) {
						if(!picker.currentHour) picker.currentHour=0;
						picker.currentHour = Number(picker.currentHour) + Number($(this).data("value"));
						picker.currentHour = picker.currentHour > 23 ? 0 : (picker.currentHour < 0 ? 23 : picker.currentHour);
						picker.currentHour = picker.currentHour < 10 ? "0" + picker.currentHour : picker.currentHour;
						setHour(picker.currentHour);
						widget.find(".datepicker-hour input.hour").val(picker.currentHour);
					}
				});

				widget.find(".datepicker-minute .datepicker-timebar-button").on("click", function() {
					if(opt.range === false) {
						if(!picker.currentMinute) picker.currentMinute=0;
						picker.currentMinute = Number(picker.currentMinute) + Number($(this).data("value"));
						picker.currentMinute = picker.currentMinute > 59 ? 0 : (picker.currentMinute < 0 ? 59 : picker.currentMinute);
						picker.currentMinute = picker.currentMinute < 10 ? "0" + picker.currentMinute : picker.currentMinute;
						setMinute(picker.currentMinute);
						widget.find(".datepicker-minute input.minute").val(picker.currentMinute);
					}
				});
			}


			widget.find("[data-handler='selectDay'] .ui-state-default").on("click", function() {
				picker.onSelect(opt.onSelect);
			});

			if(opt.range == true)
				drawDuration();
		},

		show = function() {
			var elem_h = elem.outerHeight();
			var pos_t = opt.css.top ? opt.css.top : elem.position().top + elem.outerHeight();
			var pos_l = opt.css.left ? opt.css.left : elem.position().left;

			widget.css({"position": "absolute", "top" : pos_t + "px", "left" : pos_l + "px"});

			elem.after(widget);	
			updateDay();

			if(opt.useTime === true) {
				widget.find(".datepicker-hour .hour").on("keyup", function() {
					setHour($(this).val());
				});

				widget.find(".datepicker-minute .minute").on("keyup", function() {
					setMinute($(this).val());
				});
			}


			if(widget.offset().left + widget.width() > $(window).width()) {
				widget.css("left", "unset").css("right", "0");
			}

			widget.find(".ui-datepicker-selectduration .ui-datepicker-selectduration-item").on("click", function() {
				widget.find(".ui-datepicker-selectduration .ui-datepicker-selectduration-item").removeClass("active");
				$(this).addClass("active");
				setEndDate('');
				setStartDate('');
				setEndDate($(this).data("end_date"));
				setStartDate($(this).data("start_date"));
				updateDay();
				if(typeof opt.onSelect == 'function') {
					picker.onSelect(opt.onSelect);
				}

				if(typeof opt.onDurationSelect == 'function') {
					picker.onDurationSelect(opt.onDurationSelect);
				}
			});

			widget.find(".ui-datepicker-btn .ui-datepicker-btn-apply").on("click", function() {
				if(opt.onApply) picker.onApply(opt.onApply);
				picker.hide();
			});

			widget.find(".ui-datepicker-btn .ui-datepicker-btn-cancel").on("click", function() {
				if(opt.onCancel) picker.onCancel(opt.onCancel);
				// picker.hide();
			});


			if(typeof opt.onShow == 'function') {
				picker.onShow(opt.onShow);
			}
		},

		hide = function() {
			if(opt.useTime === true) {
				if(picker.currentHour.length < 2) {
					picker.currentHour = "0" + picker.currentHour;
					setHour(picker.currentHour);
				}

				if(picker.currentMinute.length < 2) {
					picker.currentMinute = "0" + picker.currentMinute;
					setMinute(picker.currentMinute);
				}
			}

			if(widget.is(":visible")) {
				widget.remove();
				picker.onHide(opt.onHide);
			}
		},

		setDate = function (newDate) {
			// if(!picker.dispDate) picker.dispDate = newDate;
			picker.dispDate = newDate;
			picker.currentDate = newDate;
			setInputValue();
		},

		getDateTime = function (dateString) {
			if(!dateString) return new Date().getTime();
			var date = getNumber(dateString);
			var year = date.substr(0,4);
			var month = date.substr(4,2);
			var day = date.substr(6,2);
			return new Date(year, Number(month)-1, day).getTime();
		},

		setStartDate = function (newStartDate) {
			if(opt.theme == 'duration') {
				if(newStartDate && picker.endDate && getDateTime(newStartDate) > getDateTime(picker.endDate)) {
					picker.rightDispDate = newStartDate;
					picker.endDate = newStartDate;
					// alert($.lang[LANG]['shopping.statistics.startinvalid']);
					// return;
				}
				picker.leftDispDate = newStartDate;
			} else {
				picker.dispDate = newStartDate;
			}
			picker.startDate = newStartDate;
			if(picker.endDate && getDateTime(picker.startDate) > getDateTime(picker.endDate) && newStartDate) {
				var tmpDate = picker.endDate;
				setEndDate(picker.startDate);
				setStartDate(tmpDate);
			}
			setInputValue();
		},

		getStartDateTime = function() {
			var startDate = picker.startDate;
			if(!picker.startDate) return;
			return getDateTime(startDate);
		},

		setEndDate = function (newEndDate) {
			if(opt.theme == 'duration') {
				if(newEndDate && picker.startDate && getDateTime(picker.startDate) > getDateTime(newEndDate)) {
					picker.leftDispDate = newEndDate;
					picker.startDate = newEndDate;
					// alert($.lang[LANG]['shopping.statistics.endinvalid']);
					// return;
				}
				picker.rightDispDate = newEndDate;
			} else {
				picker.dispDate = newEndDate;
			}
			picker.endDate = newEndDate;
			if(picker.startDate && getDateTime(picker.startDate) > getDateTime(picker.endDate) && newEndDate) {
				var tmpDate = picker.endDate;
				setEndDate(picker.startDate);
				setStartDate(tmpDate);
			}
			setInputValue();
		},

		getEndDateTime = function() {
			var endDate = picker.endDate;
			if(!picker.endDate) return;
			return getDateTime(endDate);
		},

		drawDuration = function() {
			if(!widget) return;

			$(widget).find(".dp-highlight").removeClass("dp-first");

			widget.find('.dp-highlight.dp-end').removeClass('dp-highlight').removeClass('dp-end');
			widget.find('.dp-highlight.pd-between').removeClass('dp-highlight').removeClass('pd-between');

			if(picker.startDate) {
				var startDateStr = getNumber(picker.startDate);
				widget.find('.dp-highlight').removeClass('dp-highlight');
				widget.find('.dp-highlight.dp-first').removeClass('dp-highlight').removeClass('dp-first');
				widget.find("td[data-handler='selectDay']").filter(function() {
					return $(this).data("year").toString()+$(this).data("month").toString()+$(this).data("day").toString() == startDateStr
				}).addClass("dp-highlight").addClass("dp-first");
			}

			if(picker.endDate) {
				var endDateStr = getNumber(picker.endDate);
				widget.find('.dp-highlight.dp-end').removeClass('dp-highlight').removeClass('dp-end');
				widget.find("td[data-handler='selectDay']").filter(function() {
					return $(this).data("year").toString()+$(this).data("month").toString()+$(this).data("day").toString() == endDateStr
				}).addClass("dp-highlight").addClass("dp-end");

				widget.find('.dp-highlight.pd-between').removeClass('dp-highlight').removeClass('pd-between');
				widget.find("td[data-handler='selectDay']").filter(function() {
					return $(this).data("year").toString()+$(this).data("month").toString()+$(this).data("day").toString() > startDateStr && $(this).data("year").toString()+$(this).data("month").toString()+$(this).data("day").toString() < endDateStr
				}).addClass("dp-highlight").addClass("pd-between");
			}

			if(opt.theme == 'duration') {
				widget.find(".ui-datepicker-selectduration .ui-datepicker-selectduration-item").removeClass("active");
				widget.find(".ui-datepicker-selectduration .ui-datepicker-selectduration-item[data-start_date='" + picker.startDate + "'][data-end_date='" + picker.endDate + "']").addClass("active");
				if(widget.find(".ui-datepicker-selectduration .ui-datepicker-selectduration-item[data-start_date='" + picker.startDate + "'][data-end_date='" + picker.endDate + "']:first").length) {
					picker.durationText = widget.find(".ui-datepicker-selectduration .ui-datepicker-selectduration-item[data-start_date='" + picker.startDate + "'][data-end_date='" + picker.endDate + "']:first").html();
				} else {
					if(!picker.getEndDate()) picker.durationText = 1 + $.lang[LANG]['shopping.statistics.datepicker.day'];
					else picker.durationText = Math.abs((getDateTime(picker.startDate) - getDateTime(picker.endDate)) / 86400000) + 1 + $.lang[LANG]['shopping.statistics.datepicker.day'];
				}
			}
		},

		setDateArray = function(newDate) {
			if(!picker.dispDate) picker.dispDate = newDate;
			if(!picker.currentDateArr) picker.currentDateArr = new Array();

			if($.inArray(newDate, picker.currentDateArr) > -1) {
				picker.currentDateArr.splice($.inArray(newDate, picker.currentDateArr), 1);
			} else {
				if(opt.minDate && getDateTime(newDate) < getDateTime(opt.minDate)) {
					picker.currentDateArr.splice($.inArray(newDate, picker.currentDateArr), 1);
				} else if(opt.maxDate && getDateTime(newDate) > getDateTime(opt.maxDate)) {
					picker.currentDateArr.splice($.inArray(newDate, picker.currentDateArr), 1);
				} else {
					picker.currentDateArr.push(newDate);
				}
			}
			picker.currentDateArr.sort();
			setInputValue();
		},

		checkDateArray = function () {
			var dateArray = new Array();
			
			$(picker.currentDateArr).each(function(idx) {
				if(opt.minDate && getDateTime(picker.currentDateArr[idx]) < getDateTime(opt.minDate)) {
					
				} else if(opt.maxDate && getDateTime(picker.currentDateArr[idx]) > getDateTime(opt.maxDate)) {
					
				} else {
					dateArray.push(picker.currentDateArr[idx]);
				}
			});
			picker.currentDateArr = new Array();
			picker.currentDateArr = dateArray;
			setInputValue();
		},

		setHour = function(newHour) {
			newHour = getNumber(newHour);
			if(!newHour) newHour = '00';
			if(newHour > 23 || newHour <0) newHour = '00';
			picker.currentHour = newHour;
			setInputValue();
		},

		setMinute = function(newMinute) {
			newMinute = getNumber(newMinute);
			if(!newMinute) newMinute = '00';
			if(newMinute > 59 || newMinute <0) newMinute = '00';
			picker.currentMinute = newMinute;
			setInputValue();
		},

		setInputValue = function() {
			var returnValue = '';
			if(opt.range === false) {
				if(opt.multiSelect === false) {
					returnValue = dateCustomFormatting(picker.currentDate);	
					if(opt.useTime === true) {
						returnValue += ' ' + picker.currentHour + ':' + picker.currentMinute;
						if(widget) widget.find(".datepicker-hour .hour").val(picker.currentHour);
						if(widget) widget.find(".datepicker-minute .minute").val(picker.currentMinute);
					}
				} else {
					returnValue = picker.currentDateArr.join(',');
				}
			} else {
				returnValue = dateCustomFormatting(picker.startDate) + ',' + dateCustomFormatting(picker.endDate);
			}

			elem.val(returnValue);
		};

		picker.show = function() {
			if(!widget) create();
			show();
		};

		picker.hide = function() {
			hide();
		};

		picker.setHolidays = function(holidays) {
			opt.holidays = holidays;
			updateDay();
		};

		picker.setMinDate = function(minDate) {
			opt.minDate = minDate;
			checkDateArray();
			updateDay();
		};

		picker.refresh = function() {
			hide();
			widget = null;
			picker.startDate = '';
			picker.endDate = '';
			create();
			show();
		};

		picker.getMinDate = function() {
			return opt.minDate;
		};

		picker.setMaxDate = function(maxDate) {
			opt.maxDate = maxDate;
			checkDateArray();
			updateDay();
		};

		picker.getMaxDate = function() {
			return opt.maxDate;
		}

		picker.setDisabledDays = function(disabledDays) {
			opt.disabledDays = disabledDays;
			updateDay();
		};

		picker.setViewCount = function(viewCount) {
			opt.viewCount = viewCount;
			if(widget) {
				widget.find(".ui-datepicker-inline, .ui-datepicker-close").remove();
				widget.append(getTemplateHead());
				updateDay();
			}
		};

		picker.onSelect = function(callback) {
			if(typeof callback == 'function') {
				callback(picker);
			}
		};

		picker.onDurationSelect = function(callback) {
			if(typeof callback == 'function') {
				callback(picker);
			}
		};

		picker.onShow = function(callback) {
			if(typeof callback == 'function') {
				callback(picker);
			}
		};

		picker.onHide = function(callback) {
			if(typeof callback == 'function') {
				callback(picker);
			}
		};

		picker.onApply = function(callback) {
			if(typeof callback == 'function') {
				callback(picker);
			}
		};

		picker.onCancel = function(callback) {
			if(typeof callback == 'function') {
				callback(picker);
			}
		}

		picker.getOpt = function() {
			return opt;
		};


		elem.prop("readonly", true);
		elem.on("focus", function(){
			if(!widget) create();
			show();
		});

		if(opt.autoHide !== false) {
			$(document).on("mousedown", function(e) {
				if(widget) {
					var container = widget;
					if (!container.is(e.target) && container.has(e.target).length === 0 && !elem.is(e.target) && elem.has(e.target).length === 0) {
						hide();
					}
				}
			});
		}

		if(opt.range === true) {
			picker.setStartDate = function(newStartDate) {
				setStartDate(newStartDate);
				updateDay();
			};

			picker.setEndDate = function(newEndDate) {
				setEndDate(newEndDate);
				updateDay();
			};

			picker.getStartDate = function() {
				return dateCustomFormatting(picker.startDate);
			}

			picker.getEndDate = function() {
				return dateCustomFormatting(picker.endDate);
			};

			picker.getDateArray = function() {
				var dateArr = new Array();
				if(picker.startDate && picker.endDate) {

					var startDateTime = getDateTime(picker.startDate);
					var endDateTime = getDateTime(picker.endDate);

					while(startDateTime <= endDateTime) {
						var currentDate = new Date(startDateTime);
						var year = currentDate.getFullYear();
						var month = currentDate.getMonth()+1;
						var day = currentDate.getDate();
						if(month < 10) month = '0'+month;
						if(day < 10) day = '0'+day;
						dateArr.push(dateCustomFormatting(year + '-' + month + '-' + day));
						startDateTime += 86400000;
					}
				}
				return dateArr;
			};
		} else {
			if(opt.multiSelect === false) {
				picker.setDate = function(newDate) {
					setDate(newDate);
					updateDay();
				};

				picker.getDate = function() {
					return picker.currentDate;
				};
			} else {
				picker.setDateArray = function(newDateArray) {
					picker.currentDateArr = new Array();
					$(newDateArray).each(function() {
						setDateArray(this);
					});
					updateDay();
				};

				picker.getDateArray = function() {
					var returnDateArr = new Array();
					$(picker.currentDateArr).each(function() {
						returnDateArr.push(dateCustomFormatting(this));
					});
					return returnDateArr;
				};
			}
		}

		if(opt.useTime === true) {
			picker.setHour = function(newHour) {
				setHour(newHour);
				updateDay();
			};

			picker.getHour = function() {
				return picker.currentHour;
			};

			picker.setMinute = function(newMinute) {
				setMinute(newMinute);
				updateDay();
			};

			picker.getMinute = function() {
				return picker.currentMinute;
			};
		}

		picker.setOpt = function(newOpt) {
			hide();
			widget = null;
			newOpt = $.extend(true, {}, opt, newOpt);
			var $this = $(elem);
			$this.data('DatePicker', null);
			$this.data('DatePicker', datepicker($this, newOpt));
			create();
		};

		widget = create();

		return picker;
	}


	$.fn.datepicker = function(opt) {
	    return this.each(function () {
	        var $this = $(this);
	            // create a private copy of the defaults object

	        if (!$this.data('DatePicker')) {
				opt = $.extend(true, {}, $.fn.datepicker.defaults, opt);
				$this.data('DatePicker', datepicker($this, opt));
			}
	    });
	};
	var week_lang = {'ko' : ['일', '월', '화', '수' ,'목', '금', '토'], 'en' : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] };

	$.fn.datepicker.defaults = {
		minDate : false,
		maxDate : false,
		disabledDays: false,
		format : '%Y-%m-%d',
		useTime : false,
		range : false,
		multiSelect : false,
		viewCount : 1,
		weekText : LANG ? week_lang[LANG] : week_lang['ko'],
		width : false, // default: 486
		holidays : false,
		prevText : '<svg viewBox="0 0 14 14" width="14" height="14"><polygon points="9 1 10 2 5 7 10 12 9 13 3 7 "/></svg>',
		nextText : '<svg viewBox="0 0 14 14" width="14" height="14"><polygon points="5 1 4 2 9 7 4 12 5 13 11 7 "/></svg>',
		prevYearText : '<svg viewBox="0 0 14 14" width="14" height="14"><polygon points="8 2 7 1 1 7 7 13 8 12 3 7 "/><polygon points="13 2 12 1 6 7 12 13 13 12 8 7 "/></svg>',
		nextYearText : '<svg viewBox="0 0 14 14" width="14" height="14"><polygon points="7 1 6 2 11 7 6 12 7 13 13 7 "/><polygon points="2 1 1 2 6 7 1 12 2 13 8 7 "/></svg>',
		monthStep: 1,
		showClose: false,
		theme : false,
		css : {},
		autoHide : true,
	}

})(jQuery);
