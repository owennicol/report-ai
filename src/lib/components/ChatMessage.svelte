<script lang="ts">
	import type { ChatCompletionRequestMessageRoleEnum } from 'openai'
	import SvelteMarkdown from 'svelte-markdown'
	export let copyContent: () => void = () => {}
	export let sendDocX: () => void = () => {}
	export let type: ChatCompletionRequestMessageRoleEnum
	export let message: string
	export let showCopyButton: boolean = false
	export let childName: string = ''
</script>

<div class="chat {type === 'user' ? 'chat-end' : 'chat-start'} justify-end chat-smart">
	<div class="chat-image avatar">
		<div class="w-10 rounded-full">
			<img
				src="https://ui-avatars.com/api/?name={type === 'user' ? 'Me' : 'RB'}"
				alt="{type} avatar"
			/>
		</div>
	</div>
	<div class="chat-bubble chatBubble {type === 'user' ? 'chat-bubble-info' : ''}">
		{#if type === 'user'}
			Please write me a report for {childName}
		{:else}
			<SvelteMarkdown source={message} />
		{/if}
		<!-- {message} -->
	</div>
	{#if showCopyButton}
		<div class="tools flex gap-4 align-middle justify-center flex-col">
			<div class="flex flex-1">
				<button type="button" class="btn btn-sm btn-outline" on:click={sendDocX}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						class="block w-5 mr-1"
						><path
							fill="currentColor"
							d="m12 16l-5-5l1.4-1.45l2.6 2.6V4h2v8.15l2.6-2.6L17 11zm-8 4v-5h2v3h12v-3h2v5z"
						/></svg
					>
					Save
				</button>
			</div>
			<div class="flex flex-1">
				<button type="button" class="btn btn-sm btn-outline" on:click={copyContent}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						class="block w-5 mr-1"
						><path fill="currentColor" d="M4 2h11v2H6v13H4zm4 4h12v16H8zm2 2v12h8V8z" /></svg
					>
					Copy
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.chat-start {
		grid-template-columns: auto 1fr auto;
	}
	.chat-end {
		grid-template-columns: 1fr auto auto;
	}

	.chatBubble {
		max-width: 100%;
	}

	.tools {
		grid-column-start: 3;
		grid-row: span 1 / span 1;
		align-self: flex-end;
		justify-self: flex-start;
	}
</style>
