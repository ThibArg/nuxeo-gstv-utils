/* station.js */

jQuery(document).ready(function() {

});

// We search only on Employer in this example
function handleSearch() {

	var value = $("#searchBox").val();
	var nxClient, nxql;
	
	if(value != null && value !=  "") {
		value = encodeURIComponent("%" + value + "%");
		nxql = "SELECT * FROM GasStation WHERE dc:title ILIKE '" + "%" + value + "%'";
		nxql += " AND ecm:isVersion = 0 AND ecm:isProxy = 0";
		nxClient = new nuxeo.Client({
			timeout : 10000
		});
		nxClient
			.headers({"X-NXProperties": "gasstation, dublincore"})
			.request("query?query=" + nxql)
			.get(function(inError, inData) {

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

}

function displayStationDetails(inJsonDoc) {
	var divObj = jQuery("#stationDetails"),
		html = "",
		properties;

	divObj.empty();
	if(inJsonDoc == null) {
		html = "(No station found for this query)";
	} else {
		properties = inJsonDoc.properties;

		html = properties["dc:title"] + "<br/>";
		html += "(" + properties["gasstation:company_name"] + ")<br/>";
		html += properties["gasstation:address_street"] + ", ";
		html += properties["gasstation:address_city"] + ", ";
		html += properties["gasstation:address_state"] + ", ";
		html += properties["gasstation:address_zip"] + "<br/>";
		html += "<b>Vendor(s)/Franchise(s): " + properties["gasstation:franchises_names"].join(", ");
		html += "<p></p>"
		html += "<p><div><button class='ui button' onclick='getVideos();'>Get Videos</button></div></p>";
	}
	divObj.append(html);
}

function getVideos() {
	alert("hop");
}

