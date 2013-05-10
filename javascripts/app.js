var App = App || {};
var MathJax = MathJax || {};

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

    // Redraws the output using the content of the input.
    var redraw = function () {
        if (!redrawNeeded) {
            return;
        } else {
            redrawNeeded = false;
        }

        var startTime = (new Date()).getTime();
        var data = editor.getSession().getValue();
    
        data = data.replace(/\$+/g, function(match) {
            return match.length === 1 ? '%%' : match;
        });
        localStorage.editor = editor.getSession().getValue()
        preproc = $("<div></div>").html(markdown.makeHtml(data));
        var patch = $("#output > div").quickdiff("patch", preproc, ["mathSpan", "mathSpanInline"]);
        $(document).trigger('TextRender')
        if (patch.type !== "identical" && patch.replace.length > 0) {
            $.each(patch.replace, function (i, el) {
                if (el.innerHTML) {
                    MathJax.Hub.Typeset(el, function () {});
                    $(document).trigger('MathRender')
                }
            });
        } else {
        
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
    
    this.editor = editor
}


