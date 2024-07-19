export default {
	async proxyFetch(request: Request, url: URL): Promise<Response> {
		const newHearders = new Headers(request.headers);
		newHearders.set('Host', url.hostname);
		newHearders.set('Referer', url.href);
		const response = await fetch(url, { headers: newHearders });
		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers
		});
	},

	extractTarget(url: URL): URL {
		const hostname = url.hostname;
		const exceptions: { [key: string]: string } = {
			'registry-1-docker-io': 'registry-1.docker.io',
		};
		const parts = hostname.split('.');
		const newUrl = new URL(url);
		if (exceptions[parts[0]]) {
			newUrl.hostname = exceptions[parts[0]];
		} else {
			newUrl.hostname = parts[0].replace(/-/g, '.');
		}
		return newUrl;
	},

	removeSubdomain(url: URL): URL {
		const hostname = url.hostname;
		const parts = hostname.split('.');
		const newUrl = new URL(url);
		newUrl.hostname = parts.slice(-2).join('.');
		return newUrl;
	}
}
