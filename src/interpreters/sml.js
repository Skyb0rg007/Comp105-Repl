
import { interpret, getFirstState } from '@sosml/interpreter';
import 'codemirror/mode/mllike/mllike';

export class Sml {
    name = 'sml';
    mode = 'mllike';
    autoCloseBrackets = '()[]{}""';
    extension = '.sml';
    #state;
    #input;
    constructor() {
        this.#state = getFirstState();
        this.#input = '';
        window.sml = this;
    }
    async setFilemap(filemap) {
        return null;
    }
    async eval(str) {
        this.#input += str;
        try {
            const ret = interpret(this.#input, this.#state);
            this.#state = ret.state;
            this.#input = '';
            if (ret.evaluationErrored) {
                return `! Uncaught exception:\n! ${ret.error.toString()}`;
            } else {
                const printed = this.#state.warns.map(w => w.name === 'Warning' ? w.message : '')
                const p = printed.join(' ');
                if (p !== '')
                    return p + '\n' + this.#state.toString();
                else
                    return this.#state.toString();
            }
        } catch (e) {
            if (e.name === 'Input Incomplete') {
                return '';
            }
            this.#input = '';
            return e.toString();
        }
    }
    async reset() {
        this.#state = getFirstState();
        this.#input = '';
        return null;
    }
};

