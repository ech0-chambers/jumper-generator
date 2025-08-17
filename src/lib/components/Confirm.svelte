<script>
  import { AlertDialog } from "bits-ui";
  import { fade } from "svelte/transition";
  let {
    icon = undefined,
    label = undefined,
    on_confirm = undefined,
    open = $bindable(false),
    title = "Are You Sure?",
    description = "This action cannot be undone.",
    cancel_label = "Cancel",
    confirm_label = "Confirm",
  } = $props();
  let isOpen = $state(false);
</script>

<div id="alert-dialog-container">
  <AlertDialog.Root bind:open>
    <AlertDialog.Trigger>
      {#if icon}
        <span class="material-symbols-outlined">{icon}</span>
      {/if}
      {#if label}
        <span>{label}</span>
      {/if}
    </AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Overlay forceMount>
        {#snippet child({ props, open })}
          {#if open}
            <div {...props} transition:fade={{ duration: 200 }}></div>
          {/if}
        {/snippet}
      </AlertDialog.Overlay>
      <AlertDialog.Content>
        <div>
          <AlertDialog.Title><div class="h3">{title}</div></AlertDialog.Title>
          <AlertDialog.Description>
            {description}
          </AlertDialog.Description>
        </div>
        <div class="actions">
          <AlertDialog.Cancel>
            {cancel_label}
          </AlertDialog.Cancel>
          <AlertDialog.Action
            onclick={() => {
              try {
                on_confirm();
              } catch (e) {
                console.error("Error in on_confirm:", e);
              }
              open = false;
            }}
          >
            {confirm_label}
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
</div>

<style lang="less">
  div#alert-dialog-container {
    display: flex;
    justify-content: center;
    align-items: center;
    & :global {
      [data-alert-dialog-trigger] {
        display: flex;
        align-items: center;
        gap: var(--gap-small);
        cursor: pointer;
        outline: none;
        border: none;
        background: var(--clr-background);
        padding: var(--gap-small);
        color: var(--clr-foreground);
        font-family: var(--font-family-main);
        font-size: var(--font-size-small);
        font-weight: var(--font-weight-normal);
        .hover-underline(var(--clr-error));
      }
    }
  }

  div.actions {
    display: flex;
    justify-content: space-between;
    gap: var(--gap-small);
    margin-top: var(--gap-medium);
    padding-inline: var(--gap-large);
    & :global(button) {
      padding-block: var(--gap-small);
      padding-inline: var(--gap-medium);
      font-size: var(--font-size-medium);
      font-family: var(--font-family-main);
      font-weight: var(--font-weight-bold);
      width: 30%;
      border: none;
      outline: none;
      color: var(--clr-foreground);
      &:first-of-type {
        --r: 0.8em; /* control the cutout */

        border-block: 0.5em solid #0000;
        line-height: 1.8;
        clip-path: polygon(
          100% 0,
          0 0,
          0 100%,
          100% 100%,
          calc(100% - var(--r)) calc(100% - 0.25em),
          100% 50%,
          calc(100% - var(--r)) 0.25em
        );
        background:
          radial-gradient(
              0.3em 50% at left,
              #000a,
              #0000
            )
            border-box,
          var(--clr-background-2) padding-box; /* the color  */
        outline: none;
        text-align: left;
        &:hover,
        &:focus {
          width: 40%;
          background:
            radial-gradient(
                0.3em 50% at left,
                #000a,
                #0000
              )
              border-box,
            var(--clr-blue-4) padding-box; /* the color  */
        }
      }
      &:last-of-type {
        --r: 0.8em; /* control the cutout */
        border-block: 0.5em solid #0000;
        padding-inline: calc(var(--r) + 0.25em) 0.5em;
        line-height: 1.8;
        clip-path: polygon(
          0 0,
          100% 0,
          100% 100%,
          0 100%,
          0 calc(100% - 0.25em),
          var(--r) 50%,
          0 0.25em
        );
        background:
          radial-gradient(
              0.3em 50% at right,
              #000a,
              #0000
            )
            border-box,
          var(--clr-error-4) padding-box; /* the color  */
        &:hover,
        &:focus {
          width: 40%;
          background:
            radial-gradient(
                0.3em 50% at right,
                #000a,
                #0000
              )
              border-box,
            var(--clr-error-3) padding-box; /* the color  */
        }
      }
    }
  }

  :global([data-alert-dialog-overlay]) {
    background: rgb(var(--clr-foreground-rgb), 0.05);
    backdrop-filter: blur(10px);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
  }

  :global([data-alert-dialog-content]) {
    background: var(--clr-background);
    color: var(--clr-foreground);
    border-radius: 0px;
    padding: var(--gap-small);
    box-shadow: 0.25em 0.25em var(--clr-accent3-5);
    border: 1px solid var(--clr-accent3-5);
    z-index: 1001;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  :global([data-alert-dialog-title]) {
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

  :global([data-alert-dialog-content]) {
    padding: var(--gap-medium);
    padding-top: 4.5em;
    width: fit-content;
    background-color: var(--clr-background-5);
    box-shadow: 0.5em 0.5em var(--clr-blue-4);
    border: 1px solid var(--clr-background-2);
  }
</style>
