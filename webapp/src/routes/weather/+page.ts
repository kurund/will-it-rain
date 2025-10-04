import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	return {
		location: url.searchParams.get('location') || '',
		date: url.searchParams.get('date') || ''
	};
};

