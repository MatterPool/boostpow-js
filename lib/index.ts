import { BoostPowStringModel } from './boost-pow-string-model';

const defaultOptions: any = {
  api_url: 'https://api.matterpool.io',
  network: 'bsv',          // 'bsv'
  version_path: 'api/v1',  // Do not change
}

export class BoostClient {
  options;
  constructor(providedOptions?: any) {
    this.options = Object.assign({}, defaultOptions, providedOptions);
  }

  get BoostPowString() {
    return BoostPowStringModel;
  }

  setOptions(newOptions) {
    this.options = Object.assign({}, this.options, newOptions);
  }

  static instance(newOptions?: any): BoostClient {
    const mergedOptions = Object.assign({}, defaultOptions, newOptions);
    return new BoostClient(mergedOptions);
  }
}

export function instance(newOptions?: any): BoostClient {
  const mergedOptions = Object.assign({}, defaultOptions, newOptions);
  return new BoostClient(mergedOptions);
}

try {
  if (window) {
    window['Boost'] = {
      Service: new BoostClient(),
      BoostPowString: BoostPowStringModel
    };
  }
}
catch (ex) {
  // Window is not defined, must be running in windowless env....
}

export var BoostPowString = BoostPowStringModel;

