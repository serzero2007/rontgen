(function(window, $){

    var Rontgen = function(options){
        options.handeChanges = options.handeChanges || null;
        options.store = options.store || null;
        options.markedownMode = options.markedownMode || null;
        this.initString = options.initString || null;
        if(typeof localStorage.rontgen === "undefined") localStorage.rontgen = '';
        if(this.checks()) this.initialize(options)
    };

    Rontgen.prototype.checks = function(){
        var boole = true

        if(typeof $ === "undefined"){
            console.log('I need jQuery')
            boole = false;
        }
        else if(typeof marked === "undefined"){
            console.log('I need marked.js')
            boole = false;
        }
        else if(typeof ace === "undefined"){
            console.log('I need ace')
            boole = false;
        }
        else if(typeof MathJax === "undefined"){
            console.log('MathJax not present, wont render math.')
        }

        return boole;
    }

    Rontgen.prototype.initialize = function(options){
        this.options = options;

        this.last_i = 0;
        this.rendering = true;
        this.this_i = 0;
        this.cache = [''];
        this.row_num = 1000;

        this
            .initializeHashes()
            .initializeRender(options)
            .initializeAce(options)

        this.listening = true;
        this.initializeListeners()
        this.setAceFromLocalStorage()
        this.changeHandler()

    }

    Rontgen.prototype.initializeHashes = function(){
        this.hashes = []
        var i = 0;
        for(i = 0; i < this.row_num; i++){
            this.hashes.push(Math.random().toString(36).substring(2,8))
        }
        this.hashes.push(Math.random().toString(36).substring(2,8))
        return this;
    }

    Rontgen.prototype.initializeRender = function(){
        this.$render = $(this.options.render);
        this.$render.append('<div id="inView"></div>')
        var i = 0;
        for(i = 0; i < this.row_num; i++){
            this.$render.append('<div id="'+this.hashes[i]+'"></div>')
        }
        return this;
    };

    Rontgen.prototype.initializeAce = function(options){
        this.$editor = ace.edit(this.options.editor);
        this.$editor.getSession().setUseWrapMode(true);
        this.$editor.setHighlightActiveLine(false);
        this.$editor.renderer.setShowGutter(false);

        return this;
    };

    Rontgen.prototype.initializeListeners = function(){
        var self = this;
        this.$editor.getSession().on('change', function(e) {
            if(self.isListening()){
                self.changeHandler()
            }
        });
        return this;
    }

    Rontgen.prototype.changeHandler = function(){
        var data = this.$editor.getSession().getValue()
        if(this.rendering){

            var fresh = this.parseBlocks( marked(data) )

            var i = 0;
            for(i = 0; i < fresh.length; i++){
                if(fresh[i]!==this.cache[i]){
                    $('#'+this.hashes[i]).html(fresh[i])
                    if($('#bottom_padding')) $('#bottom_padding').remove()
                    if(Math.abs(this.last_i - i) > 1) $('#'+this.hashes[[(   i-2 > 0 ? i-2 : 0    )]])[0].scrollIntoView()
                    this.renderMathJax(this.hashes[i])
                }
            }

            last_i = i;
            this.emptyBelow(fresh.length)
            this.cache = fresh;
            this.setLocalStorage(data)
        }
        this.trigger('changed', data)
    };

    Rontgen.prototype.pushDown = function(num){
        var i = num;
        for (i = num; i < this.row_num; i++){
            $("#row" + this.hashes[i]).attr({"id": this.hashes[i+1]})
        }
        this.hashes.splice(num, 0, Math.random().toString(36).substring(2,8));
        $('#'+this.hashes[num+1]).before('<div id="'+this.hashes[num]+'"></div>')
    }

    Rontgen.prototype.parseBlocks = function(string){
        var elements = $(string).map(function(val, i) {
            return $('<div>').append(this).html();  // Basically `.outerHTML()`
        });
        return elements;
    };

    Rontgen.prototype.renderMathJax = function(el){
        if(typeof MathJax !== "undefined")
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,el]);
    };

    Rontgen.prototype.setAceFromLocalStorage = function(){
        if(this.options.store === true){
            if(localStorage.rontgen !== '') this.$editor.getSession().setValue(localStorage.rontgen)
            else this.$editor.getSession().setValue(this.initString)
        }
        else this.$editor.getSession().setValue(this.initString)
    };

    Rontgen.prototype.setLocalStorage = function(string){
        if(this.options.store === true){
            localStorage.rontgen = string;
        }
    };


    Rontgen.prototype.isListening = function(){
        return this.listening;
    }

    Rontgen.prototype.listeningOff = function(){
        this.listening = false;
        return this;
    }

    Rontgen.prototype.listeningOn = function(){
        this.listening = true;
        return this;
    }

    Rontgen.prototype.isRendering = function(){
        return this.rendering;
    }

    Rontgen.prototype.renderingOff = function(){
        this.rendering = false;
        return this;
    }

    Rontgen.prototype.renderingOn = function(){
        this.rendering = true;
        return this;
    }

    Rontgen.prototype.focusEditor = function(){
        this.$editor.focus()
        return this;
    }

    Rontgen.prototype.emptyBelow = function(n){
        var j;
        for(j = n; j < this.row_num; j++){
            $('#'+this.hashes[j]).empty()
        }
        return this;
    };

    // /*http://notes.jetienne.com/2011/03/22/microeventjs.html*/
    Rontgen.prototype.on = function(event, fct){
        this._events = this._events || {};
        this._events[event] = this._events[event]   || [];
        this._events[event].push(fct);
    };

    Rontgen.prototype.off  = function(event, fct){
        this._events = this._events || {};
        if( event in this._events === false  )  return;
        this._events[event].splice(this._events[event].indexOf(fct), 1);
    };

    Rontgen.prototype.trigger = function(event /* , args... */){
        this._events = this._events || {};
        if( event in this._events === false  )  return;
        for(var i = 0; i < this._events[event].length; i++){
            this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
        }
    };


    Rontgen.mixin = function(destObject){
        var props   = ['on', 'off', 'trigger'];
        for(var i = 0; i < props.length; i ++){
            destObject.prototype[props[i]]  = Rontgen.prototype[props[i]];
        }
    };

    Rontgen.mixin(Rontgen);

    window.Rontgen = Rontgen;

})(window, $, MathJax, marked, ace)
