<script>
  let { tooltip } = $props();
  import { Tooltip, Popover } from "bits-ui";
  import { appState } from "$lib/jumper.svelte";

</script>

<div class="help">
    {#if appState.mobile}
    <Popover.Root>
        <Popover.Trigger>
            <span class="material-symbols-outlined">help</span>
        </Popover.Trigger>
        <Popover.Portal>
            <Popover.Content>
                <div class="tooltip-content">{@html tooltip}</div>
            </Popover.Content>
        </Popover.Portal>
    </Popover.Root>
    {:else}
  <Tooltip.Provider>
    <Tooltip.Root delayDuration={400}>
      <Tooltip.Trigger>
        <span class="material-symbols-outlined">help</span>
      </Tooltip.Trigger>
      <Tooltip.Content sideOffset={8}>
        <div class="tooltip-content">{@html tooltip}</div>
      </Tooltip.Content>
    </Tooltip.Root>
  </Tooltip.Provider>
  {/if}
</div>


<style lang="less">
    :global {

        .tooltip-content {
            // .raised-2();
            background: var(--clr-background);
            color: var(--clr-foreground);
            padding: var(--gap-small);
            border-radius: 0px;
            min-width: 10ch;
            max-width: 30ch;
            text-align: center;
            font-size: var(--font-size-small);
            box-shadow: 0.25em 0.25em var(--clr-info);
            border: 1px solid var(--clr-info-4);
        }

        .help [data-tooltip-trigger], .help [data-popover-trigger] {
            cursor: pointer;
            color: var(--clr-foreground);
            font-size: 1.2em;
            background: var(--clr-info-5);
            border-radius: 50%;
            padding: 0.2em;
            aspect-ratio: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: none;
            color: var(--clr-info);
            &:hover {
                background: var(--clr-background);
            }
        }

    }
</style>