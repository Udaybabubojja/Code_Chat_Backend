const { spawn } = require('child_process');
const fs = require('fs');

function executeJavaCode(code, input) {
    return new Promise((resolve, reject) => {
        // Write the code to a temporary file
        const tempFileName = 'Main.java';
        fs.writeFileSync(tempFileName, code);

        let output = '';
        let error = '';
        const compileProcess = spawn('javac', [tempFileName]);

        compileProcess.stderr.on('data', (data) => {
            error += data.toString();
        });

        compileProcess.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Compilation failed: ${error}`);
                reject(error);
            } else {
                // Execute the compiled Java code
                const executionProcess = spawn('java', [tempFileName.replace('.java', '')]);

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
                    // Clean up the temporary file
                    fs.unlinkSync(tempFileName);

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
    });
}

module.exports = { executeJavaCode };
