var Rontgen = Rontgen || function(){};
var MathJax = MathJax || {};

Rontgen.prototype.start = function(){
    var self = this;
    _.extend(this, Backbone.Events);
    this
        .initializeQuickDiff()
        .initializeMarkdown()
        .initializeEditor()

    this.renderOn = true;

    this.editor.getSession().on('change', function(){
        self.handleEditorChange()
    });
    this.handleEditorChange()
}

Rontgen.prototype.getEditorData = function(){
    return this.editor.getSession().getValue()
}

Rontgen.prototype.setEditorData = function(data){
    return this.editor.getSession().setValue(data)
}

Rontgen.prototype.initializeQuickDiff = function(){
    $.fn.quickdiff("filter", "mathSpanInline", function (node) {
        return (node.nodeName === "SPAN" && $(node).hasClass("mathInline"));
    }, function (a, b) {
        var aHTML = $.trim($("script", a).html()), bHTML = $.trim($(b).html());
        return ("%%" + aHTML + "%%") !== bHTML;
    });

    $.fn.quickdiff("filter", "mathSpan", function (node) {
        return (node.nodeName === "SPAN" && $(node).hasClass("math"));
    }, function (a, b) {
        var aHTML = $.trim($("script", a).html()), bHTML = $.trim($(b).html());
        return ("$$" + aHTML + "$$") !== bHTML;
    });

    return this;
}

Rontgen.prototype.initializeMarkdown = function () {
    this.showdown = new Showdown.converter();
    $.extend(this.showdown.config, {
        stripHTML: true,
        tables: true,
        math: true,
        figures: true
    });

    return this;
}


Rontgen.prototype.initializeEditor = function () {
    this.editor = ace.edit('editor');
    this.editor.getSession().setUseWrapMode(true);
    this.editor.setHighlightActiveLine(false);
    this.editor.renderer.setShowGutter(false);

    return this;
}


Rontgen.prototype.handleEditorChange = function(){
    if(!this.renderOn) return;
    else this.redraw()

    return this;
}



Rontgen.prototype.markdown = function (data) {
    return this.showdown.makeHtml(data);
}


Rontgen.prototype.redraw = function () {
    var self = this;

    var data = this.getEditorData();
    data = data.replace(/\$+/g, function(match) {
        return match.length === 1 ? '%%' : match;
    });

    var preproc = $("<div></div>").html(self.markdown(data));

    var patch = $("#output > div").quickdiff("patch", preproc, ["mathSpan", "mathSpanInline"]);

    if (patch.type !== "identical" && patch.replace.length > 0) {
        $.each(patch.replace, function (i, el) {
            if (el.innerHTML) {
                MathJax.Hub.Typeset(el, function () {});
            }
        });
    }

    return this;

};
