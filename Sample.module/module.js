// function.prototype.bind polyfill
if (!Function.prototype.bind) (function(){
  var ArrayPrototypeSlice = Array.prototype.slice;
  Function.prototype.bind = function() {
    var thatFunc = this, thatArg = arguments[0];
    var args = ArrayPrototypeSlice.call(arguments, 1);
    if (typeof thatFunc !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - ' +
             'what is trying to be bound is not callable');
    }
    return function(){
      args.push.apply(args, arguments);
      return thatFunc.apply(thatArg, args);
    };
  };
})();

window.jq3x = $.noConflict(true);
var belchsj_ = (function(){
	return {
    isAnimating      :false,
    mobileMaxHeight  :490,
    mobileMaxWidth   :992,
    keyCodes: {
      UP    :38,
      DOWN  :40
    },
    on: function(action, callback) {
      window.addEventListener(action, callback, { passive: false });
    },
    init: function(){
      this.$window          = window.jq3x(window);
      this.$document        = window.jq3x(document);
      this.$slidesContainer = window.jq3x(".belch-jacker-section>div.left");
    	this.$slides          = window.jq3x(".slide");
    	this.$currentSlide    = this.$slides.first();
    	this.pageHeight       = (this.$window.innerHeight());
      this.setEvents();
      
      this.go(this.$currentSlide);
    },
    setEvents: function(){
      this.on("mousewheel",     this.scrollHappening.bind(this));
      this.on("DOMMouseScroll", this.scrollHappening.bind(this));
      this.on("resize",         this.resizeHappening.bind(this));
      this.on("keydown",        this.keydownHappening.bind(this));
    },
    scrollHappening: function(event){
        if(this.$window.height() > this.mobileMaxHeight && this.$window.width() > this.mobileMaxWidth){
          var delta = event.wheelDelta / 30 || -event.detail;
          if(delta < -1) this.gonext();
          if(delta > 1)  this.goprev();
          event.preventDefault();
        }
    },
    resizeHappening: function(event){
  		var newPageHeight = this.$window.innerHeight();
  		if(this.pageHeight !== newPageHeight){
  			this.pageHeight = newPageHeight;
  			TweenLite.set([this.$slidesContainer, this.$slides], {height: (this.pageHeight) + "px"});
  			TweenLite.set(this.$slidesContainer, {scrollTo: {y: this.pageHeight * this.$currentSlide.index() }});
  		}
    },
    keydownHappening: function(event){
  		var pk = event.keyCode;
  		if(pk == this.keyCodes.UP){
  			this.goprev();
  			event.preventDefault();
  		}else if(pk == this.keyCodes.DOWN){
  			this.gonext();
  			event.preventDefault();
  		}
    },
    go: function($el){
  		if(this.shouldgo($el)){
  			this.isAnimating = true;
  			this.$currentSlide = $el;
  			TweenLite.to(this.$slidesContainer, 1, {
          scrollTo: {
            y: this.pageHeight * this.$currentSlide.index()
          },
          onComplete: function(){
            this.isAnimating = !1
          }, onCompleteScope: this
        });
  		}
    },
    gonext: function(){
      (this.$currentSlide.next().length ? this.go(this.$currentSlide.next()) : false);
    },
    goprev: function(){
      (this.$currentSlide.prev().length ? this.go(this.$currentSlide.prev()) : false);
    },
    shouldgo: function($el){
      if(
        (this.$window.height() < this.mobileMaxHeight || this.$window.width() < this.mobileMaxWidth) ||
        (this.isAnimating || !$el.length)) { return false };
      return true;
    }
	};
})();
jq3x(function($){
  belchsj_.init();
});
