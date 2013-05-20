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
        //console.log("built_map = ", built_map);
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

    replaceInInputs: function () {
      var _this = this;
      $('input[type="text"], textarea').each(function(i, el) {
        var $el = $(el);
        var new_val = _this.replaceWordsForText( $el.val() );
        $el.val(new_val);
      });
    },

    replaceAll: function () {
        var _this = this;
        
        // Replace on all text nodes
        $('body *').each(function(i, el) {
            var childNodes = el.childNodes;
            for (var i = 0; i < childNodes.length; i++) {
              var childNode = childNodes[i];
              if (childNode.nodeType === 3 && ['SCRIPT', 'STYLE'].indexOf(el.tagName) < 0 )
                childNode.nodeValue = _this.replaceWordsForText(childNode.nodeValue);
            }
        });
        
        // Replace in <title>
        $('title').text( _this.replaceWordsForText($('title').text()) );

        // Replace in text boxes
        this.replaceInInputs();
    },

    initialize: function () {
        console.log("Malfunctionator: Initializing");
        this.generateWordList();
        this.replaceAll();
        console.log("Malfunctionator: Finished Initializing");
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