import EncoderArgs from './encoder-args';
interface Encoder {
    encode(args: EncoderArgs): string;
}
export default Encoder;
