import { singleton } from 'tsyringe';
import { z } from 'zod';

const ConfigSchema = z.object({
  NODE_ENV: z.enum(['production', 'development']),
  PORT: z.coerce.number(),
});

type AppConfig = z.infer<typeof ConfigSchema>;

@singleton()
export class Config {
  private readonly config: AppConfig;

  constructor() {
    const result = ConfigSchema.safeParse(Bun.env);

    if (!result.success) {
      throw new Error(
        `Failed getting environment variables: \n${result.error.message}`,
      );
    }

    this.config = result.data;
  }

  getConfig<K extends keyof AppConfig>(name: K): AppConfig[K] {
    return this.config[name];
  }
}
