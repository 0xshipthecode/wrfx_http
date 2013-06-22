

/* initial display settings */
var web_prefix = "http://localhost:8080/field/colorado_2km_op_wrf_48hr_run";
var current_var = "T2";
var current_index = 0;
var tss = "";

function update_image() {
    $("#fig_main").attr("src", web_prefix + "/" + current_var + "_" + tss[current_index]);
}

/* a short-hand for $(document).ready( ... ) */
$(function() {

    $.get(web_prefix + "/current_valid_ts", function(data) { tss = data.split("|"); update_image(); });

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
