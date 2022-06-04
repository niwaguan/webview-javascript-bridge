import Encoder from './encoder';
import EncoderArgs from './encoder-args';
/// encode message to JSON-Uri format. scheme://host?args=json
export default class JSONUriEncoder implements Encoder {
  private scheme: string;
  private host: string;
  constructor(scheme = "webviewjsbridge", host = "stormyang.cn") {
    this.scheme = scheme;
    this.host = host;
  }

  encode(args: EncoderArgs): string {
    const message = {
      channel: args.channel,
      action: args.action,
      params: args.params,
      callbackId: args.callbackId,
    };
    return `${this.scheme}://${this.host}?args=${encodeURIComponent(JSON.stringify(message))}`;
  }
}
