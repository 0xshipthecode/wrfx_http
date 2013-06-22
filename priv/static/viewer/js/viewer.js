
var field_prefix = "http://localhost:8080/field/colorado_2km_op_wrf_48hr_run";

(function(){
    /* detect URL for field retrieval */
    var doc_loc = document.location.href;
    var viewer_ndx = doc_loc.indexOf("/viewer");
    field_prefix = doc_loc.substring(0, viewer_ndx) + "/field/fire_danger_operational_v1";
 }());


/* initial display settings */
var current_var = "T2";
var current_index = 0;
var tss = "";

function update_image() {
    $("#fig_main").attr("src", field_prefix + "/" + current_var + "_" + tss[current_index]);
    dt = tss[current_index].split("_");
    $("#fig_text").text(current_var + " on " + dt[0] + " at " + dt[1]);
}

/* a short-hand for $(document).ready( ... ) */
$(function() {

    $.get(field_prefix + "/current_valid_ts", function(data) { tss = data.split("|"); update_image(); });

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
	    current_index = Math.min(current_index + 1, tss.length - 1);
	    update_image();
	});
    
    $( "#end" ).button({
	text: false,
	icons: {
	    primary: "ui-icon-seek-end"
	}
    })
	.click(function() {
	    current_index = tss.length - 1;
	    update_image();
	});

});
