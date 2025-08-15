<script>
  import { Select } from "bits-ui";
 
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

  function capitalise(str) {
        let exceptions = [
            'of',
            'the',
            'and',
            'a',
            'an',
            'in',
            'on',
            'at',
            'to',
            'for',
            'with'
        ];

        return str.split(' ').map((word) => {
            if (exceptions.includes(word.toLowerCase())) {
                return word.toLowerCase();
            }

            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join(' ');
    }
    function display_name(name) {
        return capitalise(name.replace(/_/g, ' '));
    }

  for (let i = 0; i < themes.length; i++) {
    if (typeof themes[i] === 'string') {
      themes[i] = { value: themes[i], label: display_name(themes[i]) };
    } else if (!themes[i].label) {
      themes[i].label = display_name(themes[i].value);
    }
  }
 
  // let value = $state<string>("");
  let {value = $bindable("nord")} = $props();
  const selectedLabel = $derived(
    value
      ? themes.find((theme) => theme.value === value)?.label
      : "Select a theme"
  );
</script>
 
<div>
<Select.Root type="single" onValueChange={(v) => (value = v)} items={themes}>
  <Select.Trigger
    aria-label="Select a theme"
  >
    <span class="material-symbols-outlined">
        palette
    </span>
    <span>
    {@html selectedLabel}
    </span>
    <span class="gap"></span>
    <span class="material-symbols-outlined">
      arrow_drop_down
    </span>
  </Select.Trigger>
  <Select.Portal>
    <Select.Content
      sideOffset={10}
    >
      <Select.ScrollUpButton>
        <!-- <CaretDoubleUp class="size-3" /> -->
      </Select.ScrollUpButton>
      <Select.Viewport>
        {#each themes as theme, i (i + theme.value)}
          <Select.Item
            value={theme.value}
            label={theme.label}
            disabled={theme.disabled}
          >
            {#snippet children({ selected })}
              {theme.label}
              {#if selected}
                <div>
                  <!-- <Check aria-label="check" /> -->
                </div>
              {/if}
            {/snippet}
          </Select.Item>
        {/each}
      </Select.Viewport>
      <Select.ScrollDownButton>
        <!-- <CaretDoubleDown class="size-3" /> -->
      </Select.ScrollDownButton>
    </Select.Content>
  </Select.Portal>
</Select.Root>
</div>

<style lang="less">
    div :global {
        [data-select-trigger] {
        color: var(--clr-foreground);
        border: none;
        border-radius: var(--border-radius-main);
        height: var(--button-height);
        width: var(--input-width-small);
        cursor: pointer;
        padding-block: var(--gap-small);
        .raised();
        &:focus, 
        &:focus-within,
        &:hover {
            .raised-2();
        }
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: var(--gap-small);
    }
    span.gap {
        flex-grow: 1;
    }
}
:global {
    [data-select-content] {
        color: var(--clr-foreground);
        width: var(--input-width-small);
        border-radius: var(--border-radius-main);
        padding: var(--gap-small);
        z-index: 1000;
        .raised();
    }
    [data-select-item] {
        padding: var(--gap-small);
        border-radius: var(--border-radius-main);
        cursor: pointer;
        margin: var(--gap-medium);
        &[data-highlighted] {
            .raised-4();
        }
        &[data-selected] {
            .depressed();
        }
    }
}
</style>