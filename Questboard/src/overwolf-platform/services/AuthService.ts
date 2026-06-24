import { injectable, inject } from 'tsyringe';
import {
  CommunicationHostServiceBase,
  CommunicationHostToken,
} from '../../types/services/communication-host-service-base';

@injectable()
export class AuthService {
  private readonly port = 10000;
  private isRunning = false;

  public constructor(
    @inject(CommunicationHostToken)
    private readonly communicationBus: CommunicationHostServiceBase,
  ) {}

  public startAuthServer(): void {
    if (this.isRunning) return;
    console.log('overwolf', overwolf);

    const webserver = (overwolf.web as any)?.web;

    if (!webserver) {
      console.error('❌ Overwolf webserver API not available');
      return;
    }

    webserver.startServer(this.port, (res: any) => {
      if (res?.success) {
        this.isRunning = true;
        console.log(`✅ Auth server running on http://127.0.0.1:${this.port}`);
      } else {
        console.error('❌ Auth server failed:', res?.error);
      }
    });

    this.listen();
  }

  // public startAuthServer(): void {
  //   if (this.isRunning) return;

  //   const web = (overwolf as any)?.web;

  //   if (!web?.createServer) {
  //     console.error('❌ Overwolf createServer API not available');
  //     return;
  //   }

  //   const server = web.createServer(this.port, (res: any) => {
  //     if (res?.success) {
  //       this.isRunning = true;
  //       console.log(`✅ Auth server running on http://127.0.0.1:${this.port}`);
  //     } else {
  //       console.error('❌ Server failed:', res?.error);
  //     }
  //   });

  //   server.onRequest.addListener((req: any) => {
  //     try {
  //       const fullUrl = `http://127.0.0.1${req.url}`;
  //       const url = new URL(fullUrl);

  //       if (url.pathname === '/auth/google/callback') {
  //         const accessToken = url.searchParams.get('accessToken');
  //         const refreshToken = url.searchParams.get('refreshToken');

  //         if (!accessToken) {
  //           req.respond({ status: 400, body: 'Missing accessToken' });
  //           return;
  //         }

  //         this.communicationBus.sendMessage('desktop', {
  //           type: 'AUTH_SUCCESS',
  //           payload: { accessToken, refreshToken },
  //         });

  //         req.respond({
  //           status: 200,
  //           body: 'Auth success received. You can close this tab.',
  //         });

  //         return;
  //       }

  //       req.respond({ status: 200, body: 'OK' });
  //     } catch (err) {
  //       console.error('❌ Auth callback error:', err);
  //       req.respond({ status: 500, body: 'Internal server error' });
  //     }
  //   });
  // }

  private listen(): void {
    const webserver = (overwolf.web as any)?.webserver;

    if (!webserver?.onRequest?.addListener) {
      console.error('❌ Webserver onRequest not available');
      return;
    }

    webserver.onRequest.addListener((req: any) => {
      try {
        const fullUrl = `http://127.0.0.1${req.url}`;
        const url = new URL(fullUrl);

        // ✅ FIXED ROUTE (matches your backend redirect)
        if (url.pathname === '/auth/google/callback') {
          const accessToken = url.searchParams.get('accessToken');
          const refreshToken = url.searchParams.get('refreshToken');

          if (!accessToken) {
            console.warn('⚠️ Missing accessToken in callback');

            req.respond({
              status: 400,
              body: 'Missing accessToken',
            });
            return;
          }

          console.log('🔥 AUTH SUCCESS RECEIVED');

          // Send to your Overwolf communication system
          this.communicationBus.sendMessage('desktop', {
            type: 'AUTH_SUCCESS',
            payload: {
              accessToken,
              refreshToken,
            },
          });

          req.respond({
            status: 200,
            body: 'Auth success received. You can close this tab.',
          });

          return;
        }

        // default response
        req.respond({
          status: 200,
          body: 'OK',
        });
      } catch (err) {
        console.error('❌ Auth callback error:', err);

        try {
          req.respond({
            status: 500,
            body: 'Internal server error',
          });
        } catch {}
      }
    });
  }

  public stopAuthServer(): void {
    const webserver = (overwolf.web as any)?.webserver;

    if (webserver?.stopServer) {
      webserver.stopServer(this.port, () => {
        this.isRunning = false;
        console.log('🛑 Auth server stopped');
      });
    }
  }
}
