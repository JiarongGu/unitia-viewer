import { protocol } from 'electron';
import * as fs from 'fs';
import { PassThrough } from 'stream';

import { PathService } from './services';
import { MetadataResourceType } from './models';

function createStream (text) {
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
    const callbackReader = createStream(fs.readFileSync(filePath));
    callback({
      statusCode: 200,
      data: callbackReader,
      headers: { 'Content-Type': 'binary/octet-stream' }
    });
    callbackReader.resume();
  }, (error) => {
    if (error) console.error('Failed to register stream protocol')
  })
}