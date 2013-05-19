String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var Malfunctionator = {

    wordList: null,

    generateWordList: function () {

        var map = {
            'bug': 'malfunction',
            'bugs': 'malfunctions',
            'error': 'malfunction',
            'errors': 'malfunctions',
            'crash': 'malfunction',
            'crashes': 'malfunctions',
            'crashed': 'malfunctioned',
            'crashing': 'malfunctioning'
        };
        var built_map = $.extend({}, map); // Clone map
        for (var key in map) {
            if (map.hasOwnProperty(key)) {
                built_map[ key.toUpperCase() ] = map[key].toUpperCase();
                built_map[ key.capitalize() ] = map[key].capitalize();
            }
        }
        console.log("built_map = ", built_map);
        this.wordList = built_map;
    },

    replaceWordsForText: function (text) {
        for (var word in this.wordList) {
            if (this.wordList.hasOwnProperty(word)) {
                text = text.replace( new RegExp(word, 'g'), this.wordList[word]);
            }
        }
        return text;
    },

    replaceAll: function () {
        var _this = this;
        $('body').each(function(i, el) {
            var replaceWith = _this.replaceWordsForText( $(el).html() );
            $(el).html(replaceWith);
        });
    },

    initialize: function () {
        console.log("Malfunctionator: Initializing");
        this.generateWordList();
        this.replaceAll();
    }
};

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
        Malfunctionator.initialize();
	}
	}, 10);
});