(function(window, undefined){
	var Becquerel = function(editor){
		if($('.bold')) $('.bold').click(function(){
			var range = editor.selection.getRange()
			range.end.column = range.end.column+2
			editor.getSession().insert(range.start, "**")
			editor.getSession().insert(range.end, "**")
			editor.focus()
			range.end.column = range.end.column
			editor.moveCursorToPosition(range.end)
		})

		if($('.italic')) $('.italic').click(function(){
			var range = editor.selection.getRange()
			range.end.column = range.end.column+1
			editor.getSession().insert(range.start, "*")
			editor.getSession().insert(range.end, "*")
			editor.focus()
			range.end.column = range.end.column
			editor.moveCursorToPosition(range.end)
		})

		if($('.italic')) $('.code').click(function(){
			var range = editor.selection.getRange()
			range.end.column = range.end.column+11
			editor.getSession().insert(range.start, "```langname\n")
			editor.getSession().insert(range.end, "\n\n```")
			editor.focus()
			range.end.column = range.end.column+2
			range.end.row = range.end.row+1
			editor.moveCursorToPosition(range.end)
		})

		if($('.quote')) $('.quote').click(function(){
			var range = editor.selection.getCursor()
			var col = range.column
			var row = range.row
			editor.getSession().insert({row: row, column: 0}, "> ")
			editor.focus()
		})

		if($('.ul')) $('.ul').click(function(){
			var range = editor.selection.getCursor()
			var col = range.column
			var row = range.row
			editor.getSession().insert({row: row, column: 0}, "- ")
			editor.focus()
		})

		if($('.ol')) $('.ol').click(function(){
			var range = editor.selection.getCursor()
			var col = range.column
			var row = range.row
			editor.getSession().insert({row: row, column: 0}, "1. ")
			editor.focus()
		})

		if($('.h1')) $('.h1').click(function(){
			var range = editor.selection.getCursor()
			var col = range.column
			var row = range.row
			editor.getSession().insert({row: row, column: 0}, "# ")
			editor.focus()
		})

		if($('.h2')) $('.h2').click(function(){
			var range = editor.selection.getCursor()
			var col = range.column
			var row = range.row
			editor.getSession().insert({row: row, column: 0}, "## ")
			editor.focus()
		})

		if($('.h3')) $('.h3').click(function(){
			var range = editor.selection.getCursor()
			var col = range.column
			var row = range.row
			editor.getSession().insert({row: row, column: 0}, "### ")
			editor.focus()
		})

		if($('.h4')) $('.h4').click(function(){
			var range = editor.selection.getCursor()
			var col = range.column
			var row = range.row
			editor.getSession().insert({row: row, column: 0}, "#### ")
			editor.focus()
		})
	};

	window.Becquerel = Becquerel;

})(window, $)