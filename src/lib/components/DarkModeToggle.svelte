<script>
    let { darkMode = $bindable(false)} = $props();
    let rotation = $state(darkMode ? 180 : 0);
    function toggle_dark_mode() {
        darkMode = !darkMode;
        rotation += 180;
    }
</script>

<button  onclick={toggle_dark_mode} class="dark-mode-toggle" class:dark-mode={darkMode}>
    <div class="container" style:rotate={rotation + 'deg'}>
        <span class="material-symbols-outlined light-mode">
            light_mode
        </span>
        <span class="material-symbols-outlined dark-mode">
            dark_mode
        </span>
    </div>
</button>

<style lang="less">
    button {
        background: var(--clr-blue-4);
        color: var(--clr-foreground);
        border: none;
        border-radius: 50%;
        height: calc(1.125 * var(--button-height));
        aspect-ratio: 1;
        cursor: pointer;
        text-align: center;
        overflow: hidden;
        padding-block: 0.675em;
        &:hover {
            background: var(--clr-blue-3);
        }
        &:not(.dark-mode) {
            background: var(--clr-cyan-4);
        }
    }
    div.container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2em;
        transition: rotate 1s;
    }
    span.material-symbols-outlined {
        font-size: 1.5em;
        line-height: 1em;
        padding: 0;
        margin: 0;
        &.light-mode {
            color: var(--clr-yellow);
        }
        &.dark-mode {
            color: var(--clr-foreground);
            rotate: 180deg;
        }
    }
</style>