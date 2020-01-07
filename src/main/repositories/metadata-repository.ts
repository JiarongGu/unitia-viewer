
import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as lowdb from 'lowdb';
import * as path from 'path';
import * as _ from 'lodash';

import { PathService } from '../services';
import { MetadataCollection, MetadataModel } from '@main/models';

export class MetadataRepository {
  private readonly _pathService = new PathService();
  private readonly _modelAdapter = new FileAsync<MetadataCollection>(this._pathService.getResourcePath('data/metadata.json'));

  public async getCollection(): Promise<MetadataCollection> {
    return (await this.iconLowdb).value();
  }

  public async getMetadata(filePath: string): Promise<MetadataModel | undefined> {
    const lowdb = await this.iconLowdb;
    const searchPath = this.formatFilePath(filePath);
    const model = lowdb.get(searchPath).value() as Array<MetadataModel>;

    if (Array.isArray(model)) {
      return model[0];
    }
  }

  public async saveMetadata(filePath: string, model: MetadataModel) {
    const lowdb = await this.iconLowdb;
    const searchPath = this.formatFilePath(filePath);
    await lowdb.set(searchPath, [model]).write()
  }

  private get iconLowdb() {
    return lowdb(this._modelAdapter);
  }

  private formatFilePath(filePath: string) {
    const searchPath = filePath.split(path.delimiter);
    return searchPath.join('.');
  }
}