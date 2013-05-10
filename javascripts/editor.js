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

});
