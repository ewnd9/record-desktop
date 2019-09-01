'use strict';

// #!/usr/bin/python

// # code from:
// # - https://unix.stackexchange.com/questions/5999/setting-the-window-dimensions-of-a-running-application
// # deps:
// # - sudo apt-get install -y python-xlib

// import Xlib
// import Xlib.display

// WIDTH, HEIGHT = 840, 480

// display = Xlib.display.Display()
// root = display.screen().root

// windowID = root.get_full_property(display.intern_atom('_NET_ACTIVE_WINDOW'), Xlib.X.AnyPropertyType).value[0]
// window = display.create_resource_object('window', windowID)

// window.configure(width = WIDTH, height = HEIGHT)
// display.sync()

// https://unix.stackexchange.com/questions/5999/setting-the-window-dimensions-of-a-running-application

// ```sh
// $ xdotool search --name "window name" windowsize 300 400
// ```
