import { IBeforeRequest, InterceptorContext } from '@main/models';

export class WebSocketInterceptor implements IBeforeRequest {
  public filters = ['wss://ws2.game-unitia.net:3001/*'];

  public async beforeRequest(
    details: Electron.OnBeforeRequestListenerDetails,
    context: InterceptorContext<Electron.Response>
  ): Promise<void | Electron.Response> {
    console.log('websocket interception', details.url);
  }
}