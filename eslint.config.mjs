import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
	{
		ignores: ['node_modules', 'dist', '.env']
	},
	{
		files: ['**/*.ts', '**/*.js'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module'
			},
			globals: {
				...globals.node,
				...globals.es2022,
				...globals.browser
			}
		},
		plugins: {
			'@typescript-eslint': ts,
			prettier
		},
		rules: {
			...js.configs.recommended.rules,
			...ts.configs.recommended.rules,
			...prettierConfig.rules,
			'prettier/prettier': [
				'error',
				{
					singleQuote: true,
					semi: true,
					useTabs: true,
					tabWidth: 2,
					printWidth: 100,
					trailingComma: 'none',
					bracketSpacing: true,
					arrowParens: 'always'
				}
			],
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/no-explicit-any': 'warn',
			'no-console': 'off'
		}
	}
];
