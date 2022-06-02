import Encoder from './encoder';
import EncoderArgs from './encoder-args';
/// encode message to JSON format
export default class JSONEncoder implements Encoder {
  encode(args: EncoderArgs): string {
    const message = {
      channel: args.channel,
      action: args.action,
      params: args.params,
      callbackId: args.callbackId,
    };
    return JSON.stringify(message);
  }
}
