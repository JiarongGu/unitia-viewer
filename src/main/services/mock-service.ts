export class MockService {
  public async getMock(url: string): Promise<string | Buffer | Uint8Array | void> {
    console.log('mocking:: ', url);

    if (url === 'api.smbeat.jp/api/errors') {
      return JSON.stringify({ status: 'OK' })
    }

    if (url === 'osapi.dmm.com/gadgets/makeRequest' || url === 'frame/gadgets/makeRequest') {
      // tslint:disable-next-line: prefer-template
      return 'throw 1; < don\'t be evil\'>' + JSON.stringify({
        'https://r.game-unitia.net/v1/tab_contents/event': {
          'rc': 200,
          'body': '[\'https:\\/\\/front-r.game-unitia.net\\/kabu\\/event\\/cac7775a6f586553\\/GachaImage_Gch1086.png\',\'https:\\/\\/front-r.game-unitia.net\\/kabu\\/event\\/0c5b88e89ddcbf4e\\/GachaImage_Gch0192.png\',\'https:\\/\\/front-r.game-unitia.net\\/kabu\\/event\\/9fe94bf44fa86e74\\/GachaImage_Gch0190.png\',\'https:\\/\\/front-r.game-unitia.net\\/kabu\\/event\\/f4c5b820250e4e44\\/GachaImage_Gch0194.png\',\'https:\\/\\/front-r.game-unitia.net\\/kabu\\/event\\/1a914ef95df75992\\/GachaImage_Gch0195.png\']',
          'headers': {
            'Content-Type': 'text/html; charset=UTF-8',
            'Connection': 'keep-alive',
            'Server': 'nginx',
            'X-Fencer-UUID': 'ea405d85b95615855a29e171c433809e0782b81a',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS'
          }
        }
      }
      )
    }

    if (url === 'frame/social/rpc') {
      return JSON.stringify([{ 'id': 'viewer', 'data': { 'isOwner': true, 'isViewer': true, 'userType': '', 'id': '32779403', 'thumbnailUrl': 'http:\/\/pics.dmm.com\/freegame\/profile\/m\/male1\/male1_mb.gif', 'displayName': '\u30b7\u30eb\u30ad\u30fc' } }]);
    }
  }
}