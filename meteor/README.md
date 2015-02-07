Build + Meteor status: [![Build Status](https://travis-ci.org/MeteorPackaging/summernote.svg?branch=meteor-integration)](https://github.com/MeteorPackaging/summernote/tree/meteor-integration/meteor)

Packaging [summernote](http://summernote.org/) for [Meteor.js](http://meteor.com).

# Versions

* [summernote:summernote](https://atmospherejs.com/summernote/summernote) - includes jQuery and Bootstrap as dependencies
* [summernote:standalone](https://atmospherejs.com/summernote/standalone) - doesn't include any dependencies


# Meteor

If you're new to Meteor, here's what the excitement is all about -
[watch the first two minutes](https://www.youtube.com/watch?v=fsi0aJ9yr2o); you'll be hooked by 1:28.
That screencast is from 2012. In the meantime, Meteor has become a mature JavaScript-everywhere web
development framework. Read more at [Why Meteor](http://www.meteorpedia.com/read/Why_Meteor).


# Issues

If you encounter an issue while using this package, please CC @dandv when you file it in this repo.


# DONE

* Instantiation test


# TODO

* Make sure the library works with Meteor's reactivity - for example to auto-save to a collection
  transparently after the text changes.
* Tests ensuring correct event handling on template re-rendering
