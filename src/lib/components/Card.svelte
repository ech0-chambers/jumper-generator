<script>
  let { title, children } = $props();
</script>

<div class="card">
  {#if title}
    <div class="card-header">
      <div class="h3">{title}</div>
    </div>
  {/if}
  <div class="card-content">
    {@render children()}
  </div>
</div>

<style lang="less">
  .card {
    padding: var(--gap-medium);
    padding-top: 4.5em;
    width: fit-content;
    background-color: var(--clr-background-5);
    box-shadow: 0.5em 0.5em var(--clr-blue-4);
    border: 1px solid var(--clr-background-2);
    position: relative;
  }
  .card-header {
    // width: 90%;
    // margin-inline-start: calc(var(--gap-medium) * -1.5);
    // padding-inline: calc(1.5 * var(--gap-small));
    // padding-block: var(--gap-small);
    // background-color: var(--clr-accent2);
    // margin-block-end: var(--gap-medium);
    & div.h3 {
      margin-block: 0px;
      color: var(--clr-background);
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-large);
    }
    --f: 0.8em; /* control the folded part*/
    --r: 1.25em; /* control the ribbon shape */
    position: absolute;
    top: 1em;
    left: calc(-1 * var(--f));
    right: 5em;
    padding-inline: calc(var(--f) + 0.5em);
    line-height: 2;
    background: var(--clr-accent2);
    border-bottom: var(--f) solid #0005;
    border-right: var(--r) solid #0000;
    clip-path: polygon(
      0 0,
      0 calc(100% - var(--f)),
      var(--f) 100%,
      var(--f) calc(100% - var(--f)),
      100% calc(100% - var(--f)),
      calc(100% - var(--r)) calc(50% - var(--f) / 2),
      100% 0
    );
  }
  .card-content {
    height: 100%;
  }
</style>
