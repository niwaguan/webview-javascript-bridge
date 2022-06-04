export default interface EncoderArgs {
    readonly channel?: string;
    readonly action: string;
    readonly params?: any;
    readonly callbackId?: string;
}
