import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { generateUuid } from './lib/uuid';
import { HttpService } from '@nestjs/axios';

interface AccessTokenResponse {
  data: {
    user_id: string;
    access_token: string;
    refresh_token: string;
  };
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private http: HttpService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('oauth')
  @Redirect('https://www.figma.com/oauth', 302)
  startOAuthFlow() {
    const url = new URL('https://www.figma.com/oauth');
    url.searchParams.append('client_id', process.env.FIGMA_CLIENT_ID);
    url.searchParams.append('redirect_uri', process.env.REDIRECT_URI);
    url.searchParams.append('scope', 'file_read');
    url.searchParams.append('state', generateUuid());
    url.searchParams.append('response_type', 'code');
    return { url };
  }

  @Get('callback')
  async getAuthorizationCodeAndRequestAccessToken(
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    console.log(code, state);
    return this.http
      .post(
        'https://www.figma.com/api/oauth/token',
        {},
        {
          params: {
            client_id: process.env.FIGMA_CLIENT_ID,
            client_secret: process.env.FIGMA_CLIENT_SECRET,
            redirect_uri: process.env.REDIRECT_URI,
            code,
            grant_type: 'authorization_code',
          },
        },
      )
      .subscribe((res: AccessTokenResponse) => {
        console.log(res.data);
      });
  }
}
