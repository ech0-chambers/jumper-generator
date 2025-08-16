<script>
    let isFullScreen = $state(false);

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            isFullScreen = true;
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                isFullScreen = false;
            }
        }
    }
</script>

<div>
    <button
        onclick={toggleFullScreen}
    >
        {#if isFullScreen}
            <span class="material-symbols-outlined">
                fullscreen_exit
            </span>
        {:else}
            <span class="material-symbols-outlined">
                fullscreen
            </span>
        {/if}
    </button>
</div>

<style lang="less">
    div :global {
        button {
            position: fixed;
            bottom: 1em;
            right: 1em;
            .raised();
            background: var(--clr-accent1-5);
            color: var(--clr-foreground);
            border: none;
            outline: none;
            border-radius: var(--border-radius-main);
            padding: var(--gap-small);
            cursor: pointer;
            width: 3em;
            height: 3em;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99;
            &:hover, &:focus {
                .raised-4();
            }
            & span {
                text-align: center;
            }
        }
    }
</style>