

-module(http_handler_field).
-author("Martin Vejmelka <vejmelkam@gmail.com>").
-behavior(cowboy_http_handler).
 
-export([init/3]).
-export([handle/2]).
-export([terminate/3]).
 
init({tcp, http}, Req, _Opts) ->
    {ok, PID} = riakc_pb_socket:start_link("127.0.0.1", 10017),
    {ok, Req, {riak_pid, PID}}.
 
handle(Req, State = {riak_pid, PID}) ->
    {Bucket, _} = cowboy_req:binding(riak_bucket, Req),
    {Key, _} = cowboy_req:binding(riak_key, Req),

    % retrieve the png image from the backend RIAK server
    case riakc_pb_socket:get(PID, Bucket, Key) of
	{ok, O} ->
	    {ok, Req2} = cowboy_req:reply(200,
					  [{<<"content-type">>, content_type(Key)},
					   {<<"Cache-Control">>, <<"max-age=3600, public">>} ],
					  riakc_obj:get_value(O),
					  Req),
	    {ok, Req2, State};
	_ ->
	    {ok, Req2} = cowboy_req:reply(200,
					  [{<<"content-type">>, <<"text/html">>}],
					  <<"<html><body>Sorry, no such field is available</body></html>">>,
					  Req),
	    {ok, Req2, State}
    end.
	    
 
terminate(_Reason, _Req, {riak_pid, PID}) ->
    riakc_pb_socket:stop(PID),
    ok.



content_type(<<"current_valid_ts">>) ->
    <<"text/plain">>;
content_type(_K) ->
    <<"image/png">>.
