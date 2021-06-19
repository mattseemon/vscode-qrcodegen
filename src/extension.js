const vscode = require('vscode');
const Q = require('q');
const qrCode = require('qrcode');


/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
    console.log('Activated extension "QR Code Generator"!');

    let disposable = vscode.commands.registerCommand('qrcodegen.generate', function () {
        getText()
            .then(text => {
                if (!text) { return }

                qrCode.toString(text, { type: 'svg' }, function (err, string) {
                    if (!err) {
                        let panel = vscode.window.createWebviewPanel('qrcodegen', "Generated QR Code", vscode.ViewColumn.One, {});
                        panel.webview.html = generateHtml(string);
                    } else {
                        vscode.window.showErrorMessage(err.message);
                    }
                });
            });
    });

    context.subscriptions.push(disposable);
}

function getText() {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
        let selection = editor.selection;
        if (selection.start.line !== selection.end.line || selection.start.character !== selection.end.character) {
            return Q(editor.document.getText(selection));
        }
    }
    return vscode.window.showInputBox("Enter text to generate QR Code");;
}

function generateHtml(string) {
    return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>QR Code</title>
        </head>
        <body>
        <div style="display: flex; min-height: 240px; height: 100vh; width: 100%;">
            <div style="display: flex; flex: 1; flex-direction: column; justify-content: center;">
                ${string}
            </div>
        </div>
        </body>
        </html>`;
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
}