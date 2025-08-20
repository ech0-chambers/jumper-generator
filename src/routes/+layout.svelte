<script>
  import { page } from "$app/state";
  import { base } from "$app/paths";
  import DarkModeToggle from "$lib/components/DarkModeToggle.svelte";
  import ThemeSelect from "$lib/components/ThemeSelect.svelte";
  import FullScreenButton from "$lib/components/FullScreenButton.svelte";
  import NavButton from "$lib/components/NavButton.svelte";
  import { Button, Separator } from "bits-ui";
  import { slide } from "svelte/transition";
  import { appState, load_state_cookie } from "$lib/jumper.svelte.js";

  import { navigating } from "$app/stores";

  let schemes = [
    "nord",
    {
      name: "rose_pine",
      display: "Ros&eacute; Pine",
    },
    { name: "catppuccin", display: "Catppuccin" },
    "japanesque",
    "jellybeans",
    "tomorrow_eighties",
  ];

  let { children } = $props();
  let scheme = $state({ name: "nord", dark: false });

  let pages = [
    { href: "/", label: "Measurements", icon: "design_services" },
    { href: "/front", label: "Front", icon: "flip_to_front" },
    { href: "/back", label: "Back", icon: "flip_to_back" },
    { href: "/sleeves", label: "Sleeves", icon: "ulna_radius_alt" },
    { href: "/neckband", label: "Neckband", icon: "apparel" },
  ];
  import { onNavigate } from "$app/navigation";
  import { onMount } from "svelte";

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });

  let small = $state(false);
  $effect(() => {
    small =
      window &&
      window.innerWidth < 0.6 * window.screen.width * window.devicePixelRatio;
  });
  onMount(() => {
    window.addEventListener("resize", () => {
      small =
        window &&
        window.innerWidth < 0.6 * window.screen.width * window.devicePixelRatio;
    });
  });

  function use_mobile_layout() {
    if (!window) return false;
    if (window.innerWidth < 600) return true;
    if (/Android|iPhone/i.test(navigator.userAgent)) {
      return true;
    }
    return false;
  }

  $effect(() => {
    document
      .getElementsByTagName("body")[0]
      .classList.toggle("mobile", appState.mobile);
  });
  onMount(() => {
    window.addEventListener("resize", () => {
      appState.mobile = use_mobile_layout();
    });
    appState.mobile = use_mobile_layout();
  });

  let sidebar_collapsed = $state(true);

  function toggleSidebar() {
    sidebar_collapsed = !sidebar_collapsed;
  }

  $effect(() => {
    if ($navigating) {
        setTimeout(
            () => {
                sidebar_collapsed = true;
            }, 
        300);
    }
  });

  let theme_select_open = $state(false);

  function collapse_sidebar_if_needed(event) {
    if (!appState.mobile || sidebar_collapsed) {
        return;
    }
    let pos = {x: event.x, y: event.y};
    let sidebar = document.getElementById('sidebar');
    let sidebar_bounds = sidebar.getBoundingClientRect();
    // we can cheat since the sidebar will always be from x=0 and cover all y
    if (pos.x <= sidebar_bounds.width) {
        // we clicked inside the sidebar. Do nothing
    } else {
        // we clicked outside the sidebar. Collapse, unless the theme selector is open and we clicked in that.
        // console.log(theme_select_open);
        // if (theme_select_open) {
        //     let theme_portal = document.getElementsByClassName('theme_portal')[0];
        //     if (!theme_portal) {
        //         sidebar_collapsed = true;
        //         return;
        //     }
        //     let theme_portal_bounds = theme_portal.getBoundingClientRect();
        //     console.log(pos, {left:theme_portal_bounds.left, right: theme_portal_bounds.right, top: theme_portal_bounds.top, bottom: theme_portal_bounds.bottom});
        //     if (pos.x < theme_portal_bounds.left || pos.x > theme_portal_bounds.right || pos.y < theme_portal_bounds.top || pos.y > theme_portal_bounds.bottom) {
        //         sidebar_collapsed = true;
        //         // theme_select_open = false;
        //         return;
        //     }
        // } else {
            sidebar_collapsed = true;
        // }
    }
  }

  onMount(() => {
    load_state_cookie();
  });
</script>

<svelte:body onclick={collapse_sidebar_if_needed} />

{#if appState.mobile}


  <div>
    <div
      id="sidebar"
      class:open={!sidebar_collapsed}
      transition:slide={{ axis: "x" }}
      onblur={() => {
        if (sidebar_collapsed) return;
        // check the current cursor position. Are we within the sidebar?
        const rect = document.getElementById("sidebar").getBoundingClientRect();
        const x = event.clientX;
        const y = event.clientY;
        if (
          x >= rect.left &&
          x <= rect.right &&
          y >= rect.top &&
          y <= rect.bottom
        ) {
          // cursor is within the sidebar, do not collapse
          return;
        }
        // cursor is outside the sidebar, collapse it
        sidebar_collapsed = true;
      }}
    >
      <button id="burger" onclick={toggleSidebar}>
        {#if sidebar_collapsed}
          <span class="material-symbols-outlined">menu</span>
        {:else}
          <span class="material-symbols-outlined">close</span>
        {/if}
      </button>
      <div class="navigation" class:small>
        {#each pages as page, i}
          <NavButton
            href="{base}{page.href}"
            label={page.label ? page.label : page.href.substring(1)}
            icon={page.icon}
            bind:small={sidebar_collapsed}
          />
        {/each}
      </div>
      <span class="separator"></span>
      <div class="theming">
        <DarkModeToggle bind:darkMode={appState.dark}></DarkModeToggle>
        {#if !sidebar_collapsed}
          <ThemeSelect bind:value={appState.theme} bind:small={appState.mobile} bind:open={theme_select_open}
          ></ThemeSelect>
        {/if}
      </div>
    </div>
  </div>
{:else}
  <div id="topbar" class:small transition:slide={{ axis: "x" }}>
    <div class="navigation" class:small>
      {#each pages as page, i}
        <NavButton
          href="{base}{page.href}"
          label={page.label ? page.label : page.href.substring(1)}
          icon={page.icon}
          bind:small
        />
        {#if i < pages.length - 1}
          <Separator.Root orientation="vertical" />
        {/if}
      {/each}
    </div>
    <div class="theming">
      <DarkModeToggle bind:darkMode={appState.dark}></DarkModeToggle>
      <ThemeSelect bind:value={appState.theme} bind:small bind:open={theme_select_open}></ThemeSelect>
    </div>
  </div>
{/if}

<FullScreenButton />

<div id="content" class:mobile={appState.mobile}>
  <div>
    {@render children()}
  </div>
</div>

<svelte:head>
  <link
    rel="stylesheet"
    type="text/css"
    href="themes/{appState.theme}_{appState.dark ? 'dark' : 'light'}.css"
  />
</svelte:head>

<style lang="less">
  @media (prefers-reduced-motion) {
    ::view-transition-group(*),
    ::view-transition-old(*),
    ::view-transition-new(*) {
      animation: none !important;
    }
  }

  div :global {
    div#sidebar {
      z-index: 99;
      view-transition-name: header;
      background: var(--clr-accent1);
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 2.5em;
      &:not(.open) {
        max-width: 20ch;
      }
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: start;
      gap: var(--gap-medium);
      padding: 0.25em;
      & span.separator {
        flex-grow: 1;
      }
      &.open {
        width: 80vw;
        max-width: 3in;
      }
      & button#burger {
        background: none;
        border: none;
        outline: none;
        color: var(--clr-background);
        margin-top: 1ch;
      }
      & .navigation {
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: var(--gap-small);
        width: 100%;
        align-self: center;
      }
      & a.navbutton {
        text-align: left;
        overflow-x: hidden;
        text-wrap: nowrap;
        text-decoration: none;
        font-weight: var(--font-weight-bold);
        color: var(--clr-background);
        border-left-width: 2px;
        border-left-style: solid;
        border-left-color: transparent;
        border-right-width: 2px;
        border-right-style: solid;
        border-right-color: transparent;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: var(--gap-small);
        padding-left: 0.25em;
        padding-right: 0.5em;
        &[enabled="true"] {
          &:focus,
          &:focus-within,
          &:hover {
            border-left-color: var(--clr-background);
            border-right-color: var(--clr-background);
          }
        }
        &.current-page {
          border-left-color: var(--clr-background);
          border-right-color: var(--clr-background);
        }
      }
    }
  }

  #topbar {
    view-transition-name: header;
    background: var(--clr-accent1);
    position: sticky;
    margin-block: 1em;
    top: 1em;
    margin-inline-end: 3em;
    padding-inline: 1em;
    padding-block: 0.5em;
    color: var(--clr-background);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-medium);
    &.small {
      background: var(--clr-red);
    }
  }

  div.theming {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: end;
    gap: var(--gap-medium);
    width: 100%;
    padding-right: 0.25em;
    box-sizing: border-box;
  }

  #sidebar div.theming {
    justify-content: space-between;
  }

  #topbar div.navigation {
    display: flex;
    flex-direction: row;
    align-items: center;
    // flex-wrap: wrap;
    gap: var(--gap-medium);
    &.small {
      gap: var(--gap-small);
    }
  }

  #topbar :global {
    a.navbutton {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: var(--gap-small);
      padding-block: var(--gap-small);
      color: var(--clr-background);
      text-decoration: none;
      font-weight: var(--font-weight-bold);
      .hover-underline(var(--clr-background));
      &.current-page {
        &::after {
          width: 100%;
        }
      }
    }
    [data-separator-root] {
      height: 2em;
      width: 1px;
      background-color: var(--clr-background);
    }
  }
  #content {
    // width: 100%;
    // margin-bottom: 50vh;
    height: 80vh;
    overflow-y: auto;
    &:not(.mobile) > div {
      max-width: 14in;
      margin: auto;
      width: 90vw;
      padding-block-end: 20vh;
    }
    &.mobile {
      height: 100%;
      //     overflow-y: auto;
      margin-inline-start: 6ch;
      margin-inline-end: 2ch;
      padding-block-end: 20vh;
    }
  }

  :global {
    ::-webkit-scrollbar {
      width: 15px;
    }

    ::-webkit-scrollbar-thumb {
      background: var(--clr-accent1-4);
      border-radius: 0;
      transition: background-color 0.3s;
      &:hover {
        background-color: var(--clr-accent1-3);
        box-shadow: inset var(--shadow-small-size) var(--clr-accent1);
      }
    }

    ::-webkit-scrollbar-track {
      background: var(--clr-background-5);
      border-radius: 0;
      box-shadow: inset var(--shadow-small-size) var(--clr-background-3);
    // box-shadow: 0.125em 0.125em var(--clr-background-4);
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
  }

  @keyframes fade-out {
    to {
      opacity: 0;
    }
  }

  @keyframes slide-from-right {
    from {
      transform: translateX(30px);
    }
  }

  @keyframes slide-to-left {
    to {
      transform: translateX(-30px);
    }
  }

  :root::view-transition-old(root) {
    animation:
      90ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
      300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
  }

  :root::view-transition-new(root) {
    animation:
      210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
      300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
  }
</style>
