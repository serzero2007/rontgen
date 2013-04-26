(function(window, undefined){
	var Becquerel = function(editor){
		this.editor = editor;
		var self = this;
	};

	Becquerel.prototype.bold = function(){
		var range = this.editor.selection.getRange()
		range.end.column = range.end.column+2
		this.editor.getSession().insert(range.start, "**")
		this.editor.getSession().insert(range.end, "**")
		this.editor.focus()
		range.end.column = range.end.column
		this.editor.moveCursorToPosition(range.end)
	}

	Becquerel.prototype.italic = function(){
		var range = this.editor.selection.getRange()
		range.end.column = range.end.column+1
		this.editor.getSession().insert(range.start, "*")
		this.editor.getSession().insert(range.end, "*")
		this.editor.focus()
		range.end.column = range.end.column
		this.editor.moveCursorToPosition(range.end)
	}

	Becquerel.prototype.quote = function(){
		var range = this.editor.selection.getCursor()
		var col = range.column
		var row = range.row
		this.editor.getSession().insert({row: row, column: 0}, "> ")
		this.editor.focus()
	}

	Becquerel.prototype.ul = function(){
		var range = this.editor.selection.getCursor()
		var col = range.column
		var row = range.row
		this.editor.getSession().insert({row: row, column: 0}, "- ")
		this.editor.focus()
	}

	Becquerel.prototype.ol = function(){
		var range = this.editor.selection.getCursor()
		var col = range.column
		var row = range.row
		this.editor.getSession().insert({row: row, column: 0}, "1. ")
		this.editor.focus()
	}

	Becquerel.prototype.h1 = function(){
		var range = this.editor.selection.getCursor()
		var col = range.column
		var row = range.row
		this.editor.getSession().insert({row: row, column: 0}, "# ")
		this.editor.focus()
	}

	Becquerel.prototype.h2 = function(){
		var range = this.editor.selection.getCursor()
		var col = range.column
		var row = range.row
		this.editor.getSession().insert({row: row, column: 0}, "## ")
		this.editor.focus()
	}

	Becquerel.prototype.h3 = function(){
		var range = this.editor.selection.getCursor()
		var col = range.column
		var row = range.row
		this.editor.getSession().insert({row: row, column: 0}, "### ")
		this.editor.focus()
	}

	Becquerel.prototype.h4 = function(){
		var range = this.editor.selection.getCursor()
		var col = range.column
		var row = range.row
		this.editor.getSession().insert({row: row, column: 0}, "#### ")
		this.editor.focus()
	}

	window.Becquerel = Becquerel;

})(window, $)