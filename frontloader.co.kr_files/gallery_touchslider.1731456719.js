/*

	type	:	gallery
	type2	:	premium
	mode	:	 
	feature	:	
	overlap	:	0
	folder	:	800
	name	:	pGallery01

	<input class="gjs" type="hidden" data-js="touchslider" data-js-code="1" data-js-selector=".ts-row">
*/
const Touchslider1_MathUtils = {
	lineEq: (y2, y1, x2, x1, currentVal) => {
		// y = mx + b 
		var m = (y2 - y1) / (x2 - x1), b = y1 - m * x1;
		return m * currentVal + b;
	},
	lerp: (a, b, n) => (1 - n) * a + n * b,
	getRandomFloat: (min, max) => (Math.random() * (max - min) + min).toFixed(2)
};

let Touchslider1 = class {
	constructor(gTarget) { this.gjs_load(gTarget); }
	gjs_check(gTarget) {
        if($(gTarget).closest('.reorderBlock').length > 0)  elDefaultClass = 'reorderBlock';
        else elDefaultClass = (isELVIEW) ? 'el_viewblock' : 'element';

		if( !$(gTarget).closest('.'+elDefaultClass).find('input.gjs').length ||
			$(gTarget).closest('.'+elDefaultClass).find('.gjs[data-js="touchslider"][data-js-code="1"][data-js-selector]').length == 0 
		) return false;
		else return true;
	}
	gjs_load(gTarget) {
		if(this.gjs_check(gTarget) === false) return false;

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

		if (document.querySelector('.dsgn-body').classList.contains('sidebar')) w -= 260;

		this.DOM = { el: gTarget };
		this.DOM.elname = $(gTarget).closest('.'+elDefaultClass).attr('data-name');

		var gseq = $(gTarget).closest('.'+elDefaultClass).attr('data-id'),
			drag_position = 0;

		if(typeof gseq != 'undefined') {
			var tmpEL = $(gTarget).closest('.'+elDefaultClass).clone();

			var gactiveslider = (typeof $.cookie('gallery-touchslider1-' + gseq) != 'undefined') ? $.cookie('gallery-touchslider1-' + gseq) : null;
			if(gactiveslider !== null) {
				drag_position = Number(gactiveslider);
				setLoadmoreGalleryJS('touchslider1',gseq,false);
            } else {
				$(tmpEL).find('.draggable').removeAttr('style');
            }

			$(gTarget).closest('.'+elDefaultClass).after(tmpEL).show();
			$(gTarget).closest('.'+elDefaultClass).remove();
			var g_name = $('.'+this.DOM.elname).attr('data-name'),
				selector = $('.'+this.DOM.elname).find('.gjs').attr('data-js-selector');

			this.DOM.el = document.querySelector('.'+g_name+' '+selector);
		}

		const calcWinsize = () => this.winsize = {width: w, height: h};
		calcWinsize();
		window.addEventListener('resize', calcWinsize);

		this.mousepos = {x: this.winsize.width/2, y: this.winsize.height/2};
		window.addEventListener('mousemove', ev => this.mousepos = this.getMousePos(ev));

		this.DOM.slider = this.DOM.el.querySelector('.slider');
		this.items = [];
		[...this.DOM.slider.querySelectorAll('.grid')].forEach(item => this.items.push(new Touchslider1_Item(item)));


		// The draggable container
		this.DOM.draggable = this.DOM.el.querySelector('.draggable');
		// The width of the draggable container (also the slider container)
		this.draggableWidth = this.DOM.draggable.offsetWidth;
		// The total amount that we can drag the draggable container, so that both the first and last image stay next to the viewport boundary (left and right respectively)
		this.maxDrag = this.draggableWidth < this.winsize.width ? 0 : this.draggableWidth - this.winsize.width;

		if(drag_position > this.maxDrag) drag_position = this.maxDrag;
		if(drag_position < -1 * this.maxDrag) drag_position = -1 * this.maxDrag;

		// The current amount (in pixels) that was dragged
		this.dragPosition = drag_position;

		// Initialize the Draggabilly
		this.draggie = new Draggabilly(this.DOM.draggable, { axis: 'x' });

		this.init();
		this.initEvents();
	}
    gjs_destroy() {
        if(typeof this.DOM == 'undefined') return false;

		$(this.DOM.el).find('.draggable, .slider[data-loop="true"]').removeAttr('style');
        if(typeof this.draggie != 'undefined') this.draggie.destroy();
    }
	getMousePos(e) {
		let posx = 0;
		let posy = 0;
		if (!e) e = window.event;
		if (e.pageX || e.pageY) {
			posx = e.pageX;
			posy = e.pageY;
		}
		else if (e.clientX || e.clientY) 	{
			posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		return { x : posx, y : posy }
	}
	init() {
		this.renderedStyles = {
			position: {previous: this.dragPosition, current: this.dragPosition},
			scale: {previous: 1, current: 1},
			imgScale: {previous: 1, current: 1},
			opacity: {previous: 1, current: 1},
		};

		this.render = () => {
			this.renderId = undefined;

			for (const key in this.renderedStyles ) {
				this.renderedStyles[key].previous = Touchslider1_MathUtils.lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, 0.1);
			}

			TweenMax.set(this.DOM.slider, {x: this.renderedStyles.position.previous});
			for (const item of this.items) {
				TweenMax.set(item.DOM.el, {scale: this.renderedStyles.scale.previous, opacity: this.renderedStyles.opacity.previous});
				TweenMax.set(item.DOM.image, {scale: this.renderedStyles.imgScale.previous});
			}

			if ( !this.renderId ) {
				this.renderId = requestAnimationFrame(() => this.render());  
			}
		};
		this.renderId = requestAnimationFrame(() => this.render());
	}
	initEvents() {
		this.onDragStart = (e) => {
			// console.log('onDragStart');
			// if($(this.DOM.slider).is('.empty')) console.log('.empty');

			this.renderedStyles.scale.current = 0.8;
			this.renderedStyles.imgScale.current = 1.6;
			this.renderedStyles.opacity.current = 0.3;
		};

		this.onDragMove = (event, pointer, moveVector) => {
			// console.log('onDragMove');
			// if($(this.DOM.slider).is('.empty')) console.log('.empty');

			// The possible range for the drag is draggie.position.x = [-maxDrag,0 ]
			if ( this.draggie.position.x >= 0 ) {
				// the max we will be able to drag is winsize.width/2
				this.dragPosition = Touchslider1_MathUtils.lineEq(0.5*this.winsize.width,0, this.winsize.width, 0, this.draggie.position.x);
			}
			else if ( this.draggie.position.x < -1*this.maxDrag ) {
				// the max we will be able to drag is winsize.width/2
				this.dragPosition = Touchslider1_MathUtils.lineEq(0.5*this.winsize.width,0, this.maxDrag+this.winsize.width, this.maxDrag, this.draggie.position.x);
			}
			else {
				this.dragPosition = this.draggie.position.x;
			}
			this.renderedStyles.position.current = this.dragPosition;

			this.mousepos = this.getMousePos(event);
		};

		this.onDragEnd = (e) => {
			// console.log('onDragEnd');
			// if($(this.DOM.slider).is('.empty')) console.log('.empty');

			// reset draggable if out of bounds.
			if ( this.draggie.position.x > 0 ) {
				this.dragPosition = 0;
				this.draggie.setPosition(this.dragPosition, this.draggie.position.y);
			}
			else if ( this.draggie.position.x < -1*this.maxDrag ) {
				this.dragPosition = -1*this.maxDrag;
				this.draggie.setPosition(this.dragPosition, this.draggie.position.y);
			}
			this.renderedStyles.position.current = this.dragPosition;
			this.renderedStyles.scale.current = 1;
			this.renderedStyles.imgScale.current = 1;
			this.renderedStyles.opacity.current = 1;
		};

		this.draggie.on('pointerDown', this.onDragStart);
		this.draggie.on('dragMove', this.onDragMove);
		this.draggie.on('pointerUp', this.onDragEnd);

		window.addEventListener('resize', (e) => {
			// console.log('resize');
			// if($(this.DOM.slider).is('.empty')) console.log('.empty');

			this.maxDrag = this.draggableWidth < this.winsize.width ? 0 : this.draggableWidth - this.winsize.width;
			if ( Math.abs(this.dragPosition) + this.winsize.width > this.draggableWidth ) {
				const diff = Math.abs(this.dragPosition) + this.winsize.width - this.draggableWidth;
				// reset dragPosition
				this.dragPosition = this.dragPosition+diff;
				this.draggie.setPosition(this.dragPosition, this.draggie.position.y);
			}
		});
	}
};

let Touchslider1_Item = class {
	constructor(gItem) {
		if( !$(gItem).closest('.'+elDefaultClass).find('input.gjs').length ||
			$(gItem).closest('.'+elDefaultClass).find('.gjs[data-js="touchslider"][data-js-code="1"][data-js-selector]').length == 0
		) return false;

		this.DOM = { el: gItem };
		this.DOM.image = this.DOM.el.querySelector('.g-img');
		this.DOM.title = this.DOM.el.querySelector('h5.figure');
		this.DOM.caption = this.DOM.el.querySelector('p.figure.caption');
		this.DOM.comment = this.DOM.el.querySelector('.figure.comment');
		// this.DOM.brand = this.DOM.el.querySelector('.figure.brand');
		this.DOM.price = this.DOM.el.querySelector('.figure.price');
		this.DOM.review = this.DOM.el.querySelector('.figure.review');
	}
};
