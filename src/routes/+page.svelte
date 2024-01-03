<script lang="ts">
	import ChatMessage from '$lib/components/ChatMessage.svelte'
	import type { ChatCompletionRequestMessage } from 'openai'
	import { SSE } from 'sse.js'
	import { allSubjects } from '../utils/utils'
	import type { Subjects } from '../types/types'

	const initialAttributes = ['funny']

	const subjects = new Map<Subjects, string[]>()
	allSubjects.forEach((subject) => {
		subjects.set(subject, ['terrible'])
	})

	let query: string = ''
	let attributes: string[] = initialAttributes
	let answer: string = ''
	let loading: boolean = false
	let chatMessages: ChatCompletionRequestMessage[] = []
	let scrollToDiv: HTMLDivElement
	let childName: string = ''

	function scrollToBottom() {
		setTimeout(function () {
			scrollToDiv.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
		}, 100)
	}

	const handleSubmit = async () => {
		const subjectsString = [...subjects].reduce((acc, [subject, values]) => {
			acc += `{${subject}: ${values.join(', ')}}, `
			return acc
		}, '')

		console.log('====> subjectsString:', subjectsString)

		loading = true
		childName = query
		chatMessages = [
			...chatMessages,
			{ role: 'user', content: `{ childName: ${childName}, ${subjectsString}}` }
		]

		const eventSource = new SSE('/api/chat', {
			headers: {
				'Content-Type': 'application/json'
			},
			payload: JSON.stringify({ messages: chatMessages })
		})

		query = ''
		attributes = initialAttributes

		eventSource.addEventListener('error', handleError)

		eventSource.addEventListener('message', (e) => {
			scrollToBottom()
			try {
				loading = false
				if (e.data === '[DONE]') {
					chatMessages = [...chatMessages, { role: 'assistant', content: answer }]
					answer = ''
					return
				}

				const completionResponse = JSON.parse(e.data)
				const [{ delta }] = completionResponse.choices

				if (delta.content) {
					answer = (answer ?? '') + delta.content
				}
			} catch (err) {
				handleError(err)
			}
		})
		eventSource.stream()
		scrollToBottom()
	}

	function handleError<T>(err: T) {
		loading = false
		query = ''
		answer = ''
		console.error(err)
	}
</script>

<div class="flex flex-col pt-4 w-full px-8 items-center gap-2">
	<div>
		<h1 class="text-2xl font-bold w-full text-center">School Report AI</h1>
	</div>
	<div class="h-[500px] w-full bg-slate-600 rounded-md p-4 overflow-y-auto flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<ChatMessage
				type="assistant"
				message="Hello, please enter the child's full name and attributes"
			/>
			{#each chatMessages as message}
				<ChatMessage type={message.role} message={message.content || ''} {childName} />
				<!-- <SvelteMarkdown source={message.content} /> -->
			{/each}
			{#if answer}
				<ChatMessage type="assistant" message={answer} />
			{/if}
			{#if loading}
				<ChatMessage type="assistant" message="Loading.." />
			{/if}
		</div>
		<div class="" bind:this={scrollToDiv} />
	</div>
	<form
		class="flex flex-col w-full rounded-md gap-4 bg-white dark:bg-gray-800 p-4 align-middle items-center border dark:border-gray-900"
		on:submit|preventDefault={() => handleSubmit()}
	>
		<div class="w-full">
			<label for="child-name" class="w-full mb-1 flex">Child's name:</label>
			<input type="text" class="input input-bordered w-full" name="child-name" bind:value={query} />
		</div>
		<div class="grid grid-cols-2 gap-4 w-full">
			{#each [...subjects] as [subject, value]}
				<div class="flex flex-col flex-shrink-0">
					<label for={subject} class="w-full mb-1 flex">{subject}:</label>
					<input type="text" class="input input-bordered w-full" bind:value />
				</div>
			{/each}
		</div>
		<button type="submit" class="btn btn-accent w-full mt-4">Go</button>
	</form>
</div>
