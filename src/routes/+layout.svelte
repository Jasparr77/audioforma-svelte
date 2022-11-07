<script>
import {QueryClient, QueryClientProvider} from '@sveltestack/svelte-query'

const client = new(QueryClient)
</script>

<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/settings">Settings</a>
</nav>
<QueryClientProvider client={client}>
  <slot/>
</QueryClientProvider>