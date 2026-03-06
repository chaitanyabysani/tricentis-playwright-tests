import * as fs from 'fs';
import * as path from 'path';

const credentialsFilePath = path.resolve(__dirname, './credentials.json');

export interface UserCredentials {
  email: string;
  password: string;
}

export class CredentialManager {

  // Appends new credentials to the file — old entries are preserved
  static save(credentials: UserCredentials): void {
    const existing = CredentialManager.loadAll();
    existing.push(credentials);
    fs.writeFileSync(credentialsFilePath, JSON.stringify(existing, null, 2), 'utf-8');
    console.log(`Credentials saved for: ${credentials.email} (total stored: ${existing.length})`);
  }

  // Returns the most recently saved credentials (last entry)
  static load(): UserCredentials {
    const all = CredentialManager.loadAll();

    if (all.length === 0) {
      throw new Error('No credentials found. Run the registration test first.');
    }

    return all[all.length - 1];
  }

  // Returns all stored credentials
  static loadAll(): UserCredentials[] {
    if (!fs.existsSync(credentialsFilePath)) {
      return [];
    }

    const raw = fs.readFileSync(credentialsFilePath, 'utf-8').trim();

    if (!raw || raw === '[]') {
      return [];
    }

    return JSON.parse(raw) as UserCredentials[];
  }
}
