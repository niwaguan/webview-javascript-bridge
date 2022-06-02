import Encoder from './encoder';
import EncoderArgs from './encoder-args';
/// encode message to uri format: scheme://channel/action?args=json
export default class UriEncoder implements Encoder {
  /// the scheme in message
  private scheme: string;
  constructor(scheme = 'webviewjsbridge') {
    this.scheme = scheme;
  }

  /**
   * encode
   */
  public encode(args: EncoderArgs) {
    let message = `${this.scheme}://${args.channel}/${args.action}`;
    const query: { key: string; value: string }[] = [];
    if (args.params) {
      const argsJSON = encodeURIComponent(JSON.stringify(args.params));
      query.push({ key: 'args', value: argsJSON });
    }
    if (args.callbackId) {
      query.push({ key: 'callbackId', value: args.callbackId });
    }
    if (query.length > 0) {
      message += '?';
      message += query.map((pair) => `${pair.key}=${pair.value}`).join('&');
    }
    return message;
  }
}
