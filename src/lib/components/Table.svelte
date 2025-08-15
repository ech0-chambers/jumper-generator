<script>
  import { appState } from "$lib/jumper.svelte";
  let { children, headers } = $props();
</script>

<div class="table-container">
  <table class:mobile={appState.mobile}>
    <thead>
      <tr>
        {#each headers as head}
          <th>{head}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {@render children()}
    </tbody>
  </table>
</div>

<style lang="less">
  div.table-container {
    max-height: min(20em, 30vh);
    overflow-y: auto;

    & :global {
      table {
        margin: auto;
        border-collapse: collapse;
        & thead {
          background: var(--clr-accent1);
          color: var(--clr-background);
          font-weight: var(--font-weight-bold);
        }
        & th,
        & td {
          padding: var(--gap-small);
          text-align: center;
        }
        & tbody tr:nth-child(odd) {
          background: var(--clr-background-5);
        }
        & tbody tr:nth-child(even) {
          background: var(--clr-background-4);
        }
        & tbody tr:hover,
        & tbody tr:focus-within {
          // background: var(--clr-accent1-3);
          box-shadow: inset 0px 0px 2px 1px var(--clr-green);
        }
        &:not(.mobile) {
          & th,
          & td {
            min-width: 15ch;
          }
        }
        &.mobile {
          max-width: 70vw;
        }
      }
    }
  }
</style>
