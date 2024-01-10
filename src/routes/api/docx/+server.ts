import type { RequestHandler } from './$types'
import { json } from '@sveltejs/kit'
import type { Config } from '@sveltejs/adapter-vercel'

import { unified } from "unified";
import markdown from "remark-parse";
import docx from "remark-docx";
import * as fs from "fs";


const processor = unified().use(markdown).use(docx, { output: "buffer" });

export const config: Config = {
	runtime: 'nodejs20.x'
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const requestData = await request.json()

		if (!requestData) {
			throw new Error('No request data')
		}
		const { message = '', childName = '' } = requestData

		if (!message || !childName) {
			throw new Error('No message or childName')
		}

		const doc = await processor.process(message);
		const buffer = await doc.result as Buffer;
		fs.writeFileSync(`${childName}.docx`, buffer);

		return new Response(JSON.stringify({ message: 'Success' }), {
			headers: {
				'Content-Type': 'text/json'
			}
		})
	} catch (err) {
		console.error(err)
		return json({ error: 'There was an error dealing with the Docx request' }, { status: 500 })
	}
}
