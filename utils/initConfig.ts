import fs from 'fs';
import path from 'path';
import { prompt } from 'enquirer';

interface Config {
    email: string;
}

export async function initConfig() {
    const configDir = path.join(__dirname, '..', '..', 'config');
    const configPath = path.join(configDir, 'user-config.json');

    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
    }

    const response = await prompt<Config>({
        type: 'input',
        name: 'email',
        message: 'Please enter your email address:',
        validate: (input) => {
            // Basic email validation
            return /\S+@\S+\.\S+/.test(input) ? true : 'Please enter a valid email address.';
        }
    });

    // Create the config file with the email
    const config: Config = { email: response.email };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    console.log(`Configuration file created at ${configPath}`);
    console.log('Email stored successfully!');
}