<script>
    let { active = $bindable(true), icon, label, href, current = $bindable(false), minimised = $bindable(false) } = $props();
</script>

<div 
    class="sidebar-item"
    class:minimised={minimised}
    class:active={active}
    class:current={current}
>
    <a href={href} class="sidebar-item-link" aria-label={label}>
        {#if icon}
            <img src={icon} alt="{label} icon" class="icon" />
        {/if}
        {#if !minimised || !icon}
            <span class="label">{label}</span>
        {/if}
    </a>
</div>