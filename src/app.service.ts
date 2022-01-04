import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    // .envファイルを読み込むサンプル
    // MSG=hoge ならば、hogeがreturnされる
    return process.env.MSG;
  }
}
