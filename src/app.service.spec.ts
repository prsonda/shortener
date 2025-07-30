import * as fs from 'fs';
import { AppService } from './app.service';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  readFileSync: jest.fn(),
}));

describe('AppService - getVersion', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns version from package.json', () => {
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify({ version: '0.1.0' }),
    );

    const service = new AppService();
    const result = service.getVersion();

    expect(result.version).toBe('0.1.0');
    expect(fs.readFileSync).toHaveBeenCalled();
  });

  it('returns "unknown" if reading package.json fails', () => {
    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('file not found');
    });

    const service = new AppService();
    const result = service.getVersion();

    expect(result.version).toBe('unknown');
    expect(fs.readFileSync).toHaveBeenCalled();
  });
});
