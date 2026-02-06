export interface AppBindings {
  [key: string]: unknown;
}

export interface AppVariables {
  NODE_ENV: 'production' | 'development';
  PORT: number;
}

export interface AppEnvirontmentVariables {
  Bindings: AppBindings;
  Variables: AppVariables;
}
