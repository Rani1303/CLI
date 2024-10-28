#!/usr/bin/env node
import { cli_tool } from '../src/cli.js';

process.on('unhandledRejection', err => {
    console.error('Error:', err);
    process.exit(1);
});

// Run the CLI
cli_tool(process.argv).catch(err => {
    console.error('Error:', err);
    process.exit(1);
});