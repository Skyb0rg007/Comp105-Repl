
import { interpret, getFirstState } from '@sosml/interpreter';
import 'codemirror/mode/mllike/mllike';

export class Sml {
    name = 'sml';
    mode = 'mllike';
    autoCloseBrackets = '()[]{}""';
    extension = '.sml';
    #state;
    // #input;
    constructor() {
        this.#state = getFirstState();
        // this.#input = '';
        window.sml = this;
    }
    async setFilemap(filemap) {
        return null;
    }
    async eval(str) {
        // this.#input += str;
        try {
            str = str.trim();
            if (str[str.length - 1] !== ';')
                str = str + ';';
            const ret = interpret(str, this.#state);
            window.ret = ret;
            const oldid = this.#state.id + 1;
            this.#state = ret.state;
            if (ret.evaluationErrored) {
                return `! Uncaught exception:\n! ${ret.error.toString()}`;
            } else {
                const printed = this.#state.warns.map(w => w.name === 'Warning' ? w.message : '')
                let p = printed.join(' ');
                if (p !== '')
                    p = '\n' + p;
                return this.#state.toString({ stopId: oldid }) + p;
            }
        } catch (e) {
            if (e.name === 'Input Incomplete') {
                return '';
            }
            return e.toString();
        }
    }
    async reset() {
        this.#state = getFirstState();
        return null;
    }
};

