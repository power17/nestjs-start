import { Inject, OnApplicationShutdown } from '@nestjs/common';
import { DataSource } from 'typeorm';

export class AppService implements OnApplicationShutdown {
  constructor(
    @Inject('TYPEORM_CONNECTIONS') private connections: Map<string, DataSource>,
  ) {}
  async onApplicationShutdown() {
    if (this.connections.size > 0) {
      for (const key of this.connections.keys()) {
        await this.connections.get(key).destroy();
      }
    }
  }
}
