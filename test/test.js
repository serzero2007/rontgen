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

    test.init()
    test.start()

});

var test = test || {};

test.init = function(){
    this.$test = $('.test')
    return this;
}

test.log = function(string){
    this.$test.append(string + '</br>')
    return this;
}

test.start = function(){
    var _this = this;
    var i = 0;
    var maxI = 100;
    var string = "$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac} }{2a}$$\n\n"
    this.log('Timing ' + maxI + ' formulas.')

    this.log('x = \\frac{-b \\pm \\sqrt{b^2 - 4ac} }{2a}')
    App.editor.getSession().setValue('');

    var _initial = new Date()
    var bigString = [];
    while(i < maxI){
        bigString.push(string)
        i = i+1;
    }

    App.editor.getSession().setValue(bigString.join(''));

    var j = 0;


    App.on('MathRender', function(){

        var _final = new Date()
        var seconds = (_final.getTime() - _initial.getTime())/1000;
        _this.log(seconds.toString() + ' seconds.')

    });

    return this;

}