import { protocol } from 'electron';
import * as fs from 'fs';
import { PassThrough } from 'stream';

import { PathService } from './services';
import { MetadataResourceType } from './models';

function createStream(text) {
  const rv = new PassThrough() // PassThrough is also a Readable stream
  rv.pause();
  rv.push(text)
  rv.push(null);
  return rv;
}

export function createProtocol() {
  const pathService = new PathService();

  const getResourcePath = (url: string, type: MetadataResourceType) => {
    const filePath = url.substring(type.length + 3);
    return pathService.getResourcePath(filePath);
  }

  protocol.registerFileProtocol(MetadataResourceType.File, (request, callback) => {
    const filePath = getResourcePath(request.url, MetadataResourceType.File).replace(/\?.*$/, '');
    callback({ path: filePath });
  }, (error) => {
    if (error) console.error('Failed to register file protocol')
  })

  protocol.registerStreamProtocol(MetadataResourceType.Stream, (request, callback) => {
    const filePath = getResourcePath(request.url, MetadataResourceType.Stream).replace(/\?.*$/, '');
    fs.readFile(filePath, ((_, file) => {
      const callbackReader = createStream(file);
      callback({
        statusCode: 200,
        data: callbackReader,
        headers: { 
          'Content-Type': 'binary/octet-stream', 
          'Content-Length': '2540410',
          'Date': 'Tue, 07 Jan 2020 20:27:08 GMT',
          'Cache-Control': 'max-age=0,s-maxage=2592000',
          'Age': '4018',
          'ETag': '\"2ee7464283b55f235828435c1176c6ec\"',
          'Last-Modified': 'Fri, 27 Dec 2019 03:02:59 GMT',
          'X-Amz-Cf-Id': '69-C6nfEPztDxKNYUOkQxy5EeIeB1cERMfjdZlM1H0yGL3GQCDHTNg==',
          'X-Amz-Cf-Pop':'DFW50-C1',
          'X-Cache': 'Hit from cloudfront'
        }
      });
      callbackReader.resume();
    }))
  }, (error) => {
    if (error) console.error('Failed to register stream protocol')
  })
}