/*global Rontgen MathJax */

$(function() {
    $('#close-fullscreen').hide()

    $('#fullscreen').click(function(e){
		e.preventDefault()
		$('.write').hide()
        $('.read').css({'float': 'none'})
		$('#fullscreen').hide()
		$('#close-fullscreen').show()
	})

	$('#close-fullscreen').click(function(e){
		e.preventDefault()		
        $('.read').css({'float': 'right'})
        $('.write').show()
		$('#fullscreen').show()
		$('#close-fullscreen').hide()
	})
    
	$('.bar').css({'width':'50%'});

	var rontgen = new Rontgen();
	rontgen.start();
    rontgen.initLocalStorage(initString);
    
    new Becquerel(rontgen.editor)
	$('.bar').css({'width':'100%'});

	setTimeout(function(){
        $('.overlay').fadeOut(100);
	},500);
    
    MathJax.Hub.Register.StartupHook("End",function () {
            $(".output-show").hide();
            $(".output-hide").fadeIn();
    });
    

});

var initString = [
    '# Rontgen.js\n',
    'This is a demo for [Cheetah.io].\n',
    'This editor renders [markdown] and [Tex-math]. Single dollars enclose inline mathematics $\\alpha^2 + \\beta^2 = 1$. Double dollars enclose centered math.\n',
    '$$\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n',
    '__The source for this demo is on [Github]__.\n',
    '[Cheetah.io]:http://cheetah.io',
    '[markdown]:http://daringfireball.net/projects/markdown/',
    '[Tex-math]:http://www.latex-project.org',
    '[Github]:http://github.com/eoinmurray/rontgen',
].join('\n');
