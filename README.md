# **Samlat**

<p align="center">
  <img width="150" alt="collected" src="https://github.com/lichstam/svelte-samlat/blob/main/assets/data-collection.png">
</p>

## **Preface**

> Samlat - Swedish word for "collected"

Inspired by libraries such as react-query and SWR samlat helps you structure api functions and provides great convenience

```javascript
const { data, loading, errors, get } = query("someRequest")

get()
```

You specify everything in one place:

```javascript
// queries.ts
const someRequest = makeQueries({
  fn: () => fetch(url),
  decoder: ZodDecoder.parse,
  transformationFn: anyTransformationFn,
})
```

---

## **The setup**

### 1. → **Client rendered**

All you need is to import two functions `queryFn` and `querySvelte` from samlat. Pass your queries file into those and export that function:

```javascript
import * as queries from "./queries"

export const query = querySvelte(queryFn(queries))
```

```javascript
// queries.ts
export const someRequest = makeQueries(...)
export const someOtherRequest = makeQueries(...)
```

### 2. → **Server rendered**

If you're using svelte-kit and want to leverage the `load` function server side you can create a separate function for it by omitting the `querySvelte` part:

```javascript
import * as queries from "./queries"

export const queryServer = queryFn(queries)
```

### 3. → **Mutation**

There is also a `mutateSvelte` function for other requests than `get`. At present moment it's mimicking the `querySvelte` behaviour but it's recommended to use `mutateSvelte` for `post/put/delete/patch` requests for the sake of separation. It's most likely also going to change behaviour in the future. The setup is the same as with `querySvelte` (just swap it for `mutateSvelte`)

## **Full example**

```javascript
/// queries
import { makeQueries } from "svelte-samlat";

export const gateway = makeQueries({
  fn: async () => {
    const res = await fetch("https://api2.binance.com/api/v3/ticker/24hr");
    return res.json();
  },
  decoder: (res) => res,
  transformationFn: (data) => data,
});


// queryFn
import { queryFn, querySvelte } from 'svelte-samlat';
import * as queries from './queries';

export default querySvelte(queryFn(queries));

// app.svelte
<script lang="ts">
  import { fade } from 'svelte/transition';
  import query from './queries'
  export const prerender = true
  const { data, loading, get } = query('gateway')
</script>

<nav>
  {#if $loading}
    <div >Loading....</div>
  {:else if $data}
    <div transition:fade={{duration: 300}}>{JSON.stringify($data)}</div>
  {/if}
  <div on:click={get}>click me</div>
</nav>
```

## **Future development**

> List is tentative

- Cache
- Framework agnostic
- Typescript improvements
