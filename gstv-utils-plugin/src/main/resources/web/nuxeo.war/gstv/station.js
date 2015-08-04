/* station.js */
var gStationName = "", gStationId = "";

jQuery(document).ready(function() {
	gStationName = "76-CA-49";
	console.warn("For demo only. The Gas Station to use is hard coded to " + gStationName);
	searchStationForName(gStationName);

});

function searchStationForName(inName) {

	var nxClient, nxql;
	
	inName = encodeURIComponent("%" + inName + "%");
	nxql = "SELECT * FROM GasStation WHERE dc:title ILIKE '" + "%" + inName + "%'";
	nxql += " AND ecm:isVersion = 0 AND ecm:isProxy = 0";
	
	nxClient = new nuxeo.Client({
		timeout : 10000
	});
	nxClient
	.headers({"X-NXProperties": "gasstation, dublincore"})
	.request("query?query=" + nxql)
	.get(function(inError, inData) {

		gStationName = "";
		gStationId = "";

		if(inError) {
			alert(inError);
		} else {
			if(inData.resultsCount === 0) {
				displayStationDetails(null);
			} else {
				// Get the first
				displayStationDetails(inData.entries[0]);
			}
		}
	});

}

// Unused. But when the searhBox will be displayed again, it's ready ;->
function handleSearch() {

	var value = $("#searchBox").val();
	
	if(value != null && value !=  "") {
		searchStationForName(value);
	}

}

function displayStationDetails(inJsonDoc) {
	var nameObj = jQuery("#stationName"),
		detailsObj = jQuery("#stationDetails"),
		html = "",
		properties;

	nameObj.empty();
	detailsObj.empty();
	if(inJsonDoc == null) {
		html = "(No station found for this query)";
	} else {

		gStationName = inJsonDoc.title;
		nameObj.text(gStationName);
		
		gStationId = inJsonDoc.uid

		properties = inJsonDoc.properties;

		html += "Company: " + properties["gasstation:company_name"] + "<br/>";
		html += properties["gasstation:address_street"] + ", ";
		html += properties["gasstation:address_city"] + ", ";
		html += properties["gasstation:address_state"] + ", ";
		html += properties["gasstation:address_zip"];
		html += "<p></p>"
		html += "<b>Vendor(s)/Franchise(s): " + properties["gasstation:franchises_names"].join(", ");
		html += "<p></p>"
		html += "<p><div><button class='ui button' onclick='getVideos();'>Get Videos</button></div></p>";
	}
	detailsObj.append(html);
}

function getVideos() {
	var nxClient, automationParams;
	nxClient = new nuxeo.Client({
		timeout : 10000
	});
	
	nxClient.operation("GasStation_SearchVideos")
		.headers({"X-NXProperties": "video_gstv, dublincore"})
		.input(gStationId)
		.execute(function(inError, inData) {
		
			if(inError) {
				alert(inError);
			} else {
				
				displayVideos(inData.entries);
			}
		
		});


	/* With jQuery:
	automationParams = {
		input: gStationId,
		params : {},
		context : {}
	};
	jQuery.ajax({
		url : "/nuxeo/site/automation/GasStation_SearchVideos",
		contentType : "application/json+nxrequest",
		type : "POST",
		data : JSON.stringify(automationParams)
	}).done(function(inData, inStatusText, inXHR) {
		
		debugger;
		
	}).fail(function(inXHR, inStatusText, inErrorText) {
		alert("Error getting the videos\n" + inErrorText);
	});
	
	//===============
	return
	//===============
	*/
	
}

function displayVideos(inJsonEntries) {
	var mainDivObj = jQuery("#maindiv"),
		videosObj = jQuery("#videos"),
		html,
		properties;

	if(videosObj != null && videosObj.length > 0) {
		videosObj.remove();
	}

	/*
	html = "<div id='videos' class='ui segment'>";
	inJsonEntries.forEach(function(oneDoc) {
		properties = oneDoc.properties;
		html += properties["dc:title"] + "<br/>";
	});
	html += "</div>";
	*/
	html = "<div id='videos' class='ui segments'>";
	inJsonEntries.forEach(function(oneDoc) {
		properties = oneDoc.properties;
		html += "<div class='ui segment'><a href='/nuxeo/nxdoc/default/" + oneDoc.uid + "/view_documents'>" + properties["dc:title"] + "</a></div>";
	});
	html += "</div>";

	mainDivObj.append(html);
}

