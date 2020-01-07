
import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as lowdb from 'lowdb';
import * as _ from 'lodash';

import { PathService } from '../services';
import { MetadataCollection, MetadataModel } from '@main/models';

export class MetadataRepository {
  private static readonly _modelAdapter = new FileAsync<MetadataCollection>(new PathService().getResourcePath('data/asset.json'));

  public async getCollection(): Promise<MetadataCollection> {
    return (await this.metadataLowdb).value();
  }

  public async getMetadata(filePath: string): Promise<MetadataModel | undefined> {
    const searchPath = this.formatFilePath(filePath);
    const modelDirectory = (await this.metadataLowdb).get(searchPath.directory).value() as MetadataCollection;
    const model = modelDirectory && modelDirectory[searchPath.filename] as Array<MetadataModel>;

    if (model && Array.isArray(model)) {
      return model[0];
    }
  }

  public async saveMetadata(filePath: string, model: MetadataModel) {
    const searchPath = this.formatFilePath(filePath);
    await (await this.metadataLowdb).update(
      searchPath.directory, (value) => ({
        ...value, [searchPath.filename]: [model]
      })
    ).write()
  }

  private get metadataLowdb() {
    return lowdb(MetadataRepository._modelAdapter);
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