import utils from "./utils";

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const target = utils.extractTarget(url);
		const proxyDomain = utils.removeSubdomain(url);
		const response = await utils.proxyFetch(request, target);
		let body = await response.text();
		body = body.replace(/files.pythonhosted.org/g, `files-pythonhosted-org.${proxyDomain.hostname}`);
		return new Response(body, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
		});
	}
} satisfies ExportedHandler<Env>;
