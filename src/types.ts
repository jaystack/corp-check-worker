export type Registry<T> = {
  [key: string]: T;
};

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

export type Node = {
  name: string;
  version: string;
  license: License;
  dependencies: Node[];
};

export type Point<T> = {
  time: number;
  value: T;
};

export type TimeSeries<T> = Point<T>[];

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
  codeFrequency: TimeSeries<[number, number]>;
  issues: Stats;
  pullRequests: Stats;
};

export type DistTag = {
  version: string;
  tag: string;
};

export type NpmData = {
  distTags: DistTag[];
  releases: TimeSeries<string>;
  maintainersCount: number;
  repository: Repository;
};

/* export type PackageMeta = GithubData &
  NpmData & {
    dependendtsCount: number;
    downloadFrequency: TimeSeries<number>;
  }; */

export type NpmScores = {
  quality: number;
  popularity: number;
  maintenance: number;
};

export type PackageMeta = {
  npmScores: NpmScores;
};

export type Meta = {
  [packageName: string]: PackageMeta;
};

export type Info = {
  tree: Node;
  meta: Meta;
};

export type Result = { data: Info } | { error: string };
