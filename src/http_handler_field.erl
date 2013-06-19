

-module(http_handler_field).
-author("Martin Vejmelka <vejmelkam@gmail.com>").
-behavior(cowboy_http_handler).
 
-export([init/3]).
-export([handle/2]).
-export([terminate/3]).
 
init({tcp, http}, Req, _Opts) ->
    {ok, Req, undefined_state}.
 
handle(Req, State) ->
    {Bucket, _} = cowboy_req:binding(riak_bucket, Req),
    {Key, _} = cowboy_req:binding(riak_key, Req),
    io:format("bucket was ~p key was ~p~n", [Bucket, Key]),
    {ok, Req2} = cowboy_req:reply(200,
				  [{<<"content-type">>, <<"text/html">>}],
				  <<"<html><body>Hi</body></html>">>, Req),
    {ok, Req2, State}.
	    
 
terminate(_Reason, _Req, _State) ->
    ok.
