<script>
  import { Select } from "bits-ui";
 
  const themes = [
    { value: "nord"},
    { value: "catppuccin"},
    { value: "rose_pine", label: "Rosé Pine" },
    { value: "japanesque"},
    { value: "jellybeans"},
    { value: "tomorrow_eighties"}
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