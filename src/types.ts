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

export type Repository = {
  type: string;
  url: string;
};

export type PackageMeta = {
  repository: Repository;

  numOfGithubStars: number;
  numOfNpmStars: number;
  numOfContributors: number;
  numOfForks: number;
  numOfMaintainers: number;
  numOfDependents: number;

  distTags: Assignment<string>;
  releases: Assignment<number>;

  downloadFrequency: TimeSeries<number>;
  issueFrequency: TimeSeries<number>;
  commitFrequency: TimeSeries<number>;
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
