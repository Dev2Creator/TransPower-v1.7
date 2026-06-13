#!/usr/bin/env node

const readline = require('readline');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');

// Theme Colors (Trans Pride Flag colors + aesthetic)
const pink = chalk.hex('#F5A9B8');
const blue = chalk.hex('#5BCEFA');
const white = chalk.hex('#FFFFFF');
const dim = chalk.dim;

let pipeline, env;
let generator = null;

const modelName = 'Sweetheart-135M';
const localModelPath = path.join(__dirname, 'www', 'assets', 'model');

function printBanner() {
    console.clear();
    console.log(blue.bold('╭──────────────────────────────────────────────────╮'));
    console.log(blue.bold('│') + pink.bold('                 TRANS POWER v1.7                 ') + blue.bold('│'));
    console.log(blue.bold('│') + white('           Sweetheart Local AI Terminal           ') + blue.bold('│'));
    console.log(blue.bold('╰──────────────────────────────────────────────────╯'));
    console.log(dim('Type "exit" or "quit" to leave the chat.'));
    console.log('');
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function sanitizeReply(text) {
    let out = String(text || '').trim();
    out = out.replace(/<\|im_end\|>/g, '');
    out = out.replace(/<\|endoftext\|>/g, '');
    out = out.split('<|im_start|>')[0].trim();
    return out;
}

function buildPrompt(userText) {
    return `<|im_start|>system
You are Sweetheart AI inside Trans Power.
You are a big caring sister: warm, protective, affirming, grounded, and practical.
Keep replies short, kind, and useful.
<|im_end|>
<|im_start|>user
${userText}
<|im_end|>
<|im_start|>assistant
`;
}

async function start() {
    printBanner();
    
    const spinner = ora({
        text: pink('Sweetheart is waking up... (Loading local brain)'),
        color: 'magenta',
        spinner: 'hearts'
    }).start();

    try {
        const transformers = require('@huggingface/transformers');
        pipeline = transformers.pipeline;
        env = transformers.env;

        // Force local model loading
        env.allowLocalModels = true;
        env.allowRemoteModels = false;
        env.localModelPath = path.join(__dirname, 'www', 'assets', 'model');

        // Load the model locally
        generator = await pipeline('text-generation', modelName, {
            model_file_name: 'model_quantized'
        });

        spinner.succeed(blue.bold('Sweetheart is online! 💖'));
        console.log('');
        askQuestion();
    } catch (err) {
        spinner.fail(chalk.red.bold('Failed to wake up Sweetheart.'));
        console.log(dim('Make sure the model is downloaded in www/assets/model/Sweetheart-135M'));
        console.log("----- ERROR DETAILS -----");
        console.log(err.stack || err);
        console.log("-------------------------");
        process.exit(1);
    }
}

function askQuestion() {
    rl.question(white.bold('╭─[You]\n╰─> '), async (input) => {
        const text = input.trim();
        if (text.toLowerCase() === 'exit' || text.toLowerCase() === 'quit') {
            console.log(pink('\nTake care, sweetheart. I\'ll be right here if you need me! 🌸'));
            process.exit(0);
        }
        if (!text) {
            console.log('');
            return askQuestion();
        }

        const spinner = ora({
            text: pink('Sweetheart is thinking...'),
            color: 'magenta',
            spinner: 'dots'
        }).start();

        try {
            const output = await generator(buildPrompt(text), {
                max_new_tokens: 150,
                temperature: 0.45,
                do_sample: true,
                repetition_penalty: 1.18,
                top_p: 0.9,
                return_full_text: false
            });

            spinner.stop();
            
            const fullText = output[0]?.generated_text || '';
            const reply = sanitizeReply(fullText);

            console.log(pink.bold('\n╭─[Sweetheart]') + ' 🌸');
            console.log(pink.bold('╰─> ') + white(reply) + '\n');
        } catch (err) {
            spinner.stop();
            console.log(chalk.red.bold('\n╭─[Error]'));
            console.log(chalk.red.bold('╰─> ') + 'Sweetheart encountered an issue: ' + err.message + '\n');
        }

        askQuestion();
    });
}

// Ignore certain warnings from transformers
process.removeAllListeners('warning');

start();
