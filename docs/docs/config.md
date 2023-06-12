# Config Options

When using this panel in a Dashboard you can customise the display.

## Show Only App Frames

When this is enabled only frames that are marked as an application frame will be visible.

An application frame is a frame that is detected to be part of your application and not part of a framework or the
internals of the language. e.g. a frame in the class java.lang.Thread will not be marked as an application frame.

This is useful to remove frames that you can not change or control, and can allow you to filter reduce the amount of
data you are looking at.

## Show Transpiled Location

When this is enabled the transpiled location of the code will be displayed (if there is any).

A transpiled location is the location of the intermediate source code. e.g. if your app is written in Typescript, this
is transpiled to Javascript and then executed. This means when a tracepoint is triggered it will have the location of
the Javascript not the Typescript. We will map this for you (if the source maps are available), however it can sometimes
be useful to see the underlying transpiled location.

## Auto Expand Depth

This can be set to the depth of variables to automatically expand when loading the data.

If set to 1 (the default) then the variables on the root of the frame will be opened (if they have children). If set to
a higher value, then further levels of variables will be expanded.

This allows for the data to be expanded directly on load, so you do not have to open the children your self.
