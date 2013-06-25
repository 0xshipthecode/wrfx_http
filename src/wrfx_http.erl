-module(wrfx_http).
-author("Martin Vejmelka <vejmelkam@gmail.com>").
-behavior(gen_server).
-define(SERVER, ?MODULE).

%% ------------------------------------------------------------------
%% API Function Exports
%% ------------------------------------------------------------------

-export([start_link/0, start/0]).

%% ------------------------------------------------------------------
%% gen_server Function Exports
%% ------------------------------------------------------------------

-export([init/1, handle_call/3, handle_cast/2, handle_info/2,
         terminate/2, code_change/3]).

%% ------------------------------------------------------------------
%% API Function Definitions
%% ------------------------------------------------------------------

start() ->
    application:start(crypto),
    application:start(ranch),
    application:start(cowboy),
    application:start(wrfx_http).
    

start_link() ->
    gen_server:start_link({local, ?SERVER}, ?MODULE, [], []).

%% ------------------------------------------------------------------
%% gen_server Function Definitions
%% ------------------------------------------------------------------

init(_Args) ->
    io:format("running init.~n"),
    Dispatch = cowboy_router:compile([
				      {'_', 
						% WMS tile server resource
				       [{"/field/:riak_bucket/:riak_key", http_handler_field, []},

						% serve up html/css/js content of viewer app
					{"/viewer/", cowboy_static,
					 [
					  {directory, {priv_dir, wrfx_http, [<<"static/viewer">>]}},
					  {file, "index.html"},
					  {mimetypes, {fun mimetypes:path_to_mimes/2, default}}
					 ]},
					{"/viewer/[...]", cowboy_static,
					 [
					  {directory, {priv_dir, wrfx_http, [<<"static/viewer">>]}},
					  {mimetypes, {fun mimetypes:path_to_mimes/2, default}}
					 ]}
					]}]),

    %% Name, NbAcceptors, TransOpts, ProtoOpts
    cowboy:start_http(main_http_listener, 100,
		      [{port, 8080}],
		      [{env, [{dispatch, Dispatch}]}]),
    {ok, _Args}.

handle_call(_Request, _From, State) ->
    {reply, ok, State}.

handle_cast(_Msg, State) ->
    {noreply, State}.

handle_info(_Info, State) ->
    {noreply, State}.

terminate(_Reason, _State) ->
    ok.

code_change(_OldVsn, State, _Extra) ->
    {ok, State}.

%% ------------------------------------------------------------------
%% Internal Function Definitions
%% ------------------------------------------------------------------

