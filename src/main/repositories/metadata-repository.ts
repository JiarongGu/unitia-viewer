
import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as lowdb from 'lowdb';
import * as _ from 'lodash';

import { PathService } from '../services';
import { MetadataCollection, MetadataModel } from '@main/models';

export class MetadataRepository {
  private readonly _pathService = new PathService();
  private readonly _modelAdapter = new FileAsync<MetadataCollection>(this._pathService.getResourcePath('data/metadata.json'));

  public async getCollection(): Promise<MetadataCollection> {
    return (await this.metadataLowdb).value();
  }

  public async getMetadata(filePath: string): Promise<MetadataModel | undefined> {
    const lowdb = await this.metadataLowdb;
    const searchPath = this.formatFilePath(filePath);
    const modelDirectory = lowdb.get(searchPath.directory).value() as MetadataCollection;
    const model = modelDirectory && modelDirectory[searchPath.filename] as Array<MetadataModel>;

    if (Array.isArray(model)) {
      return model[0];
    }
  }

  public async saveMetadata(filePath: string, model: MetadataModel) {
    const lowdb = await this.metadataLowdb;
    const searchPath = this.formatFilePath(filePath);
    await lowdb.update(searchPath.directory, (value) => ({ ...value, [searchPath.filename]: [model] })).write()
  }

  private get metadataLowdb() {
    return lowdb(this._modelAdapter);
  }

  private formatFilePath(filePath: string) {
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