import { describe } from 'node:test';
import { getLocale } from './locale';
import { en, pt_BR } from '@faker-js/faker';

describe('Suite test Locale', () => {
	describe('getLocale', () => {
		it(`${getLocale.name} should return the default locale if no codeLocale is provided`, () => {
			const locale = getLocale();

			expect(locale).toEqual({
				code: 'en',
				locale: en,
			});
		});

		it(`${getLocale.name} should return the locale object that matches the provided codeLocale`, () => {
			const locale = getLocale('pt_BR');
			expect(locale).toEqual({
				code: 'pt_BR',
				locale: pt_BR,
			});
		});

		it(`${getLocale.name} should throw when the provided codeLocale does not exist`, () => {
			expect(() => getLocale('pt_notExist')).toThrow(/Unknown locale: 'pt_notExist'/);
		});

		it(`${getLocale.name} should suggest close locale codes in the error message`, () => {
			expect(() => getLocale('pt-BR')).toThrow(/'pt_BR'/);
		});
	});
});
