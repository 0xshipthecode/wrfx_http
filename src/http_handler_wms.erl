

-module(http_handler_wms).
-author("Martin Vejmelka <vejmelkam@gmail.com>").
-behavior(cowboy_http_handler).
 
-export([init/3]).
-export([handle/2]).
-export([terminate/3]).
 
init({tcp, http}, Req, _Opts) ->
    {ok, Req, undefined_state}.
 
handle(Req, State) ->
    {WmsRq, _} = cowboy_req:qs_val(<<"REQUEST">>, Req, request_missing),
    io:format("request was ~p~n", [WmsRq]),
    case WmsRq of
	<<"GetMap">> ->
	    {AllRq, _} = cowboy_req:qs_vals(Req),
	    io:format("Variables ~p~n", [AllRq]),
	    {ok, B} = file:read_file("/home/martin/Projects/wrfx_http/priv/static/viewer/static_images/T2_2013-06-04T09:00:00.png"),
	    {ok, Req2} = cowboy_req:reply(200, [{<<"content-type">>, <<"image/png">>}], B, Req),
	    {ok, Req2, State};
	<<"GetCapabilities">> ->
	    {ok, B} = file:read_file("/home/martin/Projects/wrfx_http/priv/static/viewer/wrfx_http_capabilities.xml"),
	    {ok, Req2} = cowboy_req:reply(200, [{<<"content-type">>, <<"text/xml">>}], B, Req),
	    {ok, Req2, State};
	request_missing ->
	    {ok, Req2} = cowboy_req:reply(404, [], [], Req),
	    {ok, Req2, State}
    end.
	    
 
terminate(_Reason, _Req, _State) ->
    ok.
