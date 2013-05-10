$(function() {
    $('.bar').css({'width':'50%'})

	App.go()

	$('.bar').css({'width':'100%'})

	setTimeout(function(){
        $('.overlay').fadeOut(100)
	},500)

    MathJax.Hub.Register.StartupHook("End",function () {
            $(".output-show").hide()
            $(".output-hide").fadeIn()
            
    });
    start()

});

var start = function(){
    var i = 0;
    App.editor.getSession().setValue('');
    var string = "$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac} }{2a}$$\n\n"
    var _initial = new Date()
    var bigString = [];
    while(i < 70){
        bigString.push(string)
        i = i+1;
    }
       
    App.editor.getSession().setValue(bigString.join(''));
    
    var _final = new Date()
    var seconds = (_final.getTime() - _initial.getTime())/1000;
    $(document).on('MathRender', function(){
        console.log(seconds.toString());
    })

}