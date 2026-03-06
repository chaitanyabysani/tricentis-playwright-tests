import * as fs from 'fs';
import * as path from 'path';

const credentialsFilePath = path.resolve(__dirname, './credentials.json');

export interface UserCredentials {
  email: string;
  password: string;
}

export class CredentialManager {

  static save(credentials: UserCredentials): void {
    fs.writeFileSync(credentialsFilePath, JSON.stringify(credentials, null, 2), 'utf-8');
    console.log(`Credentials saved for: ${credentials.email}`);
  }

  static load(): UserCredentials {
    const raw = fs.readFileSync(credentialsFilePath, 'utf-8');
    const credentials: UserCredentials = JSON.parse(raw);

    if (!credentials.email || !credentials.password) {
      throw new Error('Credentials file is empty. Run the registration test first.');
    }

    return credentials;
  }
}
