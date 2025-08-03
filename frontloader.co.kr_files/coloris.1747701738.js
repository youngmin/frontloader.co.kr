 /*!
 * Copyright (c) 2021 Momo Bassit.
 * Licensed under the MIT License (MIT)
 * https://github.com/mdbassit/Coloris
 */
 if(typeof LANG == 'undefined') var LANG = (typeof getLanguage != 'undefined') ? getLanguage() : 'en';
 const _coloris_label = {
      save: (LANG == 'ko') ? '저장' : 'SAVE',
      cancel: (LANG == 'ko') ? '취소' : 'CANCEL',
      alpha: (LANG == 'ko') ? '불투명도' : 'Opacity',
      alpha_info: (LANG == 'ko') ? `투명 상태입니다.<br>색을 지정하려면 투명도 값을<br>변경해주세요.` : `It's transparent.<br>Adjust the opacity to set the color.`,
      hex: (LANG == 'ko') ? '컬러' : 'Color',
      guide: (LANG == 'ko') ? `RGB 방식 색상 코드 표기법입니다.` : `The color is expressed as an RGB color code.`,
  };


 (function (window, document, Math, undefined) {

    var checkReturnFuncArr = ['getColorSelectorPnInfo','getColorInfo','getChangeColorVal','getColorRegex'];
    var checkUsedFuncArr = [];

    var ctx = document.createElement('canvas').getContext('2d');
    var currentColor = { r: 0, g: 0, b: 0, h: 0, s: 0, v: 0, a: 1 };
    var container,picker,colorArea,colorMarker,colorPreview,colorValue,clearButton,closeButton,
    hueSlider,hueMarker,alphaSlider,alphaMarker,currentEl,currentFormat,oldColor,keyboardNav,
    colorCursor,hexInput,alphaInput,cancelButton,btnBox,picker_backdrop,
    colorAreaDims = {};

    var tooltipSVG = function(placement, add_class, title, offset) {
      var tooltip_offset = (offset) ? 'data-offset="'+offset+'"' : '';
      var svg_type = (add_class.indexOf('info') > -1) ? '\
        <path d="M6.5 13a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zm0-12C9.53 1 12 3.47 12 6.5S9.53 12 6.5 12 1 9.53 1 6.5 3.47 1 6.5 1z"/><path d="M6 5h1v5H6z"/><path d="M6 3h1v1H6z"/>\
      ' : '\
        <path d="M6.5 0C2.91 0 0 2.91 0 6.5S2.91 13 6.5 13 13 10.09 13 6.5 10.09 0 6.5 0zM6.5 12C3.47 12 1 9.53 1 6.5S3.47 1 6.5 1 12 3.47 12 6.5 9.53 12 6.5 12z"/>\
        <rect x="6" y="9" width="1" height="1"/>\
        <path d="M6.66 3.01C5.61 3.01 4.58 3.5 4.5 4.8c0 0.06-0.01 0.12 0 0.2h1.02c0-0.07 0.01-0.15 0.02-0.23 0.08-0.62 0.52-0.76 1.08-0.76 0.63 0 1.02 0.37 1.02 0.95 -0.01 0.48-0.3 0.87-0.76 1.34C6.21 6.97 6.02 7.37 6 8h0.99C7 7.66 7.04 7.37 7.67 6.75 8.17 6.27 8.7 5.68 8.7 4.87 8.7 3.85 7.89 3.01 6.66 3.01z"/>\
      ';
      var tooltip = '\
      <svg class="cm-popover-info ' + add_class + '" viewBox="0 0 13 13" width="13" height="13" ' + tooltip_offset + ' data-toggle="tooltip" data-placement="' + placement + '" data-html="true"  data-original-title="' + title + '">\
        ' + svg_type + '\
      </svg>';
    
      return tooltip;
    }
  
    // Default settings
    var settings = {
      el: '.coloris', //'[data-coloris]',
      parent: 'body',
      theme: 'default',
      themeMode: 'light',
      rtl: false,
      wrap: true,
      margin: 2,
      format: 'hex',
      formatToggle: false,
      swatches: [],
      swatchesOnly: false,
      alpha: true,
      forceAlpha: false,
      focusInput: false,
      selectInput: false,
      inline: false,
      defaultColor: '#000000',
      clearButton: false,
      clearLabel: 'Clear',
      closeButton: true, //false,
      closeLabel: _coloris_label.save,  //'Close',
      cancelButton: true,
      cancelLabel: _coloris_label.cancel,
      onChange: function onChange() {return undefined;},
      a11y: {
        open: 'Open color picker',
        cancel: 'Cancel the selected color',
        close: 'Save color picker', //'Close color picker',
        clear: 'Clear the selected color',
        marker: 'Saturation: {s}. Brightness: {v}.',
        hueSlider: 'Hue slider',
        alphaSlider: 'Opacity slider',
        alphaInput: 'Opacity value field',
        alphaLabel: _coloris_label.alpha,
        hexInput: 'Color Hex value field',
        hexLabel: _coloris_label.hex,
        input: 'Color value field',
        inputLabel: 'Color',
        format: 'Color format',
        swatch: 'Color swatch',
        instruction: 'Saturation and brightness selector. Use up, down, left and right arrow keys to select.' 
      }
      };
  
  
    // Virtual instances cache
    var instances = {};
    var currentInstanceId = '';
    var defaultInstance = {};
    var hasInstance = false;
  
    /**
     * Configure the color picker.
     * @param {object} options Configuration options.
     */
    function configure(options) {
      if (typeof options !== 'object') {
        return;
      }
  
      for (var key in options) {
        switch (key) {
          case 'el':
            bindFields(options.el);
            if (options.wrap !== false) {
              wrapFields(options.el);
            }
            break;
          case 'parent':
            container = document.querySelector(options.parent);
            if (container) {
              container.appendChild(picker);
              container.appendChild(picker_backdrop);
              settings.parent = options.parent;
  
              // document.body is special
              if (container === document.body) {
                container = undefined;
              }
            }
            break;
          case 'themeMode':
            settings.themeMode = options.themeMode;
            if (options.themeMode === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
              settings.themeMode = 'dark';
            }
          // The lack of a break statement is intentional
          case 'theme':
            if (options.theme) {
              settings.theme = options.theme;
            }
  
            // Set the theme and color scheme
            picker.className = "clr-picker clr-" + settings.theme + " clr-" + settings.themeMode;
  
            // Update the color picker's position if inline mode is in use
            if (settings.inline) {
              updatePickerPosition();
            }
            break;
          case 'rtl':
            settings.rtl = !!options.rtl;
            document.querySelectorAll('.clr-field').forEach(function (field) {return field.classList.toggle('clr-rtl', settings.rtl);});
            break;
          case 'margin':
            options.margin *= 1;
            settings.margin = !isNaN(options.margin) ? options.margin : settings.margin;
            break;
          case 'wrap':
            if (options.el && options.wrap) {
              wrapFields(options.el);
            }
            break;
          case 'formatToggle':
            settings.formatToggle = !!options.formatToggle;
            getEl('clr-format').style.display = settings.formatToggle ? 'block' : 'none';
            if (settings.formatToggle) {
              settings.format = 'auto';
            }
            break;
          case 'swatches':
            if (Array.isArray(options.swatches)) {(function () {
                var swatches = [];
  
                options.swatches.forEach(function (swatch, i) {
                  swatches.push("<button type=\"button\" id=\"clr-swatch-" + i + "\" aria-labelledby=\"clr-swatch-label clr-swatch-" + i + "\" style=\"color: " + swatch + ";\">" + swatch + "</button>");
                });
  
                getEl('clr-swatches').innerHTML = swatches.length ? "<div>" + swatches.join('') + "</div>" : '';
                settings.swatches = options.swatches.slice();})();
            }
            break;
          case 'swatchesOnly':
            settings.swatchesOnly = !!options.swatchesOnly;
            picker.setAttribute('data-minimal', settings.swatchesOnly);
            break;
          case 'alpha':
            settings.alpha = !!options.alpha;
            picker.setAttribute('data-alpha', settings.alpha);
            break;
          case 'inline':
            settings.inline = !!options.inline;
            picker.setAttribute('data-inline', settings.inline);
  
            if (settings.inline) {
              var defaultColor = options.defaultColor || settings.defaultColor;
  
              currentFormat = getColorFormatFromStr(defaultColor);
              updatePickerPosition();
              setColorFromStr(defaultColor);
            }
            break;
          case 'clearButton':
            // Backward compatibility
            if (typeof options.clearButton === 'object') {
              if (options.clearButton.label) {
                settings.clearLabel = options.clearButton.label;
                clearButton.innerHTML = settings.clearLabel;
              }
  
              options.clearButton = options.clearButton.show;
            }
            settings.clearButton = !!options.clearButton;
            clearButton.style.display = settings.clearButton ? 'block' : 'none';
            break;
          case 'clearLabel':
            settings.clearLabel = options.clearLabel;
            clearButton.innerHTML = settings.clearLabel;
            break;

          case 'closeButton':
            settings.closeButton = !!options.closeButton;

            if (settings.closeButton) {
              // picker.insertBefore(closeButton, colorPreview);
              btnBox.append(closeButton);
            } else {
              // colorPreview.appendChild(closeButton);
              paletteBox.appendChild(closeButton);
            }
            break;
          case 'closeLabel':
            settings.closeLabel = options.closeLabel;
            closeButton.innerHTML = settings.closeLabel;
            break;

          case 'cancelButton':
            settings.cancelButton = !!options.cancelButton;
  
            if (settings.cancelButton) {
              // picker.insertBefore(cancelButton, colorPreview);
              btnBox.append(cancelButton);
            } else {
              // colorPreview.appendChild(cancelButton);
              paletteBox.appendChild(cancelButton);
            }
            break;
          case 'cancelLabel':
            settings.cancelLabel = options.cancelLabel;
            cancelButton.innerHTML = settings.cancelLabel;
            break;

          case 'a11y':
            var labels = options.a11y;
            var update = false;
  
            if (typeof labels === 'object') {
              for (var label in labels) {
                if (labels[label] && settings.a11y[label]) {
                  settings.a11y[label] = labels[label];
                  update = true;
                }
              }
            }
  
            if (update) {
              var openLabel = getEl('clr-open-label');
              var swatchLabel = getEl('clr-swatch-label');
  
              openLabel.innerHTML = settings.a11y.open;
              swatchLabel.innerHTML = settings.a11y.swatch;
              closeButton.setAttribute('aria-label', settings.a11y.close);
              clearButton.setAttribute('aria-label', settings.a11y.clear);
              CancelButton.setAttribute('aria-label', settings.a11y.cancel);
              hueSlider.setAttribute('aria-label', settings.a11y.hueSlider);
              alphaInput.setAttribute('aria-label', settings.a11y.alphaInput);
              alphaSlider.setAttribute('aria-label', settings.a11y.alphaSlider);
              colorValue.setAttribute('aria-label', settings.a11y.input);
              colorArea.setAttribute('aria-label', settings.a11y.instruction);
            }
            break;
          default:
            settings[key] = options[key];}
  
      }
    }
  
    /**
     * Add or update a virtual instance.
     * @param {String} selector The CSS selector of the elements to which the instance is attached.
     * @param {Object} options Per-instance options to apply.
     */
    function setVirtualInstance(selector, options) {
      if (typeof selector === 'string' && typeof options === 'object') {
        instances[selector] = options;
        hasInstance = true;
      }
    }

    function returnInstance() {
      return instances;
    }
  
    /**
     * Remove a virtual instance.
     * @param {String} selector The CSS selector of the elements to which the instance is attached.
     */
    function removeVirtualInstance(selector) {
      delete instances[selector];
  
      if (Object.keys(instances).length === 0) {
        hasInstance = false;
  
        if (selector === currentInstanceId) {
          resetVirtualInstance();
        }
      }
    }
  
    /**
     * Attach a virtual instance to an element if it matches a selector.
     * @param {Object} element Target element that will receive a virtual instance if applicable.
     */
    function attachVirtualInstance(element) {
      if (hasInstance) {
        // These options can only be set globally, not per instance
        var unsupportedOptions = ['el', 'wrap', 'rtl', 'inline', 'defaultColor', 'a11y'];var _loop = function _loop(
  
        selector) {
          var options = instances[selector];
  
          // If the element matches an instance's CSS selector
          if (element.matches(selector)) {
            currentInstanceId = selector;
            defaultInstance = {};
  
            // Delete unsupported options
            unsupportedOptions.forEach(function (option) {return delete options[option];});
  
            // Back up the default options so we can restore them later
            for (var option in options) {
              defaultInstance[option] = Array.isArray(settings[option]) ? settings[option].slice() : settings[option];
            }
  
            // Set the instance's options
            configure(options);
            return "break";
          }};for (var selector in instances) {var _ret = _loop(selector);if (_ret === "break") break;
        }
      }
    }
  
    /**
     * Revert any per-instance options that were previously applied.
     */
    function resetVirtualInstance() {
      if (Object.keys(defaultInstance).length > 0) {
        configure(defaultInstance);
        currentInstanceId = '';
        defaultInstance = {};
      }
    }
  
    /**
     * Bind the color picker to input fields that match the selector.
     * @param {string} selector One or more selectors pointing to input fields.
     */
    function bindFields(selector) {
      // Show the color picker on click on the input fields that match the selector
      $(document).off('click input', selector);

      addListener(document, 'click', selector, function (event) {
        // Skip if inline mode is in use
        if (settings.inline) {
          return;
        }
  
        // Apply any per-instance options first
        attachVirtualInstance(event.target);
  
        currentEl = event.target;
        oldColor = currentEl.value;
        currentFormat = getColorFormatFromStr(oldColor);

        settings.alpha = (currentEl.classList.contains('clr-alphaoff')) ? false : true;
        picker.setAttribute('data-alpha', settings.alpha);
        picker.classList.add('clr-open');
        paletteBox.classList.add('ready');

        updatePickerPosition();
        setColorFromStr(oldColor);
  
        $('#clr-color-comment').addClass('hide');
        $('.back-black').addClass('hide');
        if(alphaInput.value == 0) {
          $('#clr-color-comment').removeClass('hide');
          $('.back-black').removeClass('hide');
        }
        
        if (settings.focusInput || settings.selectInput) {
          if(settings.focusInput) colorValue.focus({ preventScroll: true });
          if(settings.selectInput) colorValue.setSelectionRange(currentEl.selectionStart, currentEl.selectionEnd);
        }
  
        if (settings.selectInput) {
          colorValue.select();
        }
  
        // Always focus the first element when using keyboard navigation
        if (keyboardNav || settings.swatchesOnly) {
          getFocusableElements().shift().focus();
        }
  
        // Trigger an "open" event
        currentEl.dispatchEvent(new Event('open', { bubbles: true }));
      });
  
      // Update the color preview of the input fields that match the selector
      addListener(document, 'input', selector, function (event) {
        var parent = event.target.parentNode;
  
        // Only update the preview if the field has been previously wrapped
        if (parent.classList.contains('clr-field')) {
          parent.style.color = event.target.value;
        }
      });
    }
  
    /**
     * Update the color picker's position and the color gradient's offset
     */
    function updatePickerPosition() {
      var parent = container;
      var scrollY = window.scrollY;
      var pickerWidth = picker.offsetWidth;
      var pickerHeight = picker.offsetHeight;
      var reposition = { left: false, top: false };
      var parentStyle, parentMarginTop, parentBorderTop;
      var offset = { x: 0, y: 0 };
  
      if (parent) {
        parentStyle = window.getComputedStyle(parent);
        parentMarginTop = parseFloat(parentStyle.marginTop);
        parentBorderTop = parseFloat(parentStyle.borderTopWidth);
  
        offset = parent.getBoundingClientRect();
        offset.y += parentBorderTop + scrollY;
      }
  
      if (!settings.inline) {
        var coords = currentEl.getBoundingClientRect();
        var left = coords.x;
        var top = scrollY + coords.y + coords.height + settings.margin;
  
        // If the color picker is inside a custom container
        // set the position relative to it
        if (parent) {
          left -= offset.x;
          top -= offset.y;
  
          if (left + pickerWidth > parent.clientWidth) {
            left += coords.width - pickerWidth;
            reposition.left = true;
          }
  
          if (top + pickerHeight > parent.clientHeight - parentMarginTop) {
            if (pickerHeight + settings.margin <= coords.top - (offset.y - scrollY)) {
              top -= coords.height + pickerHeight + settings.margin * 2;
              reposition.top = true;
            }
          }
  
          top += parent.scrollTop;
  
          // Otherwise set the position relative to the whole document
        } else {
          if (left + pickerWidth > document.documentElement.clientWidth) {
            left += coords.width - pickerWidth;
            reposition.left = true;
          }
  
          if (top + pickerHeight - scrollY > document.documentElement.clientHeight) {
            if (pickerHeight + settings.margin <= coords.top) {
              top = scrollY + coords.y - pickerHeight - settings.margin;
              reposition.top = true;
            }
          }
        }

        if(top < 0) {
          top = 0;
          left -= 23;
        }
        if(top > document.documentElement.clientHeight - pickerHeight 
          && (!$('body').hasClass('off-config') && !$('html').hasClass('_scroll'))
        ) {
          top = document.documentElement.clientHeight - pickerHeight;
          left -= 23;
        }
  
        picker.classList.toggle('clr-left', reposition.left);
        picker.classList.toggle('clr-top', reposition.top);
        picker.style.left = left + "px";
        picker.style.top = top + "px";
        offset.x += picker.offsetLeft;
        offset.y += picker.offsetTop;
      }

      colorAreaDims = {
        width: colorArea.offsetWidth,
        height: colorArea.offsetHeight,
        x: colorArea.offsetLeft + offset.x,
        y: colorArea.offsetTop + offset.y };
  
    }
  
    /**
     * Wrap the linked input fields in a div that adds a color preview.
     * @param {string} selector One or more selectors pointing to input fields.
     */
    function wrapFields(selector) {
      document.querySelectorAll(selector).forEach(function (field) {
        var parentNode = field.parentNode;
  
        if (!parentNode.classList.contains('clr-field')) {
          var wrapper = document.createElement('div');
          var classes = 'clr-field';
  
          if (settings.rtl || field.classList.contains('clr-rtl')) {
            classes += ' clr-rtl';
          }
  
          wrapper.innerHTML = "<button type=\"button\" aria-labelledby=\"clr-open-label\"></button>";
          parentNode.insertBefore(wrapper, field);
          wrapper.setAttribute('class', classes);
          wrapper.style.color = field.value;
          wrapper.appendChild(field);
        }
      });
    }
  
    /**
     * Close the color picker.
     * @param {boolean} [revert] If true, revert the color to the original value.
     */
    function closePicker(revert) {
      if (currentEl && !settings.inline) {
        var prevEl = currentEl;
  
        // Revert the color to the original value if needed
        if (revert) {
          // This will prevent the "change" event on the colorValue input to execute its handler
          currentEl = undefined;
  
          if (oldColor !== prevEl.value) {
            prevEl.value = oldColor;
  
            // Trigger an "input" event to force update the thumbnail next to the input field
            prevEl.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
  
        // Trigger a "change" event if needed
        setTimeout(function () {// Add this to the end of the event loop
          if (oldColor !== prevEl.value) {
            prevEl.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
  
        // Hide the picker dialog
        picker.classList.remove('clr-open');
  
        // Reset any previously set per-instance options
        if (hasInstance) {
          resetVirtualInstance();
        }
  
        // Trigger a "close" event
        prevEl.dispatchEvent(new Event('close', { bubbles: true }));
  
        if (settings.focusInput) {
          prevEl.focus({ preventScroll: false });
        }
  
        // This essentially marks the picker as closed
        currentEl = undefined;
      }
    }
  
    /**
     * Set the active color from a string.
     * @param {string} str String representing a color.
     */
    function setColorFromStr(str) {
      var rgba = strToRGBA(str);
      var hsva = RGBAtoHSVA(rgba);
  
      updateMarkerA11yLabel(hsva.s, hsva.v);
      updateColor(rgba, hsva);
  
      // Update the UI
      hueSlider.value = hsva.h;
      picker.style.color = "hsl(" + hsva.h + ", 100%, 50%)";
      hueMarker.style.left = hsva.h / 360 * 100 + "%";
  
      colorMarker.style.left = colorAreaDims.width * hsva.s / 100 + "px";
      colorMarker.style.top = colorAreaDims.height - colorAreaDims.height * hsva.v / 100 + "px";
  
      alphaSlider.value = hsva.a * 100;
      alphaMarker.style.left = hsva.a * 100 + "%";
      alphaInput.value = alphaSlider.value;
    }
  
    /**
     * Guess the color format from a string.
     * @param {string} str String representing a color.
     * @return {string} The color format.
     */
    function getColorFormatFromStr(str) {
      var format = str.substring(0, 3).toLowerCase();
  
      if (format === 'rgb' || format === 'hsl') {
        return format;
      }
  
      return 'hex';
    }
  
    /**
     * Copy the active color to the linked input field.
     * @param {number} [color] Color value to override the active color.
     */
    function pickColor(color) {
      color = color !== undefined ? color : colorValue.value;

      if (currentEl) {
        currentEl.value = color;
        currentEl.dispatchEvent(new Event('input', { bubbles: true }));
      }
  
      if (settings.onChange) {
        settings.onChange.call(window, color, currentEl);
      }
  
      document.dispatchEvent(new CustomEvent('coloris:pick', { detail: { color: color, currentEl: currentEl } }));
    }
  
    /**
     * Set the active color based on a specific point in the color gradient.
     * @param {number} x Left position.
     * @param {number} y Top position.
     */
    function setColorAtPosition(x, y) {
      var hsva = {
        h: hueSlider.value * 1,
        s: x / colorAreaDims.width * 100,
        v: 100 - y / colorAreaDims.height * 100,
        a: alphaSlider.value / 100 };
  
      var rgba = HSVAtoRGBA(hsva);
  
      updateMarkerA11yLabel(hsva.s, hsva.v);
      updateColor(rgba, hsva);
      // pickColor();
    }
  
    /**
     * Update the color marker's accessibility label.
     * @param {number} saturation
     * @param {number} value
     */
    function updateMarkerA11yLabel(saturation, value) {
      var label = settings.a11y.marker;
  
      saturation = saturation.toFixed(1) * 1;
      value = value.toFixed(1) * 1;
      label = label.replace('{s}', saturation);
      label = label.replace('{v}', value);
      colorMarker.setAttribute('aria-label', label);
    }
  
    //
    /**
     * Get the pageX and pageY positions of the pointer.
     * @param {object} event The MouseEvent or TouchEvent object.
     * @return {object} The pageX and pageY positions.
     */
    function getPointerPosition(event) {
      return {
        pageX: event.changedTouches ? event.changedTouches[0].pageX : event.pageX,
        pageY: event.changedTouches ? event.changedTouches[0].pageY : event.pageY };
  
    }
  
    /**
     * Move the color marker when dragged.
     * @param {object} event The MouseEvent object.
     */
    function moveMarker(event) {
      var pointer = getPointerPosition(event);
      var x = pointer.pageX - colorAreaDims.x;
      var y = pointer.pageY - colorAreaDims.y;
  
      if (container) {
        y += container.scrollTop;
      }

      setMarkerPosition(x, y);
  
      // Prevent scrolling while dragging the marker
      event.preventDefault();
      event.stopPropagation();
    }
  
    /**
     * Move the color marker when the arrow keys are pressed.
     * @param {number} offsetX The horizontal amount to move.
     * @param {number} offsetY The vertical amount to move.
     */
    function moveMarkerOnKeydown(offsetX, offsetY) {
      var x = colorMarker.style.left.replace('px', '') * 1 + offsetX;
      var y = colorMarker.style.top.replace('px', '') * 1 + offsetY;
  
      setMarkerPosition(x, y);
    }
  
    /**
     * Set the color marker's position.
     * @param {number} x Left position.
     * @param {number} y Top position.
     */
    function setMarkerPosition(x, y) {
      
      // .clr-picker padding val
      x -= 22;
      y -= 20;

      // Make sure the marker doesn't go out of bounds
      x = x < 0 ? 0 : x > colorAreaDims.width ? colorAreaDims.width : x;
      y = y < 0 ? 0 : y > colorAreaDims.height ? colorAreaDims.height : y;

      // Set the position
      colorMarker.style.left = x + 'px';
      colorMarker.style.top = y + 'px';

      colorCursor.style.lfet = x + 'px';
      colorCursor.style.top = y + 'px';
  
      // Update the color
      setColorAtPosition(x, y);
  
      // Make sure the marker is focused
      colorMarker.focus();
    }
  
    /**
     * Update the color picker's input field and preview thumb.
     * @param {Object} rgba Red, green, blue and alpha values.
     * @param {Object} [hsva] Hue, saturation, value and alpha values.
     */
    function updateColor(rgba, hsva) {if (rgba === void 0) {rgba = {};}if (hsva === void 0) {hsva = {};}
      var format = settings.format;
  
      for (var key in rgba) {
        currentColor[key] = rgba[key];
      }
  
      for (var _key in hsva) {
        currentColor[_key] = hsva[_key];
      }
  
      var hex = RGBAToHex(currentColor);
      var opaqueHex = hex.substring(0, 7);
      var hex_zero = (hex.substring(7) != '') ? hex.substring(7) : 'ff';
  
      colorMarker.style.color = opaqueHex;
      alphaMarker.parentNode.style.color = opaqueHex;
      alphaMarker.style.color = hex;
      colorPreview.style.color = hex;
      if(paletteBox.classList.contains('ready')) {
        colorCurrent.style.color = hex;
        paletteBox.classList.remove('ready');
      }
  
      // Force repaint the color and alpha gradients as a workaround for a Google Chrome bug
      colorArea.style.display = 'none';
      colorArea.offsetHeight;
      colorArea.style.display = '';
      alphaMarker.nextElementSibling.style.display = 'none';
      alphaMarker.nextElementSibling.offsetHeight;
      alphaMarker.nextElementSibling.style.display = '';
  
      if (format === 'mixed') {
        format = currentColor.a === 1 ? 'hex' : 'rgb';
      } else if (format === 'auto') {
        format = currentFormat;
      }
  
      alphaInput.value = alphaSlider.value;
      hexInput.value = hex.slice(0,7);

      switch (format) {
        case 'hex':
          colorValue.value = hex;
          break;
        case 'rgb':
          colorValue.value = RGBAToStr(currentColor);
          break;
        case 'hsl':
          colorValue.value = HSLAToStr(HSVAtoHSLA(currentColor));
          break;
      }
    
      // Select the current format in the format switcher
      document.querySelector(".clr-format [value=\"" + format + "\"]").checked = true;
    }
  
    /**
     * Set the hue when its slider is moved.
     */
    function setHue() {
      var hue = hueSlider.value * 1;
      var x = colorMarker.style.left.replace('px', '') * 1;
      var y = colorMarker.style.top.replace('px', '') * 1;
  
      picker.style.color = "hsl(" + hue + ", 100%, 50%)";
      hueMarker.style.left = hue / 360 * 100 + "%";
  
      setColorAtPosition(x, y);
    }
  
    /**
     * Set the alpha when its slider is moved.
     */
    function setAlpha() {
      var alpha = alphaSlider.value / 100;
      
      if(alphaSlider.value > 0) {
        $('#clr-color-comment').addClass('hide');
        $('.back-black').addClass('hide');
      } else {
        $('#clr-color-comment').removeClass('hide');
        $('.back-black').removeClass('hide');
      }

      alphaMarker.style.left = alpha * 100 + "%";
      updateColor({ a: alpha });
      // pickColor();
    }
    function setAlphaInput() {
      if(alphaInput.value < 1 || !alphaInput.value) alphaInput.value = 0;
      else if(alphaInput.value > 100) alphaInput.value = 100;

      if(alphaInput.value > 0) {
        $('#clr-color-comment, .back-black').addClass('hide');
      } else {
        $('#clr-color-comment, .back-black').removeClass('hide');
      }

      var alpha = alphaInput.value / 100;

      alphaSlider.value = alphaInput.value;
      alphaMarker.style.left = alpha * 100 + "%";
      updateColor({ a: alpha });
      // pickColor();
    }
  
  
    /**
     * Convert HSVA to RGBA.
     * @param {object} hsva Hue, saturation, value and alpha values.
     * @return {object} Red, green, blue and alpha values.
     */
    function HSVAtoRGBA(hsva) {
      var saturation = hsva.s / 100;
      var value = hsva.v / 100;
      var chroma = saturation * value;
      var hueBy60 = hsva.h / 60;
      var x = chroma * (1 - Math.abs(hueBy60 % 2 - 1));
      var m = value - chroma;
  
      chroma = chroma + m;
      x = x + m;
  
      var index = Math.floor(hueBy60) % 6;
      var red = [chroma, x, m, m, x, chroma][index];
      var green = [x, chroma, chroma, x, m, m][index];
      var blue = [m, m, x, chroma, chroma, x][index];
  
      return {
        r: Math.round(red * 255),
        g: Math.round(green * 255),
        b: Math.round(blue * 255),
        a: hsva.a };
  
    }
  
    /**
     * Convert HSVA to HSLA.
     * @param {object} hsva Hue, saturation, value and alpha values.
     * @return {object} Hue, saturation, lightness and alpha values.
     */
    function HSVAtoHSLA(hsva) {
      var value = hsva.v / 100;
      var lightness = value * (1 - hsva.s / 100 / 2);
      var saturation;
  
      if (lightness > 0 && lightness < 1) {
        saturation = Math.round((value - lightness) / Math.min(lightness, 1 - lightness) * 100);
      }
  
      return {
        h: hsva.h,
        s: saturation || 0,
        l: Math.round(lightness * 100),
        a: hsva.a };
  
    }
  
    /**
     * Convert RGBA to HSVA.
     * @param {object} rgba Red, green, blue and alpha values.
     * @return {object} Hue, saturation, value and alpha values.
     */
    function RGBAtoHSVA(rgba) {
      var red = rgba.r / 255;
      var green = rgba.g / 255;
      var blue = rgba.b / 255;
      var xmax = Math.max(red, green, blue);
      var xmin = Math.min(red, green, blue);
      var chroma = xmax - xmin;
      var value = xmax;
      var hue = 0;
      var saturation = 0;
  
      if (chroma) {
        if (xmax === red) {hue = (green - blue) / chroma;}
        if (xmax === green) {hue = 2 + (blue - red) / chroma;}
        if (xmax === blue) {hue = 4 + (red - green) / chroma;}
        if (xmax) {saturation = chroma / xmax;}
      }
  
      hue = Math.floor(hue * 60);
  
      return {
        h: hue < 0 ? hue + 360 : hue,
        s: Math.round(saturation * 100),
        v: Math.round(value * 100),
        a: rgba.a };
  
    }
  
    /**
     * Parse a string to RGBA.
     * @param {string} str String representing a color.
     * @return {object} Red, green, blue and alpha values.
     */
    function strToRGBA(str) {
      var regex = /^((rgba)|rgb)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i;
      var match, rgba;
  
      // Default to black for invalid color strings
      ctx.fillStyle = '#000';
  
      // Use canvas to convert the string to a valid color string
      ctx.fillStyle = str;
      match = regex.exec(ctx.fillStyle);
  
      if (match) {
        rgba = {
          r: match[3] * 1,
          g: match[4] * 1,
          b: match[5] * 1,
          a: match[6] * 1 };
  
  
        // Workaround to mitigate a Chromium bug where the alpha value is rounded incorrectly
        rgba.a = +rgba.a.toFixed(2);
  
      } else {
        match = ctx.fillStyle.replace('#', '').match(/.{2}/g).map(function (h) {return parseInt(h, 16);});
        rgba = {
          r: match[0],
          g: match[1],
          b: match[2],
          a: 1 };
  
      }
  
      return rgba;
    }
  
    /**
     * Convert RGBA to Hex.
     * @param {object} rgba Red, green, blue and alpha values.
     * @return {string} Hex color string.
     */
    function RGBAToHex(rgba) {
      var R = rgba.r.toString(16);
      var G = rgba.g.toString(16);
      var B = rgba.b.toString(16);
      var A = '';
  
      if (rgba.r < 16) {
        R = '0' + R;
      }
  
      if (rgba.g < 16) {
        G = '0' + G;
      }
  
      if (rgba.b < 16) {
        B = '0' + B;
      }
  
      if (settings.alpha && (rgba.a < 1 || settings.forceAlpha)) {
        var alpha = rgba.a * 255 | 0;
        A = alpha.toString(16);
  
        if (alpha < 16) {
          A = '0' + A;
        }
      }
  
      return '#' + R + G + B + A;
    }
  
    /**
     * Convert RGBA values to a CSS rgb/rgba string.
     * @param {object} rgba Red, green, blue and alpha values.
     * @return {string} CSS color string.
     */
    function RGBAToStr(rgba) {
      if (!settings.alpha || rgba.a === 1 && !settings.forceAlpha) {
        return "rgb(" + rgba.r + ", " + rgba.g + ", " + rgba.b + ")";
      } else {
        return "rgba(" + rgba.r + ", " + rgba.g + ", " + rgba.b + ", " + rgba.a + ")";
      }
    }
  
    /**
     * Convert HSLA values to a CSS hsl/hsla string.
     * @param {object} hsla Hue, saturation, lightness and alpha values.
     * @return {string} CSS color string.
     */
    function HSLAToStr(hsla) {
      if (!settings.alpha || hsla.a === 1 && !settings.forceAlpha) {
        return "hsl(" + hsla.h + ", " + hsla.s + "%, " + hsla.l + "%)";
      } else {
        return "hsla(" + hsla.h + ", " + hsla.s + "%, " + hsla.l + "%, " + hsla.a + ")";
      }
    }
  
    /**
     * Init the color picker.
     */
    function init() {
      // Render the UI
      container = undefined;
      picker_backdrop = document.createElement('div');
      picker_backdrop.setAttribute('id', 'clr-picker-backdrop');
      picker_backdrop.className = 'clr-picker-backdrop';
      
      picker = document.createElement('div');
      picker.setAttribute('id', 'clr-picker');
      picker.className = 'clr-picker';
      picker.innerHTML = `
        <div class="clr-body">
          <div class="clr-section top">
            <div id="clr-color-area" class="clr-gradient" role="application" aria-label="${settings.a11y.instruction}">
              <div id="clr-color-marker" class="clr-marker" tabindex="0"></div>
              <div id="clr-color-cursor" class="clr-cursor" tabindex="-1"></div>
              <div class="back-black"></div>
              <div id="clr-color-comment" class="clr-comment" tabindex="-2">${_coloris_label.alpha_info}</div>
            </div>
            <div class="clr-hue">
              <input id="clr-hue-slider" inputmode="none" onfocus="this.blur()" name="clr-hue-slider" type="range" min="0" max="360" step="1" aria-label="${settings.a11y.hueSlider}">
              <div id="clr-hue-marker" class="clr-hue-marker"></div>
            </div>
            <div class="clr-color-info hex">
              <div class="info-label">
                ${settings.a11y.hexLabel}
              </div>
              <div class="info-val">
                <input id="clr-hex-value" name="clr-hex-value" class="clr-hex-value" type="text" value="" aria-label="${settings.a11y.hexInput}">
              </div>
            </div>
            <div class="clr-alpha">
              <input id="clr-alpha-slider" inputmode="none" onfocus="this.blur()"  name="clr-alpha-slider" type="range" min="0" max="100" step="1" aria-label="${settings.a11y.alphaSlider}">
              <div id="clr-alpha-marker" class="clr-alpha-marker"></div>
              <span></span>
            </div>
            <div class="clr-color-info alpha">
              <div class="info-label">
                ${settings.a11y.alphaLabel}
              </div>
              <div class="info-val">
                <input id="clr-alpha-value" name="clr-alpha-value" class="clr-alpha-value" type="number" value="" aria-label="${settings.a11y.alphaInput}">
              </div>
            </div>
          </div>
          <div class="clr-section center">
            <div id="clr-format" class="clr-format">
              <fieldset class="clr-segmented">
                <legend>${settings.a11y.format}</legend>
                <input id="clr-f1" type="radio" name="clr-format" value="hex">
                <label for="clr-f1">Hex</label>
                <input id="clr-f2" type="radio" name="clr-format" value="rgb">
                <label for="clr-f2">RGB</label>
                <input id="clr-f3" type="radio" name="clr-format" value="hsl">
                <label for="clr-f3">HSL</label>
                <span></span>
              </fieldset>
            </div>
            <div class="clr-color-info color hide">
              <div class="info-label">
                ${settings.a11y.inputLabel}
                <span class="bc-tooltip colorisguide">${tooltipSVG('top','',`${_coloris_label.guide}`,'')}</span>
              </div>
              <div class="info-val">
                <input id="clr-color-value" name="clr-color-value" class="clr-color" type="text" value="" spellcheck="false" aria-label="${settings.a11y.input}">
              </div>
            </div>
            <div id="clr-swatches" class="clr-swatches"></div>
          </div>
          <div class="clr-section bottom">
            <div class="clr-palette-box ready" id="clr-palette-box">
              <div id="clr-color-preview" class="clr-preview"></div>
              <div id="clr-color-current" class="clr-current"></div>
            </div>
            <div class="clr-btn-box" id="clr-btn-box">
              <button type="button" id="clr-clear" class="clr-clear" aria-label="${settings.a11y.clear}">${settings.clearLabel}</button>
              <button type="button" id="clr-cancel" class="clr-cancel" aria-label="${settings.a11y.cancel}">${settings.cancelLabel}</button>
              <button type="button" id="clr-close" class="clr-close" aria-label="${settings.a11y.close}">${settings.closeLabel}</button>
            </div>
          </div>
          <span id="clr-open-label" hidden>${settings.a11y.open}</span>
          <span id="clr-swatch-label" hidden>${settings.a11y.swatch}</span>
        </div>
      `;

      /*
      picker.innerHTML =
      "<input id=\"clr-color-value\" name=\"clr-color-value\" class=\"clr-color\" type=\"text\" value=\"\" spellcheck=\"false\" aria-label=\"" + settings.a11y.input + "\">" + ("<div id=\"clr-color-area\" class=\"clr-gradient\" role=\"application\" aria-label=\"" +
      settings.a11y.instruction + "\">") +
      '<div id="clr-color-marker" class="clr-marker" tabindex="0"></div>' +
      '</div>' +
      '<div class="clr-hue">' + ("<input id=\"clr-hue-slider\" name=\"clr-hue-slider\" type=\"range\" min=\"0\" max=\"360\" step=\"1\" aria-label=\"" +
      settings.a11y.hueSlider + "\">") +
      '<div id="clr-hue-marker"></div>' +
      '</div>' +
      '<div class="clr-alpha">' + ("<input id=\"clr-alpha-slider\" name=\"clr-alpha-slider\" type=\"range\" min=\"0\" max=\"100\" step=\"1\" aria-label=\"" +
      settings.a11y.alphaSlider + "\">") +
      '<div id="clr-alpha-marker"></div>' +
      '<span></span>' +
      '</div>' +
      '<div id="clr-format" class="clr-format">' +
      '<fieldset class="clr-segmented">' + ("<legend>" +
      settings.a11y.format + "</legend>") +
      '<input id="clr-f1" type="radio" name="clr-format" value="hex">' +
      '<label for="clr-f1">Hex</label>' +
      '<input id="clr-f2" type="radio" name="clr-format" value="rgb">' +
      '<label for="clr-f2">RGB</label>' +
      '<input id="clr-f3" type="radio" name="clr-format" value="hsl">' +
      '<label for="clr-f3">HSL</label>' +
      '<span></span>' +
      '</fieldset>' +
      '</div>' +
      '<div id="clr-swatches" class="clr-swatches"></div>' + ("<button type=\"button\" id=\"clr-clear\" class=\"clr-clear\" aria-label=\"" +
      settings.a11y.clear + "\">" + settings.clearLabel + "</button>") +
      '<div id="clr-color-preview" class="clr-preview">' + ("<button type=\"button\" id=\"clr-close\" class=\"clr-close\" aria-label=\"" +
      settings.a11y.close + "\">" + settings.closeLabel + "</button>") +
      '</div>' + ("<span id=\"clr-open-label\" hidden>" +
      settings.a11y.open + "</span>") + ("<span id=\"clr-swatch-label\" hidden>" +
      settings.a11y.swatch + "</span>");
      */


      // Append the color picker to the DOM
      document.body.appendChild(picker);
      document.body.appendChild(picker_backdrop);
  
      // Reference the UI elements
      colorArea = getEl('clr-color-area');
      colorMarker = getEl('clr-color-marker');
      colorCursor = getEl('clr-color-cursor');
      btnBox = getEl('clr-btn-box');
      clearButton = getEl('clr-clear');
      cancelButton = getEl('clr-cancel');
      closeButton = getEl('clr-close');
      paletteBox = getEl('clr-palette-box');
      colorPreview = getEl('clr-color-preview');
      colorCurrent = getEl('clr-color-current');
      colorValue = getEl('clr-color-value');
      hueSlider = getEl('clr-hue-slider');
      hueMarker = getEl('clr-hue-marker');
      hexInput = getEl('clr-hex-value');
      alphaInput = getEl('clr-alpha-value');
      alphaSlider = getEl('clr-alpha-slider');
      alphaMarker = getEl('clr-alpha-marker');
  
      // Bind the picker to the default selector
      bindFields(settings.el);
      wrapFields(settings.el);

      addListener(picker_backdrop, 'mousedown', function (event) {
        closePicker(true);
      });
  
      addListener(picker, 'mousedown', function (event) {
        picker.classList.remove('clr-keyboard-nav');
        event.stopPropagation();
      });

      addListener(colorArea, 'mousedown', function (event) {
        addListener(document, 'mousemove', moveMarker);
      });
  
      addListener(colorArea, 'touchstart', function (event) {
        document.addEventListener('touchmove', moveMarker, { passive: false });
      });

      addListener(colorArea, 'mousemove', function (event) {
        var tmpColorCursor = document.querySelector('.clr-cursor');
        tmpColorCursor.style.top = (event.pageY - Math.round($('#clr-color-area').offset().top) + 1) + 'px';
        tmpColorCursor.style.left = (event.pageX - Math.round($('#clr-color-area').offset().left) - 1) + 'px';
      });
  
      addListener(colorMarker, 'mousedown', function (event) {
        addListener(document, 'mousemove', moveMarker);
      });
  
      addListener(colorMarker, 'touchstart', function (event) {
        document.addEventListener('touchmove', moveMarker, { passive: false });
      });
  
      addListener(colorValue, 'change', function (event) {
        var value = colorValue.value;

        if (currentEl || settings.inline) {
          var color = value === '' ? value : setColorFromStr(value);
          pickColor(color);
        }
        
        $('#clr-color-comment').addClass('hide');
        $('.back-black').addClass('hide');
        if(alphaInput.value == 0) {
          $('#clr-color-comment').removeClass('hide');
          $('.back-black').removeClass('hide');
        }
      });
      addListener(colorValue, 'keyup', function(e) { if(e.which == 13) { $(this).closest('.clr-picker').find('.clr-close').click(); } });
  
      addListener(clearButton, 'click', function (event) {
        pickColor('');
        closePicker();
      });
  
      addListener(closeButton, 'click', function (event) {
        pickColor();
        closePicker();
      });

      addListener(cancelButton, 'click', function (event) {
        closePicker(true);
      });
  
      addListener(getEl('clr-format'), 'click', '.clr-format input', function (event) {
        currentFormat = event.target.value;
        updateColor();
        pickColor();
      });
  
      addListener(picker, 'click', '.clr-swatches button', function (event) {
        setColorFromStr(event.target.textContent);
        // pickColor();
  
        if (settings.swatchesOnly) {
          closePicker();
        }
      });
  
      addListener(document, 'mouseup', function (event) {
        document.removeEventListener('mousemove', moveMarker);
      });
  
      addListener(document, 'touchend', function (event) {
        document.removeEventListener('touchmove', moveMarker);
      });
  
      addListener(document, 'mousedown', function (event) {
        keyboardNav = false;
        picker.classList.remove('clr-keyboard-nav');
        closePicker();
      });
  
      addListener(document, 'keydown', function (event) {
        var key = event.key;
        var target = event.target;
        var shiftKey = event.shiftKey;
        var navKeys = ['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
  
        if (key === 'Escape') {
          closePicker(true);
  
          // Display focus rings when using the keyboard
        } else if (navKeys.includes(key)) {
          keyboardNav = true;
          picker.classList.add('clr-keyboard-nav');
        }

        // Trap the focus within the color picker while it's open
        if (key === 'Tab' && target.matches('.clr-picker *')) {
          var focusables = getFocusableElements();
          var firstFocusable = focusables.shift();
          var lastFocusable = focusables.pop();
  
          if (shiftKey && target === firstFocusable) {
            lastFocusable.focus();
            event.preventDefault();
          } else if (!shiftKey && target === lastFocusable) {
            firstFocusable.focus();
            event.preventDefault();
          }
        }
      });
  
      addListener(document, 'click', '.clr-field button', function (event) {
        // Reset any previously set per-instance options
        if (hasInstance) {
          resetVirtualInstance();
        }
  
        // Open the color picker
        event.target.nextElementSibling.dispatchEvent(new Event('click', { bubbles: true }));
      });
  
      addListener(colorMarker, 'keydown', function (event) {
        var movements = {
          ArrowUp: [0, -1],
          ArrowDown: [0, 1],
          ArrowLeft: [-1, 0],
          ArrowRight: [1, 0] };
  
  
        if (Object.keys(movements).includes(event.key)) {
          moveMarkerOnKeydown.apply(void 0, movements[event.key]);
          event.preventDefault();
        }
      });
  
      addListener(colorArea, 'click', moveMarker);
      addListener(hueSlider, 'input', setHue);
      
      addListener(alphaInput, 'input', setAlphaInput);
      addListener(alphaInput, 'keyup', function(e) { if(e.which == 13) { $(this).closest('.clr-picker').find('.clr-close').click(); } });
      addListener(alphaSlider, 'input', setAlpha);

      addListener(hexInput, 'change', function (event) {
        var hex6 = hexInput.value,
            alpha = (settings.alpha) ? alphaInput.value : 100,
            new_color = getChangeColorVal([hex6,'a',alpha / 100]);

        if (currentEl || settings.inline) {
          var color = new_color === '' ? hex6 : setColorFromStr(new_color);
          pickColor(color);
        }
      });
      addListener(hexInput, 'keyup', function(e) { if(e.which == 13) { $(this).closest('.clr-picker').find('.clr-close').click(); } });

    }
  
    /**
     * Return a list of focusable elements within the color picker.
     * @return {array} The list of focusable DOM elemnts.
     */
    function getFocusableElements() {
      var controls = Array.from(picker.querySelectorAll('input, button'));
      var focusables = controls.filter(function (node) {return !!node.offsetWidth;});
  
      return focusables;
    }
  
    /**
     * Shortcut for getElementById to optimize the minified JS.
     * @param {string} id The element id.
     * @return {object} The DOM element with the provided id.
     */
    function getEl(id) {
      return document.getElementById(id);
    }
  
    /**
     * Shortcut for addEventListener to optimize the minified JS.
     * @param {object} context The context to which the listener is attached.
     * @param {string} type Event type.
     * @param {(string|function)} selector Event target if delegation is used, event handler if not.
     * @param {function} [fn] Event handler if delegation is used.
     */
    function addListener(context, type, selector, fn) {
      var matches = Element.prototype.matches || Element.prototype.msMatchesSelector;
  
      // Delegate event to the target of the selector
      if (typeof selector === 'string') {
        context.addEventListener(type, function (event) {
          if (matches.call(event.target, selector)) {
            fn.call(event.target, event);
          }
        });
  
        // If the selector is not a string then it's a function
        // in which case we need a regular event listener
      } else {
        fn = selector;
        context.addEventListener(type, fn);
      }
    }
  
    /**
     * Call a function only when the DOM is ready.
     * @param {function} fn The function to call.
     * @param {array} [args] Arguments to pass to the function.
     */
    function DOMReady(fn, args) {
      args = args !== undefined ? args : [];

      if($.inArray(fn.name, checkReturnFuncArr) > -1) return fn(args);
  
      if (document.readyState !== 'loading') {
        fn.apply(void 0, args);
      } else {
        document.addEventListener('DOMContentLoaded', function () {
          fn.apply(void 0, args);
        });
      }
    }


    function getColorSelectorPnInfo(args_arr) { 
      var css = args_arr[0],
          elname = (typeof args_arr[1] != 'undefined') ? args_arr[1] : '',
          selector = (typeof args_arr[2] != 'undefined') ? args_arr[2] : '',
          pn = (typeof args_arr[3] != 'undefined') ? args_arr[3] : '',
          withcss = (typeof args_arr[4] != 'undefined') ? args_arr[4] : '',
          result = {'selector':selector, 'pn':pn, 'color':''}

      var this_selector = '',
          this_pn = '',
          this_color = '',
          this_css = {};
      
      var elnameRegex = new RegExp('^\.' + elname),
          checkSelectorWidthElname = (selector.match(elnameRegex) != null) ? true : false;

      $.each(selector.split(','), function(i,s) {
          if(i > 0) this_selector += ',';
          this_selector += (checkSelectorWidthElname) ? s.trim() : '.' + elname + ' ' + s.trim();

          var tmp_pn = pn.split(','),
              tmp_s = s.trim(),
              tmp_changepn = s.match(/^(.*?)(?=\([^)]*\)$)/);
          if(tmp_changepn != null) {
            tmp_pn = s.substring(tmp_changepn[0].length + 1, s.length - 1).split('/');
            tmp_s = tmp_changepn[0].trim();
          }

          var tmp_selector = (checkSelectorWidthElname) ? tmp_s : '.' + elname + ' ' + tmp_s,
              tmp_style = style.get(css,tmp_selector);
          if(typeof this_css[tmp_selector] == 'undefined') this_css[tmp_selector] = {};

          if(withcss) {
            $.each(withcss.split(','), function(i,v) {
              if(!v) return;

              if($.inArray(v, ['fill','color','background','background-color','border-color','border','border-top','border-bottom','border-left','border-right']) > -1) {
                if(tmp_pn.indexOf(v) < 0) tmp_pn.push(v);
                return;
              }
  
              var tmp_v = '';
              switch(v) {
                case 'font-family': tmp_v = tmp_style.txName; break;
                case 'font-size':   tmp_v = tmp_style.txSize; break;
                default:            tmp_v = style.getCssProperty(css,tmp_selector,v); break;
              }
  
              this_css[tmp_selector][v] = {'val': tmp_v};
            });
          }

          $.each(tmp_pn, function(i,v) {
            var tmp_color = '';
            switch(v) {
              case 'fill': tmp_color = tmp_style.fill; break;
              case 'color': tmp_color = tmp_style.txColor; break;
              case 'background':
              case 'background-color': tmp_color = tmp_style.bgColor; break;
              case 'border-color': 
              case 'border': 
              case 'border-top':
              case 'border-bottom':
              case 'border-left':
              case 'border-right': tmp_color = tmp_style.borderColor; break;
              default: break;
            }

            if(v) {
              this_css[tmp_selector][v] = {
                'val': style.getCssProperty(css,tmp_selector,v),
                'color': Coloris.getColorInfo(tmp_color,'org'),
              };

              if(typeof this_css[tmp_selector][v]['val'] != 'string') this_css[tmp_selector][v]['val'] = this_css[tmp_selector][v]['val'].pop();

              if(pn.split(',').length > 1 && pn.split(',').indexOf(v) > -1) {
                this_css[tmp_selector][v]['checkPass'] = (this_css[tmp_selector][v]['color'] == '' && $.inArray(this_css[tmp_selector][v]['val'], ['initial','inherit']) > -1) ? true : false;
              }
            }


            if(i == 0) {
              this_pn = v;
              this_color = tmp_color;
            }
          });
      });

      return {
        'selector': this_selector,
        'pn': this_pn,
        'color': this_color,
        'css': this_css,
      }
    }

    function getColorInfo(args_arr) {
      var tmp_str = args_arr[0],
          return_type = (typeof args_arr[1] != 'undefined' && args_arr[1]) ? args_arr[1] : 'hex8';

      var str = (typeof tmp_str == 'string') ? tmp_str : tmp_str.pop(),
          colorRegex = getColorRegex(),
          tmp_matches = str.match(colorRegex);
      if(tmp_matches != null) str = tmp_matches.pop();
      if(return_type == 'org') return str;

      var this_rgba = strToRGBA(str),
          this_hex = RGBAToHex(this_rgba);

      if(return_type == 'hex' || return_type == 'rgb') {
        this_rgba['a'] = 1;
        return (return_type == 'rgb') ? RGBAToStr(this_rgba) : RGBAToHex(this_rgba);
      }
      else if(return_type == 'rgba') return RGBAToStr(this_rgba);
      else if(return_type == 'alpha') return this_rgba['a'];
      else return this_hex;
    }

    function getColorRegex() {
      return new RegExp(/(#([a-fA-F0-9]{3,8})\b|rgba?\(\s*(\d{1,3}\s*,\s*){2}\d{1,3}\s*(,\s*\d*(?:\.\d+)?)?\s*\)|hsla?\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*(,\s*\d*(?:\.\d+)?)?\s*\)|\btransparent\b|\binherit\b|\binitial\b|\bunset\b|\brevert\b)/g);
    }

    function getChangeColorVal(args_arr) {
      var str = args_arr[0],
          change_key = (typeof args_arr[1] != 'undefined' && args_arr[1]) ? args_arr[1] : '',
          change_val = (typeof args_arr[2] != 'undefined' && args_arr[2]) ? args_arr[2] : '';

      var this_rgba = strToRGBA(str),
          this_hex = RGBAToHex(this_rgba);
      if(change_key == '' && change_val == '') return this_hex.substring(0, 7);
      if(change_key == 'rgb_str') return this_rgba.r+','+this_rgba.g+','+this_rgba.b;

      if(change_key && typeof this_rgba[change_key] != 'undefined') {
          this_rgba[change_key] = change_val * 1;
      }

      var org_alpha = settings.alpha;
      if(change_key == 'a') settings.alpha = true;
      var hex = RGBAToHex(this_rgba);
      if(change_key == 'a') settings.alpha = org_alpha;

      if(this_rgba.a < 1) return 'rgba('+this_rgba.r+','+this_rgba.g+','+this_rgba.b+','+this_rgba.a+')';
      else return hex;
          // opaqueHex = hex.substring(0, 7);
    }

  
    // Polyfill for Nodelist.forEach
    if (NodeList !== undefined && NodeList.prototype && !NodeList.prototype.forEach) {
      NodeList.prototype.forEach = Array.prototype.forEach;
    }
  
    // Expose the color picker to the global scope
    window.Coloris = function () {
      var methods = {
        set: configure,
        wrap: wrapFields,
        close: closePicker,
        setInstance: setVirtualInstance,
        removeInstance: removeVirtualInstance,
        updatePosition: updatePickerPosition,
        ready: DOMReady
      };

      $.each(checkUsedFuncArr, function(i,fname) {
        methods[fname] = eval(fname);
      });

      $.each(checkReturnFuncArr, function(i,fname) {
        methods[fname] = eval(fname);
      });
  
      function Coloris(options) {
        DOMReady(function () {
          if (options) {
            if (typeof options === 'string') {
              bindFields(options);
            } else {
              configure(options);
            }
          }
        });
      }
      
      var _loop2 = function _loop2(key) {
        Coloris[key] = function () {
          for (var _len = arguments.length, args = new Array(_len), _key2 = 0; _key2 < _len; _key2++) {
            args[_key2] = arguments[_key2];
          }

          if($.inArray(key, checkReturnFuncArr) > -1) return DOMReady(methods[key], args);
          else DOMReady(methods[key], args);
        };
      };
        
        
      for (var key in methods) {
          _loop2(key);
      }
  
      return Coloris;
    }();
  
    // Init the color picker when the DOM is ready
    DOMReady(init);
  
  })(window, document, Math);