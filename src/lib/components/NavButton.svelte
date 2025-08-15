<script>
    import { page } from "$app/state";
    import { Button } from "bits-ui";
    let { href, label, icon, small = $bindable(false) } = $props();
    let is_current = $state(false);
    $effect(() => {
        is_current = href === page.url.pathname;
    });
    
</script>

<div>
    <Button.Root
        {href}
        variant="secondary"
        class="navbutton {is_current ? 'current-page' : ''}"
        enabled={!is_current}
        aria-label={label}
        small={small}
    >   
        {#if icon}
            <span class="material-symbols-outlined">
                {icon}
            </span>
        {/if}
        {#if !small}
            <span>
                {label}
            </span>
        {/if}
    </Button.Root>
</div>

<style>
    * {
        transition: width 0.3s;
    }

    div :global {
        .navbutton {
            width: 15ch;
            overflow: hidden;
            &[small="true"] {
                width: 2ch;
            }
        }
    }
</style>