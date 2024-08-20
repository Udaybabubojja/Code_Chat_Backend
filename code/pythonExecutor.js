const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function executePythonCode(code, input) {
    return new Promise((resolve, reject) => {
        const tempFileName = path.join(__dirname, 'tempCode.py');
        
        // Write the code to a temporary file
        fs.writeFile(tempFileName, code, (err) => {
            if (err) {
                return reject(`Failed to write temporary file: ${err}`);
            }

            let output = '';
            let error = '';

            // Spawn the Python process
            const pythonProcess = spawn('python3', [tempFileName]);

            // Handle the input if provided
            if (input) {
                pythonProcess.stdin.write(input);
                pythonProcess.stdin.end();
            }

            // Capture the output from stdout
            pythonProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            // Capture any errors from stderr
            pythonProcess.stderr.on('data', (data) => {
                error += data.toString();
            });

            // Set a timeout to avoid infinite loops
            const timeout = setTimeout(() => {
                pythonProcess.kill();
                return reject('Execution timed out');
            }, 5000); // 5 seconds timeout

            // Handle process exit
            pythonProcess.on('exit', (code) => {
                clearTimeout(timeout);

                // Clean up the temporary file
                fs.unlink(tempFileName, (err) => {
                    if (err) {
                        console.error(`Failed to delete temporary file: ${err}`);
                    }
                });

                if (error) {
                    return reject(`Error: ${error}`);
                } else if (code !== 0) {
                    return reject(`Process exited with code: ${code}`);
                } else {
                    return resolve(output);
                }
            });

            pythonProcess.on('error', (err) => {
                clearTimeout(timeout);
                return reject(`Failed to start process: ${err}`);
            });
        });
    });
}

module.exports = { executePythonCode };
