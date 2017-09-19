export type License = {
  type: string;
  hasLicenseFile: boolean;
  isPrivate: boolean;
};

export type Package = {
  name: string;
  version: string;
  license: License;
  dependencies: Package[];
};

export type Point<T> = {
  time: number;
  value: T;
};

export type TimeSeries<T> = Point<T>[];

export type PackageMeta = {
  stars: number;
  contributors: number;
  forks: number;

  downloads: TimeSeries<number>;
  releases: TimeSeries<string>;
  issues: TimeSeries<number>;
  commits: TimeSeries<number>;

  dependents: string[];
  ignoring: boolean;
};

export type Meta = {
  [packageName: string]: PackageMeta;
};

export type Error = { error: string };

export type Info = {
  tree: Package;
  meta: Meta;
};

export type Result = Info | Error;
