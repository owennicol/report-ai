<script lang="ts">
	import type { ChatCompletionRequestMessageRoleEnum } from 'openai'
	import SvelteMarkdown from 'svelte-markdown'
	export let type: ChatCompletionRequestMessageRoleEnum
	export let message: string
	export let prose: boolean = false
	export let childName: string = ''
</script>

<div class="chat {type === 'user' ? 'chat-end' : 'chat-start'} justify-end">
	<div class="chat-image avatar">
		<div class="w-10 rounded-full">
			<img
				src="https://ui-avatars.com/api/?name={type === 'user' ? 'Me' : 'RB'}"
				alt="{type} avatar"
			/>
		</div>
	</div>
	<div class="chat-header">
		{type === 'user' ? 'Me' : 'ReportBot'}
	</div>
	<div
		class="chat-bubble {type === 'user' ? 'chat-bubble-info' : 'chat-bubble'} {prose
			? 'prose'
			: ''} "
	>
		<SvelteMarkdown source={message} />
		<!-- {#if type === 'user'}
			Write me a report for {childName}
		{:else}
		{/if} -->
		<!-- {message} -->
	</div>
</div>
