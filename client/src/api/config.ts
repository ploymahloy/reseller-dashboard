const URL_MAP = {
    development: 'http://localhost:3000',
    // qa: 'https://qa.example.com',
    // production: 'https://api.example.com',
} as const;

export type Environment = keyof typeof URL_MAP;

const currentEnv = (process.env.NODE_ENV as Environment) || 'development';

export const BASE_URL = URL_MAP[currentEnv] ?? URL_MAP.development;