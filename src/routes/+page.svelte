<script>
  import Help from "$lib/components/Help.svelte";

  import {
    measurements,
    update_derived,
    appState,
    convert_units,
    save_state_cookie,
    load_state_cookie,
    reset_measurements,
    reset_settings,
  } from "$lib/jumper.svelte.js";
  import { Coordinate, X, Y, BezierCubic } from "$lib/geometry.js";
  import Card from "$lib/components/Card.svelte";
  import Selector from "$lib/components/Selector.svelte";
  import { Separator, AlertDialog } from "bits-ui";
  import Confirm from "$lib/components/Confirm.svelte";

  let units = {
    in: {
      name: "inch",
      plural: "inches",
      symbol: "in",
      inverse: "/in",
    },
    cm: {
      name: "centimeter",
      plural: "centimeters",
      symbol: "cm",
      inverse: "/cm",
    },
  };
  //   let selectedUnit = "in";
  // let selectedUnit;
  let unit_options = Object.keys(units).map((unit) => ({
    value: unit,
    label:
      units[unit].plural.substring(0, 1).toUpperCase() +
      units[unit].plural.substring(1),
  }));

  let neckband_types = [
    { value: "rib", label: "Ribbing" },
    { value: "folded", label: "Folded" },
    { value: "plain", label: "Plain" },
  ];

  let neckline_types = [
    { value: "round", label: "Round" },
    { value: "v-neck", label: "V-Neck" },
    { value: "boat-neck", label: "Boat Neck" },
    { value: "square-neck", label: "Square Neck" },
  ];

  let settings_fields = [
    {
      id: "st-per-inch",
      label: "Stitches per ~unit~",
      value: "st_per_inch",
      tooltip: "Number of stitches per ~unit~.",
      inverse: true,
    },
    {
      id: "row-per-inch",
      label: "Rows per ~unit~ (main)",
      value: "row_per_inch",
      tooltip: "Number of rows per ~unit~.",
      inverse: true,
    },
    {
      id: "row-per-inch-rib",
      label: "Rows per ~unit~ (ribbing)",
      value: "row_per_inch_rib",
      tooltip: "Number of rows per ~unit~ for ribbing.",
      inverse: true,
    },
  ];
  let measurement_fields = [
    {
      id: "W",
      label: "Body width",
      value: "W",
      tooltip:
        "Measure around the body at the widest point (bust, waist or hips for longer jumpers), then halve the measurement.",
    },
    {
      id: "H",
      label: "Body length",
      value: "H",
      tooltip:
        "Measure from the top of the shoulder to the desired length of the garment, including ribbing.",
    },
    {
      id: "H-rib",
      label: "Ribbing height",
      value: "H_rib",
      tooltip: "Height of the ribbing at the end of the sleeve and body.",
    },
    {
      id: "W-s",
      label: "Shoulder width",
      value: "W_s",
      tooltip: "Measure from shoulder tip to shoulder tip across the back.",
    },
    {
      id: "H-sl",
      label: "Sleeve length",
      value: "H_sl",
      tooltip: "Measure from the top of the shoulder to the wrist.",
    },
    {
      id: "W-sl",
      label: "Bicep circumference",
      value: "W_sl",
      tooltip: "Measure around the widest part of the upper arm.",
    },
    {
      id: "W-w",
      label: "Wrist circumference",
      value: "W_w",
      tooltip: "Measure around the wrist.",
    },
    {
      id: "A-c",
      label: "Armhole circumference",
      value: "A_c",
      tooltip:
        "Measure from the top of the shoulder, under the arm, and back to the top of the shoulder.",
    },
    {
      id: "W-n",
      label: "Neckline width",
      value: "W_n",
      tooltip:
        "Measure across the back of the neck at the base. This may be easier to measure on an existing garment.",
    },
    {
      id: "H-n",
      label: "Neckline depth (front)",
      value: "H_n",
      tooltip:
        "Measure from the top of the shoulder to the point level with the lowest point of the front neckline. This may be easier to measure on an existing garment.",
    },
    {
      id: "H-nb",
      label: "Neckline depth (back)",
      value: "H_nb",
      tooltip:
        "Measure from the top of the shoulder to the point level with the lowest point of the back neckline. This may be easier to measure on an existing garment.",
    },
    {
      id: "W_nb",
      label: "Neckband width",
      value: "neckband_width",
      tooltip: "Width of the finished neckband.",
    },
    {
      id: "ease",
      label: "Ease",
      value: "ease",
      tooltip:
        "The amount of ease to add to certain key dimensions. 0 ease means the garment will be exactly the size of your measurements. A value of 1 or 2 inches is common for a comfortable fit.",
    },
  ];

  let first_load = $state(true);

  $effect(() => {
    // save state cookie on change
    if (first_load) {
      first_load = false;
      return;
    } // Don't save state on first load as we're about to load it from the cookie
    save_state_cookie();
  });
</script>

<h2 class:mobile={appState.mobile}>Measurements</h2>

<div>
  <div class="measurements-container">
    <Card title="Settings">
      <div id="settings">
        {#if appState.mobile}
          <Selector
            id="unit"
            bind:value={measurements.unit}
            options={unit_options}
            hint="Select unit"
            icon="straighten"
            label="Units"
            vertical={true}
            small={true}
            beforeValueChange={(oldV, newV) => {
              if (oldV == newV) {
                return;
              }
              convert_units(newV);
            }}
          />
          <Separator.Root />
          <Selector
            id="neckline-type"
            bind:value={measurements.neckline}
            options={neckline_types}
            hint="Select neckline shape"
            icon="apparel"
            label="Neckline Shape"
            vertical={true}
            small={true}
          />
          <Separator.Root />
          <Selector
            id="neckband-type"
            bind:value={measurements.neckband}
            options={neckband_types}
            hint="Select neckband type"
            icon="apparel"
            label="Neckband Type"
            vertical={true}
            small={true}
          />
          <Separator.Root />
          {#each settings_fields as field, i}
            <div class="field-container mobile">
              <label for={field.id}
                >{field.label.replace(
                  "~unit~",
                  units[measurements.unit].name
                )}</label
              >
              {#if field.tooltip}
                <Help
                  tooltip={field.tooltip.replace(
                    "~unit~",
                    units[measurements.unit].name
                  )}
                />
              {:else}
                <span></span>
              {/if}
              <input
                type="number"
                id={field.id}
                bind:value={measurements[field.value]}
                onchange={update_derived}
                class="mobile"
              />
              <span class="unit">
                {field.after
                  ? field.after
                  : field.inverse
                    ? units[measurements.unit].inverse
                    : units[measurements.unit].symbol}
              </span>
            </div>
            {#if i < settings_fields.length - 1}
              <Separator.Root />
            {/if}
          {/each}
        {:else}
          <Selector
            id="unit"
            bind:value={measurements.unit}
            options={unit_options}
            hint="Select unit"
            icon="straighten"
            label="Units"
            beforeValueChange={(oldV, newV) => {
              if (oldV == newV) {
                return;
              }
              convert_units(newV);
            }}
          />
          <Selector
            id="neckline-type"
            bind:value={measurements.neckline}
            options={neckline_types}
            hint="Select neckline shape"
            icon="apparel"
            label="Neckline Shape"
          />
          <Selector
            id="neckband-type"
            bind:value={measurements.neckband}
            options={neckband_types}
            hint="Select neckband type"
            icon="apparel"
            label="Neckband Type"
          />
          {#each settings_fields as field}
            <div class="field-container">
              <label for={field.id}
                >{field.label.replace(
                  "~unit~",
                  units[measurements.unit].name
                )}</label
              >
              <input
                type="number"
                id={field.id}
                bind:value={measurements[field.value]}
                onchange={update_derived}
              />
              <span class="unit">
                {field.after
                  ? field.after
                  : field.inverse
                    ? units[measurements.unit].inverse
                    : units[measurements.unit].symbol}
              </span>
              {#if field.tooltip}
                <Help
                  tooltip={field.tooltip.replace(
                    "~unit~",
                    units[measurements.unit].name
                  )}
                />
              {:else}
                <span></span>
              {/if}
            </div>
          {/each}
        {/if}
        <Confirm
          icon="reset_settings"
          label="Reset Settings"
          title="Are You Sure?"
          description="Are you sure you want to reset all settings? This action cannot be undone."
          cancel_label="Cancel"
          confirm_label="Reset"
          on_confirm={() => {
            reset_settings();
          }}
        />
      </div>
    </Card>
    <Card title="Measurements">
      <div id="measurements" class:mobile={appState.mobile}>
        {#if appState.mobile}
          <!-- <p>Mobile</p> -->
          {#each measurement_fields as field, i}
            <div class="field-container">
              <label for={field.id}
                >{field.label.replace(
                  "~unit~",
                  units[measurements.unit].name
                )}</label
              >
              {#if field.tooltip}
                <Help
                  tooltip={field.tooltip.replace(
                    "~unit~",
                    units[measurements.unit].name
                  )}
                />
              {:else}
                <span></span>
              {/if}
              <input
                type="number"
                id={field.id}
                bind:value={measurements[field.value]}
                onchange={update_derived}
                class="mobile"
              />
              <span class="unit">
                {field.after
                  ? field.after
                  : field.inverse
                    ? units[measurements.unit].inverse
                    : units[measurements.unit].symbol}
              </span>
            </div>
            {#if i < measurement_fields.length - 1}
              <Separator.Root />
            {/if}
          {/each}
        {:else}
          {#each measurement_fields as field}
            <label for={field.id}
              >{field.label.replace(
                "~unit~",
                units[measurements.unit].name
              )}</label
            >
            <input
              type="number"
              id={field.id}
              bind:value={measurements[field.value]}
              onchange={update_derived}
            />
            <span class="unit">
              {field.after
                ? field.after
                : field.inverse
                  ? units[measurements.unit].inverse
                  : units[measurements.unit].symbol}
            </span>
            {#if field.tooltip}
              <Help
                tooltip={field.tooltip.replace(
                  "~unit~",
                  units[measurements.unit].name
                )}
              />
            {:else}
              <span></span>
            {/if}
          {/each}
        {/if}
      </div>

      <Confirm
        icon="reset_settings"
        label="Reset Measurements"
        title="Are You Sure?"
        description="Are you sure you want to reset all measurements? This action cannot be undone."
        cancel_label="Cancel"
        confirm_label="Reset"
        on_confirm={() => {
          reset_measurements();
        }}
      />
    </Card>
  </div>
</div>

<style lang="less">
  div :global {
    div.measurements-container {
      display: flex;
      flex-direction: row;
      align-items: stretch;
      justify-content: space-around;
      gap: 3em;
      flex-wrap: wrap;
    }

    div#measurements:not(.mobile) {
      display: grid;
      grid-template-columns: 25ch 7ch 7ch 5ch;
      gap: var(--gap-medium);
      align-items: center;
      margin-bottom: var(--gap-medium);
    }
    div#measurements.mobile {
      display: flex;
      flex-direction: column;
      gap: var(--gap-medium);
      & .field-container {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: var(--gap-small);
        align-items: start;
      }
      margin-bottom: var(--gap-medium);
    }
    div#settings {
      display: flex;
      flex-direction: column;
      gap: var(--gap-medium);
      & .selector-container:not(.selector-vertical) {
        display: grid;
        grid-template-columns: 25ch 1fr;
        gap: var(--gap-medium);
      }
      & .field-container:not(.mobile) {
        display: grid;
        grid-template-columns: 25ch 7ch 7ch 5ch;
        gap: var(--gap-medium);
        align-items: center;
      }
      & .field-container.mobile {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: var(--gap-small);
        align-items: start;
      }
    }
    input {
      border-radius: 0px;
      border: none;
      background: var(--clr-background);
      padding: 0.5em;
      color: var(--clr-foreground);
      font-size: var(--font-size-small);
      &.mobile {
        width: 10ch;
      }
      &:hover {
        background: var(--clr-background-3);
      }
      &:focus,
      &:focus-within,
      &:active,
      &:focus-visible {
        background: var(--clr-background-3);
        outline: none;
        box-shadow: var(--shadow-inset-small);
      }
    }
    .card {
      width: fit-content;
      box-sizing: border-box;
      //   flex: 1;
    }

    [data-separator-root] {
      width: 80%;
      height: 0;
      border-bottom: 1px solid var(--clr-foreground-5);
      margin-inline: auto;
    }
  }
</style>
