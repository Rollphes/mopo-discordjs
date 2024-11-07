# discord-interaction-binder

<div align="center">
	<p>
		<a href="https://www.npmjs.com/package/discord-interaction-binder"><img src="https://img.shields.io/npm/v/discord-interaction-binder.svg?maxAge=3600" alt="npm version" /></a>
		<a href="https://www.npmjs.com/package/discord-interaction-binder"><img src="https://img.shields.io/npm/dt/discord-interaction-binder.svg?maxAge=3600" alt="npm downloads" /></a>
		<a href="https://github.com/Rollphes/discord-interaction-binder/actions/workflows/github-code-scanning/codeql"><img src="https://github.com/Rollphes/discord-interaction-binder/actions/workflows/github-code-scanning/codeql/badge.svg"/></a>
        <a href="https://github.com/Rollphes/discord-interaction-binder/actions/workflows/eslint.yaml"><img src="https://github.com/Rollphes/discord-interaction-binder/actions/workflows/eslint.yaml/badge.svg"/></a>
    	<a href="https://github.com/Rollphes/discord-interaction-binder/blob/main/LICENCE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg"/></a>
	</p>
</div>

## Overview

A Node.js wrapper for binding interactions in Discord.js.

> [!WARNING]
> This project is currently under development. Features are in a preliminary stage and may be subject to change.
> This library was originally created for personal use in my own Discord bot and has been adapted into a general-purpose library. As a result, there may be instances of unintended behavior or unexpected outcomes.

## Description

DiscordInteractionBinder is a powerful and intuitive library that enhances Discord.js by simplifying the process of handling interactions in your Discord bots. This wrapper provides a streamlined approach to binding execute functions to various Discord interactions, including buttons, select menus, and application commands.

Key features:
- Easy-to-use API for binding execute functions to interactions
- Seamless integration with Discord.js
- Support for buttons, select menus, and application commands
- Simplified command setup using client.interactions.setCommand
- Enhanced ButtonBuilder and other interaction-related builders with execute method

Whether you're building a simple bot or a complex application, DiscordInteractionBinder makes it easier to create responsive and interactive Discord experiences. By reducing boilerplate code and providing a more intuitive interface, this library allows developers to focus on creating engaging bot functionality rather than managing interaction logistics.

## Installation

**Node.js 20 or newer is required.**

```sh-session
npm install discord-interaction-binder
```