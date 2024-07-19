/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import utils from "./utils";
import handlePypi from "./pypi";

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);
    const target = utils.extractTarget(url);

    if (target?.hostname === 'pypi.org') {
      return await handlePypi.fetch(request, env, ctx);
    }

    if (target) {
      return await utils.proxyFetch(request, target);
    }

    return new Response('This worker works for mirror', { status: 200 });

  },
} satisfies ExportedHandler<Env> ;
