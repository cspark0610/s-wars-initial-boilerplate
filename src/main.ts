import 'reflect-metadata';
import { bootstrap } from './bootstrap';

async function main(): Promise<void> {
  try {
    const app = await bootstrap();
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.error('Fatal error during bootstrap:', error);
    process.exit(1);
  }
}

void main();
