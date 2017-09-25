#!make

#PWD=$(shell pwd)
DATADIR=data3
ERRORSDIR=errors3

setup: makedirs
.PHONY: setup

makedirs:
	test -d $(DATADIR) || mkdir $(DATADIR)
	chmod a+w $(DATADIR)
	test -d $(ERRORSDIR) || mkdir $(ERRORSDIR)
	chmod a+w $(ERRORSDIR)
