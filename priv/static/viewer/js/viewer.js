

/* a short-hand for $(document).ready( ... ) */
$(function() {
    $("#tabs").tabs();

    /* add onmouseover hooks to display images */
    $("img.t2_preload").mouseover(function() {
	$("#t2_main").attr("src", $(this).attr("src"));
    });
    
});
