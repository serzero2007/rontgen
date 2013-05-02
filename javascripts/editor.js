var App = {}
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

App.go = function(){
	$.fn.quickdiff("filter", "mathSpanInline",
        function (node) {
            return (node.nodeName === "SPAN" && $(node).hasClass("mathInline"));
        },
        function (a, b) {
            var aHTML = $.trim($("script", a).html()), bHTML = $.trim($(b).html());
            return ("%%" + aHTML + "%%") !== bHTML;
        }
    );

    // // Setup a filter for comparing math spans.
    $.fn.quickdiff("filter", "mathSpan",
        function (node) {
            return (node.nodeName === "SPAN" && $(node).hasClass("math"));
        },
        function (a, b) {
            var aHTML = $.trim($("script", a).html()), bHTML = $.trim($(b).html());
            return ("$$" + aHTML + "$$") !== bHTML;
        }
    );

    $.fn.quickdiff("attributes", {
        "td" : ["align"],
        "th" : ["align"],
        "img" : ["src", "alt", "title"],
        "a" : ["href", "title"]
    });

    var initString = '## [Cheetah.io](http://cheetah.io) demo.\n\n'+
        '> Sign up for the beta [here](http://cheetah.io). \n\n'+
        'You can write LaTex and markdown. To use latex just surround your math in dollar signs. Single dollar sign for inline math and double ``$$`` for centered math.\n\n'+
        '**For example:**\n\n'+
        '$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac} }{2a}$$\n\n'+
        'Your document is saved to localStorage.\n\n'+
        '__Check out the code for this demo on [Github](http://github.com/eoinmurray/rontgen).__'
        ;

    if(typeof localStorage.editor === "undefined" ) localStorage.editor = initString;
    if(localStorage.editor === "" ) localStorage.editor = initString;
    var redrawNeeded = false, preproc, renderDelay = 0, timer, content = "";
    var markdown = new Showdown.converter();

    $.extend(markdown.config, {
        stripHTML: true,
        tables: true,
        math: true,
        figures: true
    });

    var setRenderDelay = function (rendertime) {
        if (rendertime > 50) {
            renderDelay = 400;
        } else if (rendertime > 10) {
            renderDelay = 50;
        }
    };

    // Redraws the output using the content of the input.
    var redraw = function () {
        if (!redrawNeeded) {
            return;
        } else {
            redrawNeeded = false;
        }

        var startTime = (new Date()).getTime();
        var data = editor.getSession().getValue();
        // var temp = data.split('$$')
        // for(var i = 0; i < temp.length; i++){
        //     temp[i] = temp[i].split('$').join('%%')
        // }
        // data = temp.join('$$')
        data = data.replace(/\$+/g, function(match) {
            return match.length === 1 ? '%%' : match;
        });
        localStorage.editor = editor.getSession().getValue()
        preproc = $("<div></div>").html(markdown.makeHtml(data));
        var patch = $("#output > div").quickdiff("patch", preproc, ["mathSpan", "mathSpanInline"]);

        if (patch.type !== "identical" && patch.replace.length > 0) {
            $.each(patch.replace, function (i, el) {
                if (el.innerHTML) {
                    console.log(true)
                    MathJax.Hub.Typeset(el, function () {
                        setRenderDelay((new Date()).getTime() - startTime);
                    });
                } else if (el.tagName && el.tagName.toLowerCase() === 'img') {
                    // size_image(el);
                } else {
                    setRenderDelay((new Date()).getTime() - startTime);
                }
            });
        } else {
            setRenderDelay((new Date()).getTime() - startTime);
        }
    };

    var suppress_redraw = false;
    var refreshModified = function() {
        if (suppress_redraw) return;
        redrawNeeded = true;
        modified = editor.getSession().getValue() !== content;

        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(redraw, renderDelay);
    }

    var editor = ace.edit('editor');
    editor.getSession().setUseWrapMode(true);
    editor.setHighlightActiveLine(false);
    editor.renderer.setShowGutter(false);
	editor.getSession().on('change', refreshModified);
    if(localStorage.editor) editor.getSession().setValue(localStorage.editor)
}


