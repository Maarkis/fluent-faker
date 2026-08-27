import { Faker, LocaleDefinition, allLocales } from '@faker-js/faker';

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
export function getLocale(codeLocale?: string | LocaleDefinition | Faker): Locale {
	if (codeLocale === undefined) return defaultLocale();

	if (typeof codeLocale === 'string') {
		return (
			locales().find(({ code }: Locale): boolean => code === codeLocale) ?? defaultLocale()
		);
	}

	const locale = codeLocale instanceof Faker ? codeLocale.rawDefinitions : codeLocale;
	return { code: 'custom', locale };
}
