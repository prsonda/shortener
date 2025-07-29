import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { DocsMessages } from './shared/constants/messages';

@Controller()
@ApiTags(DocsMessages.version.tag)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/version')
  @ApiOperation({
    summary: DocsMessages.version.summary,
    description: DocsMessages.version.description,
  })
  @ApiResponse({
    status: 200,
    description: DocsMessages.version.success,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            version: { type: 'string', example: '0.1.0' },
          },
        },
      },
    },
  })
  getVersion(): { version: string } {
    return this.appService.getVersion();
  }
}
