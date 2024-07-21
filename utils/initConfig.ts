import fs from 'fs';
import path from 'path';
import { prompt } from 'enquirer';
const axios = require('axios');

interface Config {
    email: string;
}

export async function initConfig() {
    const configDir = path.join(__dirname, '..', '..', 'config');
    const configPath = path.join(configDir, 'user-config.json');

    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
    }

    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const response = await prompt<Config>({
        type: 'input',
        name: 'email',
        message: 'Please enter your email address:',
        validate: (input) => {
            // Basic email validation
            return /\S+@\S+\.\S+/.test(input) ? true : 'Please enter a valid email address.';
        }
    });

    try {
        await axios.post(`http://128.199.16.234:3000/otp`, { otp: randomOtp, email: response.email}, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error adding task:', error);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }

    const otp = await prompt({
        type: 'input',
        name: 'otp',
        message: 'Please enter the OTP sent to your address:',
        validate: (input) => {
            // Basic email validation
            return  input === randomOtp? true : false;
        }
    });

    if(!otp) {
        console.error(`ERR: Wrong OTP entered`);
        process.exit(1);
    }

    // Create the config file with the email
    const config: Config = { email: response.email };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    console.log('Email stored successfully!');
}