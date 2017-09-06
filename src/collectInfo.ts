export type Info = {
  name: string;
  version: string;
  license: string;
  dependencies: Info[];
};

export default async (entryPoint: string): Promise<Info> => {
  
};
