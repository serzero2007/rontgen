var App = {}

$(function() {
// 1-sec delay to simulate js load, in dev
// setTimeout(function(){
	$('.bar').css({'width':'50%'})
	App
		.initialize()
// }, 1000)
});

App.initialize = function(){
	var self = this;

    this
    	.initializeSelectors()
		.initializeRontgen()
		.initializeBecquerel()
		.initializeDOM()
		.initializeEditorEvents()
		.initializeClickEvents()
		.initializeLocalStorage()
		.killOverlay()
}

App.initializeSelectors = function(){
	var self = this;

	this.$form              = $('#post-form')
	this.$textarea        	= $('textarea[name="body"]');
	this.$inputTitle        = $('input[name="title"]');
	this.$inputId        	= $('input[name="id"]');
	this.$submit	       	= $('input[name="submit"]');
	this.$renderTitle 		= $('.render-title')
	this.$saveFlash  		= $('#save-flash')
	this.$fullscreen		= $('.fullscreen')
	this.$notFullscreen		= $('.not-fullscreen')
	this.$buttons 			= $('.becquerel-buttons')
	this.$buttonsOpen 		= $('.becquerel-buttons-open')
	this.$buttonsClose 		= $('.becquerel-buttons-close')

	return this;
}

App.initializeRontgen = function(){
	var self = this;

	this.rontgen = new Rontgen({
        editor 		: 'editor',
        render 		: '.render',
        store  		: true,
        handeChanges : true,
        initString : 	'> This is a [Cheetah.io](http://cheetah.io) demo. Sign up for the beta [here](http://cheetah.io).'+
    					'\n\nYou can write LaTex and markdown. To use latex just surround your math in dolla signs. '+
    					'Single ``$`` for inline math and double ``$$`` for centered math.'+
        				'\n\n**For example:**'+
        				'\n\n$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac} }{2a}$$'+
        				'\n\nYour document is saved to localStorage.',
    })

    return this;
}


App.initializeBecquerel = function(){
	var self = this;

	this.becquerel = new Becquerel(this.rontgen.$editor)

	return this;
}

App.initializeEditorEvents = function(){
	var self = this;

	this.$inputTitle.keyup(function(){
		self.$renderTitle.html('<h1>'+self.$inputTitle.val()+'</h1>')
		localStorage.title = self.$inputTitle.val()
	})

	return this;
}

App.initializeDOM = function(){
	var zenMode = false;
	this.$inputTitle.val(localStorage.title)
	this.$renderTitle.html('<h1>'+this.$inputTitle.val()+'</h1>')
	this.$fullscreen.show()
	this.$textarea.hide()
	this.$submit.hide()

	if(!this.$inputTitle.val().length){
		this.$inputTitle.focus()
	}
	else{
		this.rontgen.focusEditor()
	}

	if(localStorage.zen === 'true'){
		this.$('#write').removeClass('span6').addClass('span12')
		this.$('#read').hide()
		zenMode = true;
		localStorage.zen = zenMode;
		this.rontgen.renderingOff()
		this.$fullscreen.hide()
		this.$notFullscreen.show()
	}

	if(localStorage.buttons === 'true'){
		this.$buttonsOpen.hide()
		this.$buttons.show()
	}

	return this;
}

App.initializeLocalStorage = function(){
	if(typeof localStorage.zen === "undefined") localStorage.zen = 'false';
	if(typeof localStorage.title === "undefined") localStorage.title = 'false';
    if(typeof localStorage.buttons === "undefined") localStorage.buttons = 'false';
    return this;
}

App.initializeClickEvents = function(){
	var self = this;

	this.$buttonsOpen.click(function(){
		self.$buttonsOpen.hide()
		self.$buttons.show()
		localStorage.buttons = true;
	})

	this.$buttonsClose.click(function(){
		self.$buttons.hide()
		self.$buttonsOpen.show()
		localStorage.buttons = false;
	})

	this.$fullscreen.click(function(e){
		e.preventDefault()
		$('#write').removeClass('span6').addClass('span12')
		$('#read').hide()
		zenMode = true;
		localStorage.zen = zenMode;
		self.rontgen.renderingOff()
		self.$fullscreen.hide()
		self.$notFullscreen.show()
	})

	this.$notFullscreen.click(function(e){
		e.preventDefault()
		$('#write').removeClass('span12').addClass('span6')
		$('#read').show()
		zenMode = false;
		localStorage.zen = zenMode;
		self.rontgen.renderingOn()
		self.$fullscreen.show()
		self.$notFullscreen.hide()
	})

	if($('.bold')) $('.bold').click(function(){
		self.becquerel.bold()
	})

	if($('.italic')) $('.italic').click(function(){
		self.becquerel.italic()
	})

	if($('.quote')) $('.quote').click(function(){
		self.becquerel.quote()
	})

	if($('.ul')) $('.ul').click(function(){
		self.becquerel.ul()
	})

	if($('.ol')) $('.ol').click(function(){
		self.becquerel.ol()
	})

	if($('.h1')) $('.h1').click(function(){
		self.becquerel.h1()
	})

	if($('.h2')) $('.h2').click(function(){
		self.becquerel.h2()
	})

	if($('.h3')) $('.h3').click(function(){
		self.becquerel.h3()
	})

	if($('.h4')) $('.h4').click(function(){
		self.becquerel.h4()
	})

	return this;
}

App.killOverlay = function(){
	var self = this;

	$('.bar').css({'width':'100%'})
	setTimeout(function(){
		self.rontgen.$render.css({'overflow-y': 'auto'})
		$('.overlay').fadeOut(100)
	},500)

	return this;
}

// Helpers
App.makePost = function(form, saveFlash){
	saveFlash.html('Saving...')
	var jqxhr = $.ajax({
		type: "POST",
		url: '/api/save_ajax',
		data : form.serialize(),
		dataType: 'json'
	});
	jqxhr.done(function(res){
		if(res.success){
			saveFlash.html('Saved.')
		}else{
			saveFlash.html('Save failed.')
		}
	})

	jqxhr.fail(function(res){})
	jqxhr.always(function(res){})
}