const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function Start() {
    const commands = [
        'git clone https://github.com/coqui-ai/TTS',
        'cd TTS && pip install -e .'
    ];

    console.log('> Started');

    for (const cmd of commands) {
        await execPromise(cmd);
    }

    await execPromise('node Server.js');

    console.log('> Successful ready');
}

Start();