# Native installer

Installer for native scripts used with webextension

## Install

```
npm install native-installer
```

/!\ not tested on windows /!\

## Usage

Where `example.json` is the [App manifest](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Native_messaging#App_manifest):

```
native-installer example.json
```

It'll transform relative paths and copy to the browser's wanted path. On windows it adds the correct registry keys.

To remove:

```
native-installer --rm example.json
```

Options:

```
--browser firefox, chrome, chromium - default to all
--global - install globally (might require privilege), default to local user
--rm - removes the file/registry
```
