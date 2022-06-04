import Encoder from './encoder';
import EncoderArgs from './encoder-args';
export default class JSONUriEncoder implements Encoder {
    private scheme;
    private host;
    constructor(scheme?: string, host?: string);
    encode(args: EncoderArgs): string;
}
