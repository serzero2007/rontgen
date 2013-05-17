var Rontgen = Rontgen || function(){};
var MathJax = MathJax || null;

Rontgen.prototype.start = function(){
    var self = this;
    _.extend(this, Backbone.Events);
    this
        .initializeQuickDiff()
        .initializeMarkdown()
        .initializeRender()
        .initializeEditor()

    this.renderOn = true;

    this.editor.getSession().on('change', function(){
        self.handleEditorChange()
    });
    this.handleEditorChange()
}

Rontgen.prototype.initLocalStorage = function(initString){
    var self = this;
    if (typeof localStorage.editor === "undefined") localStorage.editor = null;
    if(!localStorage.editor) localStorage.editor = initString;
    this.editor.getSession().setValue(localStorage.editor);
    this.editor.getSession().on('change', function(){
        localStorage.editor = self.editor.getSession().getValue();
    });    
};


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
        // stripHTML: true,
        tables: true,
        math: true,
        figures: true
    });

    return this;
}

Rontgen.prototype.initializeRender = function(){
    this.$render = $('.render')
    var box = {};
    box.top = this.$render.position().top
    box.left = this.$render.position().left
    box.bottom = box.top + this.$render.height()
    box.right = box.left + this.$render.width()

    this.box = box;
    return this;
}

Rontgen.prototype.inView = function (el) {
    return this.box.bottom*1.2 > $(el).position().top
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

Rontgen.prototype.mathjax = function(el){
    var self = this;
    if(!MathJax) return this;
    MathJax.Hub.Typeset(el, function(){
        if(el.className === 'math') self.trigger('math')
        if(el.className === 'mathInline') self.trigger('mathInline')
    });
    return this;
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
            if (el.innerHTML) self.mathjax(el);
        });
    }

    return this;

};
