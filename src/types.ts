export type PackageSignature = {
  signature?: string;
  fullName?: string;
  rawScope?: string;
  scope?: string;
  name?: string;
  rawVersion?: string;
  version?: string;
};

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

export type Assignment<T> = {
  [key: string]: T;
};

export type Distribution = {
  [interval: string]: number;
};

export type Stats = {
  count: number;
  openCount: number;
  distribution: Distribution;
};

export type Repository = {
  type: string;
  url: string;
};

export type GithubData = {
  starsCount: number;
  forksCount: number;
  subscribersCount: number;
  commitFrequency: TimeSeries<number>;
  codeFrequency: TimeSeries<number>;
  issues: Stats;
  pullRequests: Stats;
};

export type NpmData = {
  distTags: Assignment<string>;
  releases: TimeSeries<string>;
  maintainersCount: number;
  repository: Repository;
};

export type PackageMeta = GithubData &
  NpmData & {
    dependendtsCount: number;
    downloadFrequency: TimeSeries<number>;
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
