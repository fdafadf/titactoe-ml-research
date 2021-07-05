import { TicTacToe } from './modules/tictactoe/TicTacToe.js';
import { MinMax } from './modules/tictactoe/MinMax.js';
import { Board } from './modules/tictactoe/Board.js';
import { Tensor } from './modules/ml/Tensor.js';
import { Network } from './modules/ml/Network.js';

const WORKER_IMPORTS = `
import { TicTacToe } from '{base}modules/tictactoe/TicTacToe.js';
import { MinMax } from '{base}modules/tictactoe/MinMax.js';
import { Board } from '{base}modules/tictactoe/Board.js';
import { Tensor } from '{base}modules/ml/Tensor.js';
import { Network } from '{base}modules/ml/Network.js';
`

function onLoad()
{
    function writeOutputResult(result)
    {
        switch (result)
        {
            case 0: writeOutputLine('Draw is the best result for both.'); break;
            case 1: writeOutputLine('Winning position for O.'); break;
            case 2: writeOutputLine('Winning position for X.'); break;
        }
    }

    function runWorker(e)
    {
        e.target.disabled = true;
        let section_element = e.target.closest('section');
        let output_element = section_element.querySelector('.output');
        let code_element = section_element.querySelector('pre');
        let imports = WORKER_IMPORTS.replaceAll('{base}', document.location.href.replace(/[^/]*$/, ''));
        let code = `${imports}\r\nonmessage = function(e) { ${code_element.innerText} }`;
        let blob = new Blob([ code ], { type: 'application/javascript' });
        let worker = new Worker(window.URL.createObjectURL(blob), { type: 'module' });
        worker.onmessage = function (event) 
        {
            output_element.innerText += JSON.stringify(event.data) + "\r\n";
            output_element.scrollIntoView();
        };
        worker.postMessage('');
    }

    function run(e)
    {
        e.target.disabled = true;
        let section_element = e.target.closest('section');
        let output_element = section_element.querySelector('.output');

        function document_writeln( value )
        {
            output_element.innerText += value + "\r\n";
            output_element.scrollIntoView();
        }
    
        function document_body_appendChild( node )
        {
            output_element.appendChild( node );
        }

        let code_element = section_element.querySelector('pre');
        let code = code_element.innerText;
        code = code.replaceAll( 'document.writeln', 'document_writeln' );
        code = code.replaceAll( 'document.body.appendChild', 'document_body_appendChild' );
        eval(`(async () => { \r\n${code} \r\n})()`);
    }

    function renderCode(code_element, onlick_function)
    {
        let section_element = code_element.closest('section');
        let button_element = document.createElement('button');
        let output_element = document.createElement('pre');
        button_element.innerText = 'Run';
        button_element.onclick = onlick_function;
        output_element.classList.add('output');
        section_element.appendChild(button_element);
        section_element.appendChild(output_element);
        let code = code_element.innerText;

        function renderLine( line )
        {
            line = line.replace(/function\s+([^(]+)\(/i, '<span class="js-keyword">function</span> <span class="js-function">$1</span>(');
            line = line.replace(/function\(/i, '<span class="js-keyword">function</span>(');
            line = line.replace(/^(\s*)([^\.]+)\.([^(\.]+)\(/i, '$1$2.<span class="js-function">$3</span>(');
            line = line.replaceAll(/([^\.\s>]+)\(/ig, '<span class="js-function">$1</span>(');
            line = line.replaceAll(/(let|while|switch|case|return|break|if|import|new|const|from|new) /ig, '<span class="js-keyword">$1 </span>');
            line = line.replace(/(break|null);/i, '<span class="js-keyword">$1</span>;');
            line = line.replace(/^(\s*)for/i, '$1<span class="js-keyword">for</span>');
            line = line.replace(/\((\s*[`'])([^']*)([`']\s)*\)/i, '(<span class="js-literal">$1$2$3</span>)');
            return line;
        }

        code_element.innerHTML = code.split("\n").map(renderLine).join(`\r\n`);
    }

    document.querySelectorAll('.code').forEach(async code_element => 
    {
        if (code_element.classList.contains( 'worker' ))
        {
            renderCode(code_element, runWorker);
        }
        else
        {
            renderCode(code_element, run);
        }
    });

}

window.addEventListener('load', onLoad);