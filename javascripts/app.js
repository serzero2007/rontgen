$(function() {
	$('.bar').css({'width':'50%'})

	var rontgen = new Rontgen()
	rontgen.start()

	$('.bar').css({'width':'100%'})

	setTimeout(function(){
        $('.overlay').fadeOut(100)
	},500)
    
    var initString = [
    '# Rontgen.js\n',
    'This is a demo for [Cheetah.io].\n',
    'This editor renders [markdown] and [Tex-math]. Single dollars enclose inline mathematics $\\alpha^2 + \\beta^2 = 1$. Double dollars enclose centered math.\n',
    '$$\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n',
    'The source for this demo is on __[Github]__.\n',
    '[Cheetah.io]:http://cheetah.io',
    '[markdown]:http://daringfireball.net/projects/markdown/',
    '[Tex-math]:http://www.latex-project.org',
    '[Github]:http://github.com/eoinmurray/rontgen',
    ].join('\n');
    
    if (typeof localStorage.editor === "undefined") localStorage.editor = null;
    if(!localStorage.editor) localStorage.editor = initString;
    
    rontgen.editor.getSession().setValue(localStorage.editor)
    
    rontgen.editor.getSession().on('change', function(){
        localStorage.editor = rontgen.editor.getSession().getValue()
    });
    

    MathJax.Hub.Register.StartupHook("End",function () {
            $(".output-show").hide()
            $(".output-hide").fadeIn()
    });

});
