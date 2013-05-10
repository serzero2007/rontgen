var express = require("express");
var app = express();

app.configure(function() {
    app.use(express.static(__dirname));
});

console.log('listening on ', process.env.PORT || 8080);
app.listen(process.env.PORT || 8080);