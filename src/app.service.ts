import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ErrorMessages } from './shared/constants/messages';

@Injectable()
export class AppService {
  getVersion(): { version: string } {
    try {
      const packageJsonPath = join(__dirname, '..', 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      return { version: packageJson.version };
    } catch {
      return { version: ErrorMessages.unknown };
    }
  }
}
