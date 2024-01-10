<script lang="ts">
	import ChatMessage from '$lib/components/ChatMessage.svelte'
	import type { ChatCompletionRequestMessage } from 'openai'
	import { copyText } from 'svelte-copy'
	import { SSE } from 'sse.js'

	import { allSubjects, possibleAssessments } from '../utils/utils'
	import type { Subjects } from '../types/types'

	const initialAttribute = possibleAssessments[4]

	let subjects = new Map<Subjects, string>()
	allSubjects.forEach((subject) => {
		subjects.set(subject, initialAttribute)
	})

	let query: string = ''

	let answer: string = ''
	let loading: boolean = false
	let chatMessages: ChatCompletionRequestMessage[] = []
	let scrollToDiv: HTMLDivElement
	let childName: string = ''
	let docXUrl: string = ''

	let eventSource: SSE

	function scrollToBottom() {
		setTimeout(function () {
			scrollToDiv.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
		}, 100)
	}

	const handleSubmit = async () => {
		const subjectsString = [...subjects].reduce((acc, [subject, value]) => {
			acc += `{${subject}: ${value}}, `
			return acc
		}, '')

		loading = true
		childName = query
		chatMessages = [
			...chatMessages,
			{ role: 'user', content: `{ childName: ${childName}, ${subjectsString}}` }
		]

		eventSource = new SSE('/api/chat', {
			headers: {
				'Content-Type': 'application/json'
			},
			payload: JSON.stringify({ messages: chatMessages })
		})

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

	function onDestroy() {
		eventSource.close()
	}

	function resetForm() {
		//reset values
		query = ''
		subjects.forEach((_, key) => {
			subjects.set(key, initialAttribute)
		})
		subjects = subjects
	}

	function handleError<T>(err: T) {
		loading = false
		query = ''
		answer = ''
		console.error(err)
	}

	function onChange(event: Event) {
		const { name, value } = event.target as HTMLInputElement
		subjects.set(name as Subjects, value)
	}

	function copyContent(message: string) {
		copyText(message)
	}

	async function sendDocX(message: string) {
		const response = await fetch('/api/docx', {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({
				message,
				childName
			})
		})

		const data = await response.json()
		docXUrl = data?.url ?? ''
	}
</script>

<div class="flex flex-col pt-4 w-full px-4 md:px-8 items-center gap-2">
	<div>
		<h1 class="text-2xl font-bold w-full text-center mb-2">School Report AI</h1>
	</div>
	<div
		class="h-[500px] w-full bg-slate-600 rounded-md p-4 overflow-y-auto flex flex-col gap-4 relative"
	>
		<div class="flex flex-col gap-2">
			<ChatMessage
				type="assistant"
				message="Hello, please enter the child's full name and attainments"
			/>
			{#each chatMessages as message, i}
				<ChatMessage
					type={message.role}
					message={message.content || ''}
					{childName}
					showCopyButton={i === 1}
					copyContent={() => copyContent(message.content || '')}
					sendDocX={() => sendDocX(message.content || '')}
				/>
			{/each}
			{#if answer}
				<ChatMessage type="assistant" message={answer} showCopyButton />
			{/if}
			{#if loading}
				<ChatMessage type="assistant" message="Loading.." />
			{/if}
		</div>
		<div class="" bind:this={scrollToDiv} />
	</div>
	<div class="flex gap-3">
		<button class="btn" type="button" on:click={onDestroy}>Stop streaming</button>
		<button class="btn btn-outline" type="button" on:click={resetForm}>Reset form</button>
	</div>
	{#if docXUrl}
		<p><a href={docXUrl}>Download report for {childName}</a></p>
	{/if}
	<form
		class="flex flex-col w-full rounded-md gap-4 bg-white dark:bg-gray-800 p-4 align-middle items-center border dark:border-gray-900"
		on:submit|preventDefault={() => handleSubmit()}
	>
		<div class="w-full">
			<label for="child-name" class="w-full mb-1 flex">Child's name:</label>
			<input type="text" class="input input-bordered w-full" name="child-name" bind:value={query} />
		</div>
		<div class="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
			{#each [...subjects] as [subject, value]}
				<div class="flex flex-col flex-shrink-0">
					<label for={subject} class="w-full mb-1 flex">{subject}:</label>
					<select
						class="input input-bordered w-full"
						on:change={onChange}
						name={subject}
						bind:value
					>
						{#each possibleAssessments as assessment}
							<option value={assessment}>{assessment}</option>
						{/each}
					</select>
				</div>
			{/each}
		</div>
		<button type="submit" class="btn btn-accent w-full mt-4">Go</button>
	</form>
</div>
