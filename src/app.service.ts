import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class AppService {
  private readonly version: string;

  constructor() {
    const packageJsonPath = join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    this.version = packageJson.version;
  }

  getVersion(): { version: string } {
    return { version: this.version };
  }
}
