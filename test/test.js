$(function() {
    $('.bar').css({'width':'50%'})

    var rontgen = new Rontgen()
    rontgen.start()

    $('.bar').css({'width':'100%'})

    setTimeout(function(){
        $('.overlay').fadeOut(100)
    },500)

    MathJax.Hub.Register.StartupHook("End",function () {
            $(".output-show").hide()
            $(".output-hide").fadeIn()
    });

    // var string = "$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac} }{2a}$$"
    // var testString = []
    // var maxCount = 10;
    // var start = new Date().getTime();

    // for (var n = 0; n < maxCount; n++) {
    //     testString.push(string);
    // }
    // rontgen.editor.getSession().setValue(testString.join('\n\n'))

    rontgen.on('math', function(){
        console.log('sdfsf')
    })

    // rontgen.on('math', function(){
    //     console.log('elapsed.toString()')
    //     var elapsed = new Date().getTime() - start;
    //     console.log(elapsed.toString())
    // })

});
