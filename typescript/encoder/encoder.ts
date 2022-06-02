import EncoderArgs from './encoder-args';
/// message Encoder
interface Encoder {
  encode(args: EncoderArgs): string;
}

export default Encoder;
