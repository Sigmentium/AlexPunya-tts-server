const http = require('http');

const port = process.env.PORT || 1000;

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            const { text } = JSON.parse(body);

            text.trim();

            if (text.length > 50) {
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end();
            }
            else {
                const resultPath = path.join(`${__dirname}\TTS`, 'result.wav');

                if (fs.existsSync(resultPath)) {
                    fs.unlinkSync(resultPath);
                }

                const command = `cd TTS && tts --model_name tts_models/multilingual/multi-dataset/xtts_v2 --text "${text}" --speaker_wav ../Main.wav --language_idx ru --out_path result.wav`;

                exec(command, { cwd: __dirname }, async (error, stdout, stderr) => {
                    res.writeHead(200);
                    res.end(resultPath);

                    fs.unlinkSync(resultPath);
                });
            }
            return;
        });
        return;
    }
});

server.listen(port, '0.0.0.0', () => {
    console.log('> Successful start');
});