import Encoder from './encoder';
import EncoderArgs from './encoder-args';
export default class UriEncoder implements Encoder {
    private scheme;
    constructor(scheme?: string);
    encode(args: EncoderArgs): string;
}
