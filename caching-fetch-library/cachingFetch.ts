// You may edit this file, add new files to support this file,
// and/or add new dependencies to the project as you see fit.
// However, you must not change the surface API presented from this file,
// and you should not need to change any other files in the project to complete the challenge

import { useEffect, useState } from 'react'

type UseCachingFetch = (url: string) => {
	isLoading: boolean
	data: unknown
	error: Error | null
}

/**
 * 1. Implement a caching fetch hook. The hook should return an object with the following properties:
 * - isLoading: a boolean that is true when the fetch is in progress and false otherwise
 * - data: the data returned from the fetch, or null if the fetch has not completed
 * - error: an error object if the fetch fails, or null if the fetch is successful
 *
 * This hook is called three times on the client:
 *  - 1 in App.tsx
 *  - 2 in Person.tsx
 *  - 3 in Name.tsx
 *
 * Acceptance Criteria:
 * 1. The application at /appWithoutSSRData should properly render, with JavaScript enabled, you should see a list of people.
 * 2. You should only see 1 network request in the browser's network tab when visiting the /appWithoutSSRData route.
 * 3. You should not change any code outside of this file to achieve this.
 * 4. This file passes a type-check.
 *
 */

const cache: { [url: string]: any } = {} // cache object to store the fetched data outside the hook to avoid re-fetching the same data
export const useCachingFetch: UseCachingFetch = (url: string) => {
	const [data, setData] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	useEffect(() => {
		if (cache[url]) {
			setData(cache[url])
			return
		}

		const fetchData = async () => {
			setIsLoading(true)
			try {
				const response = await fetch(url)
				if (!response.ok) {
					throw new Error('Network response was not ok')
				}
				const data = await response.json()
				cache[url] = data
				setData(data)
				setIsLoading(false)
			} catch (error) {
				setError(error as Error)
			}
		}
		fetchData()
	}, [url])
	return {
		data: data ? data : null,
		isLoading: isLoading,
		error: error
			? new Error('UseCachingFetch has not been implemented, please read the instructions in DevTask.md')
			: null,
	}
}

/**
 * 2. Implement a preloading caching fetch function. The function should fetch the data.
 *
 * This function will be called once on the server before any rendering occurs.
 *
 * Any subsequent call to useCachingFetch should result in the returned data being available immediately.
 * Meaning that the page should be completely serverside rendered on /appWithSSRData
 *
 * Acceptance Criteria:
 * 1. The application at /appWithSSRData should properly render, with JavaScript disabled, you should see a list of people.
 * 2. You should not change any code outside of this file to achieve this.
 * 3. This file passes a type-check.
 *
 */
export const preloadCachingFetch = async (url: string): Promise<any> => {
	try {
		const response = await fetch(url)

		if (!response.ok) {
			throw new Error('Network response was not ok')
		}

		const data = await response.json()

		cache[url] = data
		console.log('cache', cache)

		cache[url]
	} catch (error) {
		throw new Error('preloadCachingFetch has not been implemented, please read the instructions in DevTask.md')
	}
}

/**
 * 3.1 Implement a serializeCache function that serializes the cache to a string.
 * 3.2 Implement an initializeCache function that initializes the cache from a serialized cache string.
 *
 * Together, these two functions will help the framework transfer your cache to the browser.
 *
 * The framework will call `serializeCache` on the server to serialize the cache to a string and inject it into the dom.
 * The framework will then call `initializeCache` on the browser with the serialized cache string to initialize the cache.
 *
 * Acceptance Criteria:
 * 1. The application at /appWithSSRData should properly render, with JavaScript enabled, you should see a list of people.
 * 2. You should not see any network calls to the people API when visiting the /appWithSSRData route.
 * 3. You have not changed any code outside of this file to achieve this.
 * 4. This file passes a type-check.
 *
 */
export const getCachedData = (url: string) => cache[url]

export const serializeCache = (): string => JSON.stringify(cache)

export const initializeCache = (initialData: string): void => {
	console.log('initialData', initialData)
	const parsedCache = JSON.parse(initialData)
	Object.keys(parsedCache).forEach(key => {
		cache[key] = parsedCache[key]
	})
}

export const wipeCache = (): void => {
	for (const url in cache) {
		if (cache.hasOwnProperty(url)) {
			delete cache[url]
		}
	}
}
