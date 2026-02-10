export interface AppBindings {
  [key: string]: any;
}

export interface AppVariables {
  NODE_ENV: 'production' | 'development';
  PORT: number;
  REQUEST_ID: string;
}

export interface AppEnvirontmentVariables {
  Bindings: AppBindings;
  Variables: AppVariables;
}
