import { LocaleDefinition, allLocales } from '@faker-js/faker';

export interface Locale {
	code: string;
	locale: LocaleDefinition;
}

const DEFAULT_LOCALE_CODE = 'en';

/**
 * Returns the default locale.
 *
 * @return {Locale} The default locale object.
 */
function defaultLocale(): Locale {
	return {
		code: DEFAULT_LOCALE_CODE,
		locale: allLocales[DEFAULT_LOCALE_CODE],
	};
}

/**
 * Edit distance between two strings, used to suggest a close locale code
 * when the one given does not exist.
 */
function levenshtein(a: string, b: string): number {
	const rows = a.length + 1;
	const cols = b.length + 1;
	const distances: number[][] = Array.from({ length: rows }, (): number[] =>
		Array.from({ length: cols }, (): number => 0),
	);
	for (let i = 0; i < rows; i++) distances[i][0] = i;
	for (let j = 0; j < cols; j++) distances[0][j] = j;

	for (let i = 1; i < rows; i++) {
		for (let j = 1; j < cols; j++) {
			const cost = a[i - 1] === b[j - 1] ? 0 : 1;
			distances[i][j] = Math.min(
				distances[i - 1][j] + 1,
				distances[i][j - 1] + 1,
				distances[i - 1][j - 1] + cost,
			);
		}
	}

	return distances[rows - 1][cols - 1];
}

function closestLocaleCodes(codeLocale: string, limit = 3): string[] {
	return Object.keys(allLocales)
		.map((code: string): { code: string; distance: number } => ({
			code,
			distance: levenshtein(codeLocale.toLowerCase(), code.toLowerCase()),
		}))
		.sort((a, b) => a.distance - b.distance)
		.slice(0, limit)
		.map(({ code }) => code);
}

/**
 * Retrieves the locale object for the given code.
 *
 * @param {string} codeLocale - The code of the locale to retrieve. Omit it to get the default locale.
 * @throws {Error} When codeLocale is provided but does not match a known Faker locale.
 * @return {Locale} The matching locale object.
 */
export function getLocale(codeLocale?: string): Locale {
	if (codeLocale === undefined) return defaultLocale();

	const locale = (allLocales as Record<string, LocaleDefinition>)[codeLocale];
	if (!locale) {
		const suggestions = closestLocaleCodes(codeLocale);
		throw new Error(
			`Unknown locale: '${codeLocale}'. Did you mean: ${suggestions
				.map((code: string): string => `'${code}'`)
				.join(', ')}?`,
		);
	}

	return { code: codeLocale, locale };
}
