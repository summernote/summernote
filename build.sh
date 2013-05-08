#!/bin/bash
#
# (c) 2013~ Youngteac Hong
# summernote may be freely distributed under the MIT license./

# Build summernote using the default settings

# build js
r.js -o baseUrl=js name=summernote include=../libs/require out=build/summernote_min.js

# build css
lessc css/summernote.less > build/summernote.css
