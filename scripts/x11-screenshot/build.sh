#!/bin/bash

## $ sudo apt-get install libgtk-3-dev

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
gcc `pkg-config --cflags gtk+-3.0` $DIR/x11-screenshot.c -o $DIR/x11-screenshot `pkg-config --libs gtk+-3.0`

