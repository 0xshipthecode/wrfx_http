CWD=$(shell pwd)

all: deps compile

deps: deps/openlayers

deps/openlayers:
	git clone git://github.com/openlayers/openlayers.git deps/openlayers


compile:
	./rebar compile