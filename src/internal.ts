/**
 * Narrows a value to a callable. Replaces `lodash.isfunction`.
 */
export function isFunction(value: unknown): value is (...args: never[]) => unknown {
	return typeof value === 'function';
}

/**
 * Structural deep clone for the plain data a model may carry: objects, arrays,
 * `Date`, `Map` and `Set`. Functions are shared by reference, which is what the
 * Builder wants for rule callbacks. Replaces `lodash.clonedeep`.
 *
 * `structuredClone` is not used because it is unavailable on Node 16 and would
 * throw on the function values a model is allowed to hold.
 */
export function cloneDeep<T>(value: T, seen = new WeakMap<object, unknown>()): T {
	if (value === null || typeof value !== 'object') return value;

	const asObject = value as unknown as object;
	const cached = seen.get(asObject);
	if (cached !== undefined) return cached as T;

	if (value instanceof Date) return new Date(value.getTime()) as unknown as T;
	if (value instanceof RegExp) return new RegExp(value.source, value.flags) as unknown as T;

	if (Array.isArray(value)) {
		const copy: unknown[] = [];
		seen.set(asObject, copy);
		for (const item of value) copy.push(cloneDeep(item, seen));
		return copy as unknown as T;
	}

	if (value instanceof Map) {
		const copy = new Map();
		seen.set(asObject, copy);
		for (const [k, v] of value) copy.set(cloneDeep(k, seen), cloneDeep(v, seen));
		return copy as unknown as T;
	}

	if (value instanceof Set) {
		const copy = new Set();
		seen.set(asObject, copy);
		for (const item of value) copy.add(cloneDeep(item, seen));
		return copy as unknown as T;
	}

	const copy = Object.create(Object.getPrototypeOf(asObject)) as Record<string, unknown>;
	seen.set(asObject, copy);
	for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
		copy[key] = cloneDeep(item, seen);
	}
	return copy as T;
}
