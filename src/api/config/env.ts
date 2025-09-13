import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
	PORT: process.env.PORT || 5050,
	BASE_URL: process.env.BASE_URL || 'http://localhost:5050',
	DATABASE_URL: process.env.DATABASE_URL || ''
};
