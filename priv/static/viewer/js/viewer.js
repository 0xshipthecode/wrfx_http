
var field_prefix = "http://localhost:8080/field/colorado_2km_op_wrf_48hr_run";

(function(){
    /* detect URL for field retrieval */
    var doc_loc = document.location.href;
    var viewer_ndx = doc_loc.indexOf("/viewer");
    field_prefix = doc_loc.substring(0, viewer_ndx) + "/field/fire_danger_operational_v1";
 }());

/* endsWith from http://stackoverflow.com/questions/280634/endswith-in-javascript/2548133#2548133 */
function endsWith(str, suffix) { 
   return str.indexOf(suffix, str.length - suffix.length) !== -1;
}


/* initial display settings */
var current_var = "T2";
var var_table = { "T2" : "Temperature at 2m", "RH" : "Relative Humidity", "RAIN" : "Rain",
		  "FM1" : "1-hr fuel moisture", "FM10" : "10-hr fuel moisture",
		  "FM100" : "100-hr fuel moisture" };
var current_index = 0;
var cvts = "";

function update_image() {
    /* update main figure space */
    var img_url=field_prefix + "/" + current_var + "_" + cvts[current_index];
    $("#fig_main").attr("src", img_url);
    /* update date/time string */
    dt = moment(cvts[current_index] + " +0000", "YYYY-MM-DD_HH:mm:ss Z");
    $("#fig_text").text(var_table[current_var] + " on " + dt.format());
}

function trim_cvts(data) {
    return data.split("|").slice(1).filter(function (elem, ndx, arr) { return endsWith(elem, "00:00"); });
}

/* a short-hand for $(document).ready( ... ) */
$(function() {

	$.get(field_prefix + "/current_valid_ts", function(data) { cvts = trim_cvts(data); update_image(); });

    /* construct the variable selector buttons */
    $( "#var_radio" ).buttonset();
    $( "#var_radio" ).click( function(event) { 
	    var new_var = $("#var_radio :radio:checked").attr("id").split("_")[0];
	    if(new_var != current_var)
		{
		    current_var = new_var;
		    update_image();
		}
	});

    $( "#beginning" ).button({
	text: false,
	icons: {
	    primary: "ui-icon-seek-start"
	}
    })
	.click(function(event) {
	    current_index = 0;
	    update_image();
	    event.preventDefault();
	});

    $( "#rewind" ).button({
	text: false,
	icons: {
	    primary: "ui-icon-seek-prev"
	}
    })
	.click(function(event) {
	    current_index = Math.max(current_index - 1, 0);
	    update_image();
	    event.preventDefault();
	});
	    
    $( "#forward" ).button({
	text: false,
	icons: {
	    primary: "ui-icon-seek-next"
	}
    })
	.click(function(event) {
	    current_index = Math.min(current_index + 1, cvts.length - 1);
	    update_image();
	    event.preventDefault();
	});
    
    $( "#end" ).button({
	text: false,
	icons: {
	    primary: "ui-icon-seek-end"
	}
    })
	.click(function(event) {
	    current_index = cvts.length - 1;
	    update_image();
	    event.preventDefault();
	});

});
