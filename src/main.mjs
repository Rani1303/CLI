// src/main.js
import chalk from 'chalk';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const copy = promisify(ncp);

async function copyTemplateFiles(options) {
    const templateDir = path.resolve(
        __dirname,
        '../templates',
        options.template.toLowerCase()
    );
    
    const targetDir = process.cwd();

    try {
        await copy(templateDir, targetDir, {
            clobber: false,
        });
        return true;
    } catch (err) {
        console.error(chalk.red.bold('Error copying template files:'), err);
        throw err;
    }
}

async function initGit(options) {
    if (options.git) {
        const { execa } = await import('execa');
        try {
            await execa('git', ['init'], {
                cwd: process.cwd(),
            });
            console.log(chalk.green('✔ Initialized git repository'));
        } catch (err) {
            console.error(chalk.red.bold('Failed to initialize git repository:'), err);
            throw err;
        }
    }
}

export async function cli(options) {
    const templateChoices = ['javascript', 'typescript'];
    const template = options.template.toLowerCase();
    
    if (!templateChoices.includes(template)) {
        console.error(chalk.red.bold('ERROR:'), `Invalid template name. Available templates: ${templateChoices.join(', ')}`);
        process.exit(1);
    }
    
    try {
        console.log(chalk.blue('Creating project with following options:'));
        console.log(chalk.blue(JSON.stringify(options, null, 2)));
        
        await copyTemplateFiles(options);
        console.log(chalk.green('✔ Copied template files'));
        
        await initGit(options);
        
        console.log(chalk.green.bold('\nDone! Project setup complete.'));
        return true;
    } catch (err) {
        console.error(chalk.red.bold('Error: '), err);
        process.exit(1);
    }
}