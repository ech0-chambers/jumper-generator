<script>
  import { Select } from "bits-ui";

  let {
    options = [],
    value = $bindable(""),
    hint = undefined,
    icon = undefined,
    label = undefined,
    small = $bindable(false),
    vertical = false,
    open = $bindable(false),
    portal_class = undefined,
    beforeValueChange = undefined,
    afterValueChange = undefined
  } = $props();

  //   options: [{ value: string, label?: string }]

  function capitalise(str) {
    let exceptions = [
      "of",
      "the",
      "and",
      "a",
      "an",
      "in",
      "on",
      "at",
      "to",
      "for",
      "with",
    ];

    return str
      .split(" ")
      .map((word) => {
        if (exceptions.includes(word.toLowerCase())) {
          return word.toLowerCase();
        }

        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  }
  function display_name(name) {
    return capitalise(name.replace(/_/g, " "));
  }

  // Should we really do this here, or enforce that options always have a label?

  for (let i = 0; i < options.length; i++) {
    if (typeof options[i] === "string") {
      options[i] = { value: options[i], label: display_name(options[i]) };
    } else if (!options[i].label) {
      options[i].label = display_name(options[i].value);
    }
  }

  // if (value === undefined) {
  //     value = options[0]?.value || "";
  // }

  hint = hint || "Select an option";

  const selectedLabel = $derived(
    value ? options.find((option) => option.value === value)?.label : hint
  );
</script>

<div>
  <div class="selector-container" class:selector-vertical={vertical}>
    {#if label}
      <span class="label">
        {label}
      </span>
    {/if}
    <Select.Root
      type="single"
      onValueChange={(v) => {
        if (beforeValueChange) {beforeValueChange(value, v)}
        value = v;
        if (afterValueChange) {afterValueChange(v)}
    }}
      items={options}
      bind:open={open}
    >
      <Select.Trigger aria-label={hint} class={small ? "small" : ""}>
        {#if icon}
          <span class="material-symbols-outlined">
            {icon}
          </span>
        {/if}
        <span>
          {@html selectedLabel}
        </span>
        <span class="gap"></span>
        <span class="material-symbols-outlined"> arrow_drop_down </span>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content sideOffset={10} class={portal_class ? portal_class : 'selector_portal'}>
          <Select.ScrollUpButton>
            <span class="material-symbols-outlined"> arrow_upward </span>
          </Select.ScrollUpButton>
          <Select.Viewport>
            {#each options as option, i (i + option.value)}
              <Select.Item
                value={option.value}
                label={option.label}
                disabled={option.disabled}
              >
                {#snippet children({ selected })}
                  {option.label}
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
            <span class="material-symbols-outlined"> arrow_downward </span>
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  </div>
</div>

<style lang="less">
  div :global {
    [data-select-trigger] {
      color: var(--clr-foreground);
      border: none;
      // border-radius: var(--border-radius-main);
      border-radius: 0px;
      height: var(--button-height);
      width: var(--input-width-small);
      cursor: pointer;
      padding-block: var(--gap-small);
      background: var(--clr-background);
    .hover-underline(var(--clr-accent3));
      &.small {
        width: fit-content;
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
    .selector-container {
      display: flex;
      flex-direction: row;
      gap: var(--gap-large);
      align-items: center;
      justify-content: flex-start;
      &.selector-vertical {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: var(--gap-small);
      }
    }
  }
  :global {
    [data-select-content] {
      color: var(--clr-foreground);
      width: var(--input-width-small);
      border-radius: 0px;
      padding: var(--gap-small);
        background: var(--clr-background);
        box-shadow: 0.25em 0.25em var(--clr-accent3-5);
        border: 1px solid var(--clr-accent3-5);
        z-index: 100;
    }
    [data-select-item] {
      padding: var(--gap-small);
      border-radius: 0px;
      cursor: pointer;
      margin: var(--gap-medium);
      font-size: var(--font-size-small);
      &[data-highlighted] {
        .hover-underline(var(--clr-accent3));
      }
      &[data-selected] {
        background: var(--clr-accent3-5);
        position: relative;
      }
    }
  }
</style>
