/* global DOM, DDS, Obj, fetch */
// exports: $$, Arr, Obj.matches, DOM.empty
(function() {
	'use strict';

	Obj.matches = function(queryObj, dataObj) {
		for (var key in queryObj) {
			if (queryObj[key] !== dataObj[key]) return false;
		}
		return true;
	};

	window.Arr = {
		findAll: function(arr, queryObj) {
			return arr.filter(Obj.matches.bind(null, queryObj));
		},

		find: function(arr, queryObj) {
			var numRows = arr.length;
			for (var i = 0; i < numRows; i++) {
				if (Obj.matches(queryObj, arr[i])) return arr[i];
			}
		}
	};

	DOM.empty = function(parent) {
		while (parent.firstChild) {
			parent.removeChild(parent.firstChild);
		}
	};

	function renderMultiple(parent, array, renderer) {
		return DDS.DOMView.prototype.renderMultiple.call({parent: parent}, array, renderer);
	}

	// Get elements by CSS selector:
	function qs(selector, scope) {
		return (scope || document).querySelector(selector);
	}
	function qsa(selector, scope) {
		return (scope || document).querySelectorAll(selector);
	}

	// Add and remove event listeners:
	function on(target, type, callback, useCapture) {
		target.addEventListener(type, callback, !!useCapture);
	}

	function off(target, type, callback, useCapture) {
		target.removeEventListener(type, callback, !!useCapture);
	}

	// requires fetch polyfill
	function loadJSON(URL, cb) {
		fetch(URL).then(
			function(response) {
				if (response.status !== 200) {
					console.log('Problem loading JSON from ' + URL + '. Status Code: ' + response.status);
					return;
				}

				// Examine the text in the response
				response.json().then(cb);
			}
		).catch(function(err) {
			console.log('Fetch Error:', err);
		});
	}

	function queryObj() {
		var obj = {}, keyValuePairs = decodeURIComponent(location.search).slice(1).split('&');

		keyValuePairs.forEach(function(keyValuePair) {
			keyValuePair = keyValuePair.split('=');
			obj[keyValuePair[0]] = keyValuePair[1] || '';
		});

		return obj;
	}

	// Use:
	// queryObj()['search'] //--> 'pictures of cats'


	window.$$ = {
		qs: qs,
		qsa: qsa,
		on: on,
		off: off,
		loadJSON: loadJSON,
		queryObj: queryObj,
		renderMultiple: renderMultiple
	};
})();