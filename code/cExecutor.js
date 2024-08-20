const { spawn } = require('child_process');
const fs = require('fs');

function executeCCode(code, input) {
    // Write the code to a temporary file
    const tempFileName = 'tempCode.c';
    fs.writeFileSync(tempFileName, code);

    let output = '';
    let error = '';

    // Compile the C code
    const compileProcess = spawn('gcc', [tempFileName, '-o', 'tempCode']);

    compileProcess.stderr.on('data', (data) => {
        error += data.toString();
    });

    compileProcess.on('exit', (code) => {
        if (code !== 0) {
            console.error(`Compilation failed: ${error}`);
            reject(error);
        } else {
            // Execute the compiled C code
            const executionProcess = spawn('./tempCode');

            // Handle the input if provided
            if (input) {
                executionProcess.stdin.write(input);
                executionProcess.stdin.end();
            }

            executionProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            executionProcess.stderr.on('data', (data) => {
                error += data.toString();
            });

            executionProcess.on('exit', (code) => {
                // Clean up the temporary file and executable
                fs.unlinkSync(tempFileName);
                fs.unlinkSync('tempCode');

                if (error) {
                    console.error(`Error: ${error}`);
                    reject(error);
                } else {
                    console.log(`Execution result: ${output}`);
                    resolve(output);
                }
            });
        }
    });
}

module.exports = { executeCCode };
