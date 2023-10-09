import { Reflector } from '@nestjs/core';

export const OAuthScope = Reflector.createDecorator<string[]>();
