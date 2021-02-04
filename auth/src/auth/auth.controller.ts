import { Controller, Get } from '@nestjs/common';

@Controller('api/users')
export class AuthController {
  @Get('currentUsers')
  getUser(): string {
    return 'Congrats basic setup complete.';
  }
}
