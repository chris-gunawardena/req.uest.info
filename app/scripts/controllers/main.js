'use strict';

angular.module( 'submitRequestApp' ).controller('MainCtrl', function ($scope, $rootScope, $http, socket, ngTableParams, $timeout, $filter) {

	//demo form submit
	$scope.form_values = { 'Email': 'test@test.com', 'Submit_value': 'Subscribe' };
	$scope.form_submit = function(){
		$scope.form_values.Submit_value = 'Sending request...';
		$http({
			method: 'POST',
			url: '/submit/',
			data: $scope.form_values,
			//headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data, status, headers, config) {
			$scope.form_values.Submit_value = 'Request sent!';
			$timeout(function(){
				$scope.form_values.Submit_value = 'Subscribe';
			}, 3000);
		});
	};

	$scope.requests = [];
	$scope.tableParams = new ngTableParams({
		page: 1,            // show first page
		count: 2,           // count per page
        filter: {
            ip_address: ''       // initial filter
        } 
	},
	{	total: $scope.requests.length, // length of data
		//getData: function($defer, params) {
		//	var orderedData = params.filter() ? $filter('filter')( $scope.requests, params.filter()) :       $scope.requests; 
		//	$defer.resolve(	orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		//}
	});


	$scope.selected_row = false;
	$scope.set_selected_row = function(row_data) {
		//console.log( row_data );
		$scope.selected_row = row_data;
	};

	socket.on('message', function (data) {
		//console.log(data);
		var currentdate = new Date(); 
		data.time = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
		//data.date = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear();
		data.pretty = jf.Process( angular.toJson(data) );
		$scope.requests.unshift(data);
		if( $scope.requests.length > 0 )
			$scope.set_selected_row($scope.requests[0]);
	});

	socket.on('CLIENT_DEBUG_MSG', function (data) {
		console.log(data);	
	});

	//json formatter
	var jf = {
		config : {
			TAB : '    ',
			depth: false,
			ImgCollapsed : "img/Collapsed.gif",
			ImgExpanded : "img/Expanded.gif",
			QuoteKeys : true,
			IsCollapsible : true,
			_dateObj : new Date(),
			_regexpObj : new RegExp()			
		},
		
		/**
		 * Process - starts processing the JSON
		 * @param json - input JSON string
		 * @returns {String} html formatted JSON
		 */
		Process : function(json) {
			var html = "";
			try {
				if (json == "")
					json = "\"\"";
				var obj = eval("[" + json + "]");
				html = jf.ProcessObject(obj[0], 0, false, false, false);
				return html;
			} catch (e) {
				return "JSON invalid.\n" + e.message;
			}
		},
		ProcessObject : function(obj, indent, addComma, isArray, isPropertyContent) {
			var html = "";
			var comma = (addComma) ? "<span class='Comma'>,</span> " : "";
			var type = typeof obj;
			var clpsHtml = "";
			if (jf.IsArray(obj)) {
				if (obj.length == 0) {
					html += jf.GetRow(indent, "<span class='ArrayBrace'>[ ]</span>"
							+ comma, isPropertyContent);
				} else {
					clpsHtml = jf.config.IsCollapsible ? "<span><img src=\""
							+ jf.config.ImgExpanded
							+ "\" onClick=\"jQuery().jsonFormat(this)\" /></span><span class='collapsible'>"
							: "";
					html += jf.GetRow(indent, "<span class='ArrayBrace'>[</span>"
							+ clpsHtml, isPropertyContent);
					for ( var i = 0; i < obj.length; i++) {
						html += jf.ProcessObject(obj[i], indent + 1, i < (obj.length - 1),
								true, false);
					}
					clpsHtml = jf.config.IsCollapsible ? "</span>" : "";
					html += jf.GetRow(indent, clpsHtml
							+ "<span class='ArrayBrace'>]</span>" + comma);
				}
			} else if (type == 'object') {
				if (obj == null) {
					html += jf.FormatLiteral("null", "", comma, indent, isArray, "Null");
				} else if (obj.constructor == jf.config._dateObj.constructor) {
					html += jf.FormatLiteral("new Date(" + obj.getTime() + ") /*"
							+ obj.toLocaleString() + "*/", "", comma, indent, isArray,
							"Date");
				} else if (obj.constructor == jf.config._regexpObj.constructor) {
					html += jf.FormatLiteral("new RegExp(" + obj + ")", "", comma, indent,
							isArray, "RegExp");
				} else {
					var numProps = 0;
					for ( var prop in obj)
						numProps++;
					if (numProps == 0) {
						html += jf.GetRow(indent, "<span class='ObjectBrace'>{ }</span>"
								+ comma, isPropertyContent);
					} else {
						clpsHtml = jf.config.IsCollapsible ? "<span><img src=\""
								+ jf.config.ImgExpanded
								+ "\" onClick=\"jQuery().jsonFormat(this)\" /></span><span class='collapsible'>"
								: "";
						html += jf.GetRow(indent, "<span class='ObjectBrace'>{</span>"
								+ clpsHtml, isPropertyContent);
						var j = 0;
						for ( var prop in obj) {
							var quote = jf.config.QuoteKeys ? "\"" : "";
							html += jf.GetRow(indent + 1, "<span class='PropertyName'>"
									+ quote
									+ prop
									+ quote
									+ "</span>: "
									+ jf.ProcessObject(obj[prop], indent + 1,
											++j < numProps, false, true));
						}
						clpsHtml = jf.config.IsCollapsible ? "</span>" : "";
						html += jf.GetRow(indent, clpsHtml
								+ "<span class='ObjectBrace'>}</span>" + comma);
					}
				}
			} else if (type == 'number') {
				html += jf.FormatLiteral(obj, "", comma, indent, isArray, "Number");
			} else if (type == 'boolean') {
				html += jf.FormatLiteral(obj, "", comma, indent, isArray, "Boolean");
			} else if (type == 'function') {
				if (obj.constructor == jf.config._regexpObj.constructor) {
					html += jf.FormatLiteral("new RegExp(" + obj + ")", "", comma, indent,
							isArray, "RegExp");
				} else {
					obj = jf.FormatFunction(indent, obj);
					html += jf.FormatLiteral(obj, "", comma, indent, isArray, "Function");
				}
			} else if (type == 'undefined') {
				html += jf.FormatLiteral("undefined", "", comma, indent, isArray, "Null");
			} else {
				html += jf.FormatLiteral(obj.toString().split("\\").join("\\\\")
						.split('"').join('\\"'), "\"", comma, indent, isArray, "String");
			}
			return html;
		},
		IsArray : function(obj) {
			return obj && typeof obj === 'object' && typeof obj.length === 'number'
					&& !(obj.propertyIsEnumerable('length'));
		}, 
		FormatLiteral : function(literal, quote, comma, indent, isArray, style) {
			if (typeof literal == 'string')
				literal = literal.split("<").join("&lt;").split(">").join("&gt;");
			var str = "<span class='" + style + "'>" + quote + literal + quote + comma
					+ "</span>";
			if (isArray)
				str = jf.GetRow(indent, str);
			return str;
		},
		FormatFunction : function (indent, obj) {
			var tabs = "";
			for ( var i = 0; i < indent; i++)
				tabs += jf.config.TAB;
			var funcStrArray = obj.toString().split("\n");
			var str = "";
			for ( var i = 0; i < funcStrArray.length; i++) {
				str += ((i == 0) ? "" : tabs) + funcStrArray[i] + "\n";
			}
			return str;
		},
		GetRow : function (indent, data, isPropertyContent) {
			var tabs = "";
			for ( var i = 0; i < indent && !isPropertyContent; i++)
				tabs += jf.config.TAB;
			if (data != null && data.length > 0 && data.charAt(data.length - 1) != "\n")
				data = data + "\n";
			return tabs + data;
		},
		ExpImgClicked : function (img) {
			var container = img.parentNode.nextSibling;
			if (!container)
				return;
			var disp = "none";
			var src = jf.config.ImgCollapsed;
			if (container.style.display == "none") {
				disp = "inline";
				src = jf.config.ImgExpanded;
			}
			container.style.display = disp;
			img.src = src;
		}
	};

	});

