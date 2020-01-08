
import * as FileSync from 'lowdb/adapters/FileSync';
import * as lowdb from 'lowdb';
import * as _ from 'lodash';

import { PathService } from '../services';
import { MetadataCollection, MetadataModel } from '@main/models';

export class OsApiFrameRepository {
  private readonly _pathService = new PathService();
  private readonly _modelAdapter = new FileSync<MetadataCollection>(
    this._pathService.getResourcePath('data/frame.json')
  );

  public async getCollection(): Promise<MetadataCollection> {
    return (await this.metadataLowdb).value();
  }

  public getMetadata(filePath: string): MetadataModel | undefined {
    const searchPath = this.formatFilePath(filePath);
    const modelDirectory = this.metadataLowdb.get(searchPath.directory).value() as MetadataCollection;
    const model = modelDirectory && modelDirectory[searchPath.filename] as Array<MetadataModel>;

    if (model && Array.isArray(model)) {
      return model[0];
    }
  }

  public saveMetadata(filePath: string, model: MetadataModel) {
    const searchPath = this.formatFilePath(filePath);
    this.metadataLowdb.update(
      searchPath.directory, (value) => ({
        ...value, [searchPath.filename]: [model]
      })
    ).write()
  }

  private get metadataLowdb() {
    return lowdb(this._modelAdapter);
  }

  public formatFilePath(filePath: string) {
    const searchPath = filePath.split(/(\/\/*)|(\\)/).filter(path =>
      path && path.indexOf('\/') < 0 && path.indexOf('\\') < 0
    );
    const lastIndex = searchPath.length - 1;
    const directories = searchPath.slice(0, lastIndex);
    return {
      directory: directories.join('.'),
      filename: searchPath[lastIndex]
    };
  }
}