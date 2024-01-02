import { LocaleDefinition, allLocales } from '@faker-js/faker';

export interface Locale {
	code: string;
	locale: LocaleDefinition;
}

/**
 * Generates an array of Locale objects based on the allLocales object.
 *
 * @return {Locale[]} An array of Locale objects.
 */
function locales(): Locale[] {
	return Object.entries(allLocales).map(
		([key, value]): Locale => ({
			code: key,
			locale: value,
		}),
	);
}

/**
 * Returns the default locale.
 *
 * @return {Locale} The default locale object.
 */
function defaultLocale(): Locale {
	return {
		code: 'en',
		locale: allLocales.en,
	};
}

/**
 * Retrieves the locale object based on the provided codeLocale.
 *
 * @param {string} codeLocale - The code of the locale to retrieve.
 * @return {Locale} The locale object that matches the provided codeLocale. If no match is found, the default locale is returned.
 */
export function getLocale(codeLocale?: string): Locale {
	if (!codeLocale) return defaultLocale();

	return locales().find(({ code }: Locale): boolean => code === codeLocale) ?? defaultLocale();
}
