/* global $$, DOM, DDS, modal */
(function() {
	'use strict';

	function loadData(url) {
		// show loading status
		app.loadingView.hidden = false;

		// load records
		app.dataURL = url;
		$$.loadJSON(url, app.handleData, function(errorMsg) {
			// show URL loader view instead of loading view
			app.loadingView.hidden = true;
			app.dataLoaderView.hidden = false;

			// notify user of error
			modal('alert', errorMsg, ['Ok']);
		});
	}

	function handleData(data) {
		// show num records loaded
		DOM.empty(app.loadingView);
		app.loadingView.appendChild(DOM.buildDocFrag([
			{ el: 'h1', kids: ['All ' + data.length + ' records loaded'] },
			{ el: 'p', kids: [
				'loaded from: ',
				{ el: 'strong', kid: '' + app.dataURL }
			] }
		]));

		// find out which props to use as table cols
		if (app.queryObj.tableCols) {
			app.makeTable(app.queryObj.tableCols);
		} else {
			var props = Object.keys(data[0]);
			renderColSelectors(props);
		}

		app.records = new DDS(data);
	}

	function renderColSelectors(props) {
		var propObjs = props.map(function(prop) {
			return {prop: prop};
		});
		app.props = new DDS(propObjs);
		app.props.render(new DDS.DOMView({
			parent: $$.qs('#col-names'),
			renderer: function(col) {
				return DOM.buildNode({ el: 'li', kids: [
					{ el: 'label', kids: [
						{ el: 'input', type: 'checkbox', id: col._id },
						col.prop
					] }
				] });
			}
		}));

		// show column selector view
		app.colSelectorView.hidden = false;
	}

	function makeTable(props) {
		// add <th>s to <thead>
		app.thView = new DDS.DOMView({
			parent: $$.qs('#view-table thead'),
			renderer: function(propObj) {
				return DOM.buildNode({
					el: 'th',
					kid: '' + propObj.prop
				});
			},
			filter: function(propObj) {
				return props.indexOf(propObj.prop) >= 0;
			}
		});
		app.props.render(app.thView);

		// add <tr>s to <tbody>
		app.records.render(new DDS.DOMView({
			parent: $$.qs('#view-table tbody'),
			renderer: renderTableRow
		}));

		// unhide table view
		$$.qs('#view-table').hidden = false;
	}

	function renderTableRow(record) {
		var tds = app.thView.objects.map(function(colObj) {
			return DOM.buildNode({ el: 'td', kid: '' + record[colObj.prop]});
		});
		return DOM.buildNode({ el: 'tr', kids: tds });
	}

	var app = window.app = {
		loadingView: $$.qs('#view-loading'),
		colSelectorView: $$.qs('#view-col-selector'),
		dataLoaderView: $$.qs('#view-data-loader'),
		loadData: loadData,
		handleData: handleData,
		makeTable: makeTable,
		numLoaded: null
		// app.records, app.props, app.dataURL
	};
})();