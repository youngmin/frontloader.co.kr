(function($) {
	var MAX_FILE_NUMBER = 10;
	$.forms = {
		init : function(pid) { 
			/*
			if($("head #datepicker_js").length == 0) {
				$("head").append("<script id='datepicker_js' src='/js/module/datepicker.js'></script>");
				$("head").append("<link href='/css/datepicker.css' rel='stylesheet' />");
			}
			if($("head #datepickk_js").length == 0) {
				$("head").append("<script id='datepickk_js' src='/js/datepickk/datepickk.js'></script>");
				$("head").append("<link href='/css/datepickk.css' rel='stylesheet' />");
			}
			*/
			if(typeof $.fn.fileupload == 'undefined') {
				// $('head').append('<script type="text/javascript" src="/js/jquery.fileupload.js"></script>');
			}
			$(function() {
				$("[data-type='form'] div[form-type='file.upload'] label").each(function(idx, v){
					if($(v).find('.file-uploaded-number').length == 0) {
						$(v).append(' <span class="file-uploaded-number">(0/10)</span>');
					}
				});
				$("[data-type='form'] div[form-type='file.upload'] input[type='file']").prop('multiple', true);
				
				// console.log(pid);
        		var umember = (PAGE_MODE == 'c') ? UMEMBER : property.UMEMBER;			
        		var umemberActivate = (PAGE_MODE == 'c') ? Number(UMEMBER_ACTIVATE) : Number(property.UMEMBER_ACTIVATE);
        		var checkLogin = (PAGE_MODE == 'c') ? true : umember.check_login;

	            if (PAGE_MODE == 's' && umemberActivate == 0 && umember.id_type == 'creatorlink') { //creatorlink login
	                checkLogin = (umember.id !== undefined && umember.id) ? true : false;
	            }
	            // console.log('checkLogin', checkLogin);
				if(!checkLogin && typeof pid != 'undefined' && pid) {
					var $formEL = $('.element[data-id="'+pid+'"][data-type="form"]');
					var blocklang = $formEL.data('blocklang');
					var type2 = $formEL.attr('data-type2');
					if(!blocklang) blocklang = LANG;
					// console.log($formEL.attr('data-captcha'));
					if(type2 == 'form' && $formEL.attr('data-captcha') != 'false') {
						var captcha = `
										<div class="form-group form-captcha">
											<div class="kcaptcha-wrap display-flex">
												<div class="kcaptcha-box">
													<img src="//storage.googleapis.com/i.addblock.net/forum/captcha_sample_Img.jpg" id="kcaptcha" alt="" title="${$.lang[blocklang]['form.item.captcha-tip']}">
												</div>
												<div class="text-left kcaptcha-key-wrap">
													<input type="text" id="wr_key" name="wr_key" class="col-xs-12 col-sm-12 col-md-12 ed input-bg-opacity input-captcha" placeholder="${$.lang[blocklang]['form.item.captcha.placeholder']}">
													<a href="#" class="kcaptcha-change hand small fsize12">${$.lang[blocklang]['form.item.captcha-change']}</a>
												</div>
											</div>
										</div>
							`;
						$formEL.find('.form-inline .form-group.form-privacy').after(captcha);
						
						load_form_kcaptcha($formEL, pid);

						$formEL.find('.kcaptcha.small').on('click', function(e) {
							e.preventDefault();
							load_form_kcaptcha($formEL, pid);
						});
					}
				}

				$("[data-type='form'] div[form-type='file.upload'] input[type='file']").fileupload({
				    url: '/template/forms/upload-file',
				    dataType: 'json',
				    async: true,
				    pasteZone: null,
				    change : function (e, data) {
					    if(data.files.length > MAX_FILE_NUMBER || $(this).closest("div[form-type='file.upload']").find('.file-row').length + data.files.length > MAX_FILE_NUMBER){
					    	var modal = $(this).showModalFlat('',$.lang[LANG]['form.file.upload.limit'],true,false,'','ok','','cl-cmmodal cl-s-btn w560 cl-p130 cl-t80 cl-modal cl-none-title cl-close-btn','','',function() {
								$(document).on('keydown', function(e) {
									if(e.keyCode == 27) modal.modal('hide');
								});
							});
					    	return false; 
						}

						var maxsize = (property.VALIDPLAN && $.inArray(property.VALIDTYPE,['BN','SM']) > -1) ? 104857600 : 10485760;
						var flag = true;
						$.each(data.files, function(idx, file) {
							var filesize = file.size;
							if(file.size > maxsize) {
								filesize = (filesize/1024/1024).toFixed(1);
					            if(maxsize == 104857600) err = $.lang[LANG]['editor.upload.max.100'] + $.lang[LANG]['editor.upload.max.2'];
					            else err = $.lang[LANG]['editor.upload.max.1'] + $.lang[LANG]['editor.upload.max.2'];

								var modal = $(this).showModalFlat('', err, true, false, '', 'ok', '', 'cl-cmmodal cl-s-btn w560 cl-p130 cl-t80 cl-modal cl-none-title cl-close-btn','','',function() {
									$(document).on('keydown', function(e) {
										if(e.keyCode == 27) modal.modal('hide');
									});
								});

						    	flag = false;
						    	return false;
							}
						});

						if(!flag) return false;
					},
				    add: function(e,data) {
			            var r = $.upload_add(e,data,'flink');
				        if(r.submit) {
					        $('#loading').css('left','-100%');
					        $.processON();
					        data.submit();
				            // var jqXHR = data.submit();
				        } else {
				            var modal = $(this).showModalFlat('', r.err, true, false, '', 'ok', '', 'cl-cmmodal cl-s-btn w560 cl-p130 cl-t80 cl-modal cl-none-title cl-close-btn','','',function() {
								$(document).on('keydown', function(e) {
									if(e.keyCode == 27) modal.modal('hide');
								});
							});
				        }
				    },
				    done: function (e, data) {
				        if(typeof data.result.error != 'undefined' && data.result.error) {
				            // alert(data.result.error);
							var modal = $(this).showModalFlat('',data.result.error,true,false,'','ok','','cl-cmmodal cl-s-btn w560 cl-p130 cl-t80 cl-modal cl-none-title cl-close-btn','','',function() {
								$(document).on('keydown', function(e) {
									if(e.keyCode == 27) modal.modal('hide');
								});
							});
				            // $('.progress .progress-bar').css('width','0%');
				            $.processOFF();
				            return;
				        }
				        if(typeof data.result.file == 'undefined' || !data.result.file || typeof data.result.uploaded == 'undefined' || !data.result.uploaded) {
				        	var modal = $(this).showModalFlat('', $.lang[LANG]['form.file.upload.disabled'],true,false,'','ok','','cl-cmmodal cl-s-btn w560 cl-p130 cl-t80 cl-modal cl-none-title cl-close-btn','','',function() {
								$(document).on('keydown', function(e) {
									if(e.keyCode == 27) modal.modal('hide');
								});
							});
				            $.processOFF();
				            return;
				        }

				        if(data.result.uploaded) {
							var flink_s = (data.result.uploaded.file_size) ? Number(data.result.uploaded.file_size) : 0,
								flink_unit = (flink_s > 1024) ? 'MB' : 'KB',
								flink_size = (flink_s > 1024) ? flink_s/1024 : flink_s;
					        	
							var uploaded = data.result.uploaded;
							var thumb = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50" height="50"><g><path d="M28 16.82c0 1.21.98 2.18 2.18 2.18H40L28 7v9.82z" style="fill:#3870B2"/><path d="M30.18 19c-1.2 0-2.18-.98-2.18-2.18V7H13c-1.66 0-3 1.34-3 3v30c0 1.66 1.34 3 3 3h24c1.66 0 3-1.34 3-3V19h-9.82zM32 35H18v-2h14v2zm0-5H18v-2h14v2zm0-5H18v-2h14v2z" style="fill:#4789e7"/></g></svg>';
							if(uploaded.file_type.indexOf('image/') > -1 && uploaded.thumbnail_url) {
								thumb = '<img src="' + uploaded.thumbnail_url + '">';
							}
							
							$(this).closest("div[form-type='file.upload']").find("input[type='text']").remove();

							var fileRow = '\
								<div class="file-row display-flex align-items-center">\
			                        <div class="file-thumb">' + thumb + '</div>\
			                        <div>\
			                            <p class="file-name">'+uploaded.orig_name+'</p>\
			                            <p class="file-size">'+flink_size.toFixed(2) + flink_unit+'</p>\
			                            <input type="hidden" value="' + data.result.uploaded.orig_name + '||' + data.result.uploaded.file_size + 'KB' + '||' + data.result.file + '">\
			                        </div>\
			                        <span class="form-file-delete" data-src="'+uploaded.file_name+'">\
			                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" width="15" height="15"><g><path d="M2.35 12.65c-.2-.2-.2-.51 0-.71l9.6-9.6c.2-.2.51-.2.71 0 .2.2.2.51 0 .71l-9.6 9.6c-.2.2-.52.2-.71 0z"/><path d="M12.3 2.2a.47.47 0 0 0-.35.15l-9.6 9.6c-.2.2-.2.51 0 .71.1.1.23.15.35.15.13 0 .26-.05.35-.15l9.6-9.6c.2-.2.2-.51 0-.71-.1-.1-.22-.15-.35-.15z"/><path d="M12.65 12.65c-.2.2-.51.2-.71 0l-9.6-9.6c-.2-.2-.2-.51 0-.71.2-.2.51-.2.71 0l9.6 9.6c.2.2.2.52 0 .71z"/><path d="M2.7 2.2a.47.47 0 0 0-.35.15c-.2.2-.2.51 0 .71l9.6 9.6c.1.1.23.15.35.15.13 0 .26-.05.35-.15.2-.2.2-.51 0-.71l-9.6-9.6a.47.47 0 0 0-.35-.15z"/></g></svg>\
			                        </span>\
			                    </div>\
							';
							$(this).closest("div[form-type='file.upload']").find(".file-title").addClass('hide');
							$(this).closest("div[form-type='file.upload']").append(fileRow);

							// uploadedNum = ' <span class="file-uploaded-number">(' + $(this).closest("div[form-type='file.upload']").find('.file-row').length + '/' + MAX_FILE_NUMBER + ')</span>';
				        	$(this).closest('div[form-type="file.upload"]').find('.file-uploaded-number').text('(' + $(this).closest("div[form-type='file.upload']").find('.file-row').length + '/' + MAX_FILE_NUMBER + ')');
				        }
				        
				        if($(this).closest("div[form-type='file.upload']").find('.file-row').length >= MAX_FILE_NUMBER) {
				        	$(this).closest("div[form-type='file.upload']").find('label').addClass('disabled');
				        	$(this).closest("div[form-type='file.upload']").find('input[type="file"]').prop('disabled', true);
				        }
				        $.processOFF();
				        // $('#loading').css('left','50%');
				    },
				    // progressall: function (e, data) {
				    //     var progress = parseInt(data.loaded / data.total * 100, 10);
				    //     $('.progress .progress-bar').css(
				    //         'width',
				    //         progress + '%'
				    //     );

				    // },
				}).prop('disabled', !$.support.fileInput)
				    .parent().addClass($.support.fileInput ? undefined : 'disabled');

				// $("[data-type='form'] div[form-type='date'] input.date-ymd").datepicker({
				// 	"theme" : "mini",
				// 	onSelect: function(picker) {
				// 		picker.hide();
				// 	}
				// });
				$("[data-type='form'] div[form-type='date'] input, [data-type='form'] div[form-type='date'] input + svg").off("click");
				$("[data-type='form'] div[form-type='date'] input, [data-type='form'] div[form-type='date'] input + svg").on("click", function() {
					// $(this).prev().data("DatePicker").show();
					var id = $(this).closest('div').attr('form-seq');
					formDateTimePicker(id, 'date');
				});

				$("[data-type='form'] div[form-type='date2'] input, [data-type='form'] div[form-type='date2'] input + svg").off('click');
				$("[data-type='form'] div[form-type='date2'] input, [data-type='form'] div[form-type='date2'] input + svg").on('click', function() {
					var id = $(this).closest('div').attr('form-seq');
					formDateTimePicker(id, 'date2');
				});
			})
		}
	}

	$(function() {

		$.forms.init();

		// $(document).on("click", "[data-type='form'] div[form-type='date2'] .btn-option-hh", function() {
		// 	$(this).closest("div[form-type='date2']").find(".option-hh").show();
		// });

		// $(document).on("click", "[data-type='form'] div[form-type='date2'] .btn-option-ii", function() {
		// 	$(this).closest("div[form-type='date2']").find(".option-ii").show();
		// });

		// $(document).on("click", "[data-type='form'] div[form-type='date2'] .option-hh div", "click", function() {
		// 	$(this).closest("div[form-type='date2']").find("input.date-hh").val($(this).data("hh"));
		// 	$(this).closest(".option-hh").hide();
		// });

		// $(document).on("click", "[data-type='form'] div[form-type='date2'] .option-ii div", function() {
		// 	$(this).closest("div[form-type='date2']").find("input.date-ii").val($(this).data("ii"));
		// 	$(this).closest(".option-ii").hide();
		// });

		// $(document).on("mousedown", function(e) {
		// 	$("[data-type='form'] div[form-type='date2'] .option-hh").each(function() {
		// 	    var $container = $(this);
		// 	    var $trigger = $(this).closest("div[form-type='date2']").find(".btn-option-hh");
		// 	    if($trigger.has(e.target).length === 0 && !$trigger.is(e.target) && !$container.is(e.target) && $container.has(e.target).length === 0) $container.hide();
		// 	});

		// 	$("[data-type='form'] div[form-type='date2'] .option-ii").each(function() {
		// 	    var $container = $(this);
		// 	    var $trigger = $(this).closest("div[form-type='date2']").find(".btn-option-ii");
		// 	    if($trigger.has(e.target).length === 0 && !$trigger.is(e.target) && !$container.is(e.target) && $container.has(e.target).length === 0) $container.hide();
		// 	});
		// });

		$(document).on("click", "[data-type='form'] div[form-type='file.upload'] label", function(e) {
			var blocklang = $(this).closest('[data-type="form"]').data('blocklang');
			if(!blocklang) blocklang = LANG;

			if(e.target.nodeName.toLowerCase() == 'label' && $(this).find("input[type='file']").prop('disabled') == true) {
				e.preventDefault();
				var modal = $(this).showModalFlat('',$.lang[LANG]['form.file.upload.limit'],true,false,'','ok','','cl-cmmodal cl-s-btn w560 cl-p130 cl-t80 cl-modal cl-none-title cl-close-btn','','',function() {
					$(document).on('keydown', function(e) {
						if(e.keyCode == 27) modal.modal('hide');
					});
				});

				return false;
			}
		});
		

		$(document).on("click", "[data-type='form'] div[form-type='file.upload'] .form-file-delete", function() {
			var $elem = $(this);
			var blocklang = $(this).closest('[data-type="form"]').data('blocklang');
			if(!blocklang) blocklang = LANG;

			var $label = $(this).closest("div[form-type='file.upload']").find('label');
			var $inputFile = $(this).closest("div[form-type='file.upload']").find('input[type="file"]');

			if(confirm($.lang[blocklang]['form.file.confirm.delete'])) {
	    		$.ajax({
	    			url:"/template/forms/delete-file",
	    			type:"post",
	    			async: true,
	    			beforeSend: function() {
	    				$.processON();
	    			},
	    			data:{
	    				"s": $elem.data("src")
	    			},
	    			dataType:"json",
	    			success:function() {
						var fileRowCnt = $elem.closest("div[form-type='file.upload']").find('.file-row').length;

						if(fileRowCnt > 1) {
					        $elem.closest('div[form-type="file.upload"]').find('.file-uploaded-number').text('(' + (fileRowCnt - 1) + '/' + MAX_FILE_NUMBER + ')');
						} else {
					        $elem.closest('div[form-type="file.upload"]').find('.file-uploaded-number').text('(0/' + MAX_FILE_NUMBER + ')');
		    				$elem.closest("div[form-type='file.upload']").find('.file-title').removeClass('hide');							
						}
	    				
		    			if(fileRowCnt - 1 < MAX_FILE_NUMBER) {
				        	$label.removeClass('disabled');
				        	$inputFile.prop('disabled', false);
				        }
	    			},
	    			complete: function() {
	    				$elem.closest('.file-row').remove();
	    				$.processOFF();
	    			}
	    		});
	    	}
		});

		$(document).on("click", "[data-type='form'] div[form-type='file.upload'] .file-thumb img", function(e) {
			imgPopupFrame($(this).attr('src'));
		});
	});
})(jQuery);