# Adventures in Test-Driven Development (TDD)

This repository contains the supporting materials and hands-on material for going through the "Adventures in Test-Driven Development" presentation.
A recording of this presentation can be found [here](https://youtu.be/qZ2Nas4HFwA).

NOTE: There are some variations between the contents of this repository and the code presented at the Midwest JS recording.
Since the code was develop in a TDD fashion, and the presentation is about the process, the results can vary each time a feature is built using TDD.

## Getting Started

* Checkout this repository
* run `npm install -g karma-cli`
* run `npm install`

## Working Through the Tutorial

The following sections walk through building a blind component panel.
A blind component reveals or hides content through clicking on the title bar of the blind, much like [this example](http://bootsnipp.com/snippets/featured/collapsible-panel).

## Adding The First Tests

Type `karma start`. If everything is installed correctly, you should see something like this:

![No tests](/karma-console.png?raw=true "No tests")

