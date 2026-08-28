export function cloneDeep<T>(value: T): T {
	if (Array.isArray(value)) {
		return value.map((item) => cloneDeep(item)) as unknown as T;
	}

	if (value instanceof Date) {
		return new Date(value.getTime()) as unknown as T;
	}

	if (value !== null && typeof value === 'object') {
		const clone = {} as Record<string, unknown>;
		for (const key of Object.keys(value)) {
			clone[key] = cloneDeep((value as Record<string, unknown>)[key]);
		}
		return clone as T;
	}

	return value;
}
