#!/bin/bash
docker build -t chaspy/favsearch .
docker rm -f favsearch
docker run --name favsearch -p 4567:4567 -d chaspy/favsearch
