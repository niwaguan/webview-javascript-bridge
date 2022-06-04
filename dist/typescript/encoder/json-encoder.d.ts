import Encoder from './encoder';
import EncoderArgs from './encoder-args';
export default class JSONEncoder implements Encoder {
    encode(args: EncoderArgs): string;
}
