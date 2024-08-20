const express = require('express');
const { executePythonCode } = require('../code/pythonExecutor');
const { executeJavaCode } = require('../code/javaExecutor');
const { executeCCode } = require('../code/cExecutor');

const router = express.Router();

router.post('/:language', async (req, res) => {
    const { code, input } = req.body;
    const { language } = req.params;

    if (!code) {
        return res.status(400).json({ error: 'No code provided' });
    }

    console.log('Received code:', code);
    console.log('Received input:', input);
    console.log('Language:', language);

    try {
        let output;
        switch (language) {
            case 'python':
                output = await executePythonCode(code, input);
                break;
            case 'java':
                output = await executeJavaCode(code, input);
                break;
            case 'c':
                output = await executeCCode(code, input);
                break;
            default:
                return res.status(400).json({ error: 'Unsupported language' });
        }
        console.log(output)
        res.json({ result: output });
    } catch (error) {
        res.status(500).json({ error });
    }
});

module.exports = router;
