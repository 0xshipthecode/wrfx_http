
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
var current_index = 0;
var cvts = "";

function update_image() {
    $("#fig_main").attr("src", field_prefix + "/" + current_var + "_" + cvts[current_index]);
    dt = cvts[current_index].split("_");
    $("#fig_text").text(current_var + " on " + dt[0] + " at " + dt[1]);
}

function trim_cvts(data) {
    return data.split("|").slice(1).filter(function (elem, ndx, arr) { return endsWith(elem, "00:00"); });
}

/* a short-hand for $(document).ready( ... ) */
$(function() {

	$.get(field_prefix + "/current_valid_ts", function(data) { cvts = trim_cvts(data); update_image(); });

    /* construct the variable selector buttons */
    $( "#var_radio" ).buttonset();
    $( "#var_radio" ).click( function() { 
	current_var = $("#var_radio :radio:checked").attr("id").split("_")[0];
        update_image(); });

    $( "#beginning" ).button({
	text: false,
	icons: {
	    primary: "ui-icon-seek-start"
	}
    })
	.click(function() {
	    current_index = 0;
	    update_image();
	});

    $( "#rewind" ).button({
	text: false,
	icons: {
	    primary: "ui-icon-seek-prev"
	}
    })
	.click(function() {
	    current_index = Math.max(current_index - 1, 0);
	    update_image();
	});
	    
    $( "#forward" ).button({
	text: false,
	icons: {
	    primary: "ui-icon-seek-next"
	}
    })
	.click(function() {
	    current_index = Math.min(current_index + 1, cvts.length - 1);
	    update_image();
	});
    
    $( "#end" ).button({
	text: false,
	icons: {
	    primary: "ui-icon-seek-end"
	}
    })
	.click(function() {
	    current_index = cvts.length - 1;
	    update_image();
	});

});
