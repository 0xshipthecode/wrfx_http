CWD=$(shell pwd)

all: deps compile

deps: apps/wrfx_http/priv/js

apps/wrfx_http/priv/js: deps/openlayers
	ln -s $(CWD)/deps/openlayers/lib apps/wrfx_http/priv/js

deps/openlayers:
	git clone git://github.com/openlayers/openlayers.git deps/openlayers


compile:
	./rebar compile