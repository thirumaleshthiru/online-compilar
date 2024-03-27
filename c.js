document.addEventListener('DOMContentLoaded', function () {
    require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.29.0/min/vs' }});
    require(['vs/editor/editor.main'], function () {
        editor = monaco.editor.create(document.getElementById('editor'), {
            value: '#include <stdio.h>\n\nint main() {\n printf("Online Compiler - Write, Run, and Save Code");\n return 0;\n}',
            language: 'c',
            theme: 'vs',
            fontSize: 18,
            minimap: { enabled: false }
        });

        window.changeTheme = function () {
            var selectedTheme = document.getElementById('theme-selector').value;
            monaco.editor.setTheme(selectedTheme);
        };
    });
});

window.compileAndRun = function () {
    var outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '<img src="infinite-spinner.svg" alt="Loading...">';

    var code = editor.getValue();
    var inputs = {};

 // Regular expression to match scanf statements
var scanfRegex = /scanf\s*\(\s*["']([^"']+)["']\s*,\s*&?([^)]+)\)/g;

var match;
while (match = scanfRegex.exec(code)) {
    var format = match[1];
    var variable = match[2];
    // Skip if the variable has been already asked for input
    if (!inputs.hasOwnProperty(variable)) {
        var input = window.prompt("Enter value for " + variable + ":");
        if (input !== null) {
            inputs[variable] = input;
            code = code.replace(match[0], 'scanf("' + format + '", &' + variable + '); ' + variable + ' = ' + input + ';');
        } else {
            // Cancelled, don't proceed with further replacements
            break;
        }
    }
}
    // Convert inputs to JSON string
    var inputsJson = JSON.stringify(inputs);

    fetch('https://c-compiler-mxw6.onrender.com/compile-run-c', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: code, input: inputsJson })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            outputDiv.innerText = data.output;
        } else {
            outputDiv.innerText = 'Error: ' + data.error;
        }
    })
    .catch(error => {
        outputDiv.innerText = 'Error: ' + error.message;
    });
};

window.saveCode = function () {
    var code = editor.getValue();

    var blob = new Blob([code], { type: 'text/plain' });
    var filename = 'c_code.c';
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
};
