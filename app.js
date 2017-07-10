#!/usr/bin/env node

const electronPath = require('electron');
const childProcess = require('child_process');

const args = process.argv.slice(2);
args.unshift(__dirname);

const env = Object.create(process.env);
env.NODE_ENV = 'production';

childProcess.spawn(electronPath, args, { stdio: 'inherit', env });
