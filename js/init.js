/* global $$, app */
(function() {
	'use strict';


	// load data from URL in GET query else show data-loader view
	(function() {
		var configJSON = $$.queryObj().config;
		app.queryObj = configJSON ? JSON.parse(configJSON) : {};
		var queryURL = app.queryObj.url;

		if (queryURL) {
			app.loadData(queryURL);
		} else {
			app.dataLoaderView.hidden = false;
		}
	})();


	// handle URL loader form
	(function() {
		var PROXY_PREFIX = 'https://jsonp.afeld.me/?url=';
		var urlInput = $$.qs('#url');
		var proxyInput = $$.qs('#proxy');
		$$.on($$.qs('#url-loader-form'), 'submit', function(e) {
			e.preventDefault();

			// hide data loader view
			app.dataLoaderView.hidden = true;

			// load data from URL
			var URL = urlInput.value;
			var proxy = proxyInput.checked;
			if (proxy) URL = PROXY_PREFIX + encodeURIComponent(URL);
			app.loadData(URL);
		});
	})();


	// handle col chooser form
	(function() {
		$$.on($$.qs('#view-col-selector form'), 'submit', function(e) {
			e.preventDefault();

			// extract props from checked items
			var props = [].map.call($$.qsa('input[type=checkbox]:checked', this), function(checkbox) {
				return app.props.find({ _id: checkbox.id }).prop;
			});

			app.colSelectorView.hidden = true;
			app.makeTable(props);
		});
	})();
})();