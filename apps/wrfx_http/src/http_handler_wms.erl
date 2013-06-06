

-module(http_handler_wms).
-author("Martin Vejmelka <vejmelkam@gmail.com>").
-behaviour(cowboy_http_handler).
 
-export([init/3]).
-export([handle/2]).
-export([terminate/3]).
 
init({tcp, http}, Req, _Opts) ->
    io:format("init handled~n"),
    {ok, Req, undefined_state}.
 
handle(Req, State) ->
    io:format("inside handler now!~n"),
    {ok, Req2} = cowboy_req:reply(200, [], <<"Hello World!">>, Req),
    {ok, Req2, State}.
 
terminate(_Reason, _Req, _State) ->
    ok.
