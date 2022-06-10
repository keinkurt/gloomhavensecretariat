# Gloomhaven Secretary

[Latest Online Version](https://lurkars.github.io/gloomhavensecretary/)

An open source Gloomhaven Helper clone made as web app with Angular.

This is basically a clone implementing the same functionality and look&feel of the original Gloomhaven Helper since I am not capable of good design/UX. So feel free to contribute better assets.

## Missing / Upcoming

- some monster data, most data of other editions
- objectives, goals and section mechanic
- ~~i18n support~~
- ~~summons~~
- ~~standalone app with Electron\/PWA~~
- ~~releases for easier self hosting~~
- server part to sync states
- ~~load (JSON-)data from URL, so easier custom content integration~~

## Install

All files for installation can be found at the  page.

### Progressive Web App

You can always install any hosted version as PWA if your OS/Browser supports installation of PWA. For example here is the [Latest Online Version](https://lurkars.github.io/gloomhavensecretary/)


### Standalone

An Electron app is provided for Linux, Mac and Windows. Download the corresponding files from the [latest release](https://github.com/Lurkars/gloomhavensecretary/releases/latest) assets.

> only tested Linux AppImage for now

### Selfhost

To selfhost Gloomhaven Secretary on your webserver, simple download the [latest release](https://github.com/Lurkars/gloomhavensecretary/releases/latest) zip file and unzip to your webserver. 

> The base url for this build is set to root. To use a different base url please [build your own package](#build-from-source).


## Build from source

If you want to create you own custom build (for example to [selfhost](#selfhost)), prepare a [development setup](#development). Afterwards run `ng build` and access build under `./dist/gloomhavensecretary`.

## Development

Prerequisite:

- up-to-date [Node.js](https://nodejs.org) and npm version
- [Angular CLI](https://github.com/angular/angular-cli) installed. If you don’t have Angular CLI installed, install it using `npm install -g @angular/cli`.

Checkout the source code with `git clone https://github.com/Lurkars/gloomhavensecretary.git`.

Run `ng serve` to create a development server at [http://localhost:4200](http://localhost:4200).

## Contributing

Feel free to file a [new issue](https://github.com/Lurkars/gloomhavensecretary/issues/new/choose) for bugs, features, improvements, help or feedback.

Also pull requests are welcome!

## Copyright / License

Gloomhaven and all related properties, images and text are owned by [Cephalofair Games](https://cephalofair.com).

Assets used:
- [Creator Pack by Isaac Childres](https://boardgamegeek.com/thread/1733586/files-creation) CC BY-NC-SA 4.0
- [Worldhaven](https://github.com/any2cards/worldhaven)
- some other assets used are public domain licensed

Source code is licenced under [AGPL](/LICENSE)

