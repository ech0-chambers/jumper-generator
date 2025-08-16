<script>
  import Selector from "./Selector.svelte";
 
  const themes = [
    { value: "nord"},
    { value: "catppuccin"},
    { value: "rose_pine", label: "Rosé Pine" },
    { value: "japanesque"},
    { value: "jellybeans"},
    { value: "tomorrow_eighties"},
    { value: "bluetit_berries"},
    { value: "newcastle"},
    { value: "twilight"},
    { value: "wildcherry"}
  ];

  let {value = $bindable("nord"), small = $bindable(false), open=$bindable(false)} = $props();

</script>
 
<div>
    <Selector 
        options={themes}
        bind:value
        hint="Select a theme"
        icon="palette"
        bind:small = {small}
        bind:open = {open}
        portal_class="theme_portal"
    />
</div>

<style lang="less">
</style>