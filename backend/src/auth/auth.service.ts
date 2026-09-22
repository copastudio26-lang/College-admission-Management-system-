import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  private users = new Map<string, any>();

  register(email: string, fullName: string, password: string) {
    const id = `usr_${Date.now()}`;
    const user = {
      id,
      email,
      fullName,
      password,
      roles: ['APPLICANT'],
      createdAt: new Date().toISOString(),
    };

    this.users.set(email, user);

    return {
      userId: id,
      email,
      fullName,
      requiresVerification: true,
    };
  }

  login(email: string, password: string) {
    const user = this.users.get(email);

    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }

    return {
      accessToken: `access_token_${user.id}`,
      refreshToken: `refresh_token_${user.id}`,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles,
      },
    };
  }
}
