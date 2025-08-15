import { afterTick, attachRef } from "svelte-toolbelt";
import { Context, watch } from "runed";
import { getAriaDisabled, getAriaExpanded, getDataDisabled, getDataOpenClosed, getDataOrientation, } from "../../internal/attrs.js";
import { kbd } from "../../internal/kbd.js";
import { useRovingFocus, } from "../../internal/use-roving-focus.svelte.js";
import { createBitsAttrs } from "../../internal/attrs.js";
const accordionAttrs = createBitsAttrs({
    component: "accordion",
    parts: ["root", "trigger", "content", "item", "header"],
});
// Base class
class AccordionBaseState {
    opts;
    rovingFocusGroup;
    constructor(opts) {
        this.opts = opts;
        this.rovingFocusGroup = useRovingFocus({
            rootNode: this.opts.ref,
            candidateAttr: accordionAttrs.trigger,
            loop: this.opts.loop,
            orientation: this.opts.orientation,
        });
    }
    props = $derived.by(() => ({
        id: this.opts.id.current,
        "data-orientation": getDataOrientation(this.opts.orientation.current),
        "data-disabled": getDataDisabled(this.opts.disabled.current),
        [accordionAttrs.root]: "",
        ...attachRef(this.opts.ref),
    }));
}
// Single accordion
export class AccordionSingleState extends AccordionBaseState {
    opts;
    isMulti = false;
    constructor(opts) {
        super(opts);
        this.opts = opts;
    }
    includesItem = (item) => this.opts.value.current === item;
    toggleItem = (item) => {
        this.opts.value.current = this.includesItem(item) ? "" : item;
    };
}
// Multiple accordion
export class AccordionMultiState extends AccordionBaseState {
    #value;
    isMulti = true;
    constructor(props) {
        super(props);
        this.#value = props.value;
    }
    includesItem = (item) => this.#value.current.includes(item);
    toggleItem = (item) => {
        this.#value.current = this.includesItem(item)
            ? this.#value.current.filter((v) => v !== item)
            : [...this.#value.current, item];
    };
}
// Item state
export class AccordionItemState {
    opts;
    root;
    isActive = $derived.by(() => this.root.includesItem(this.opts.value.current));
    isDisabled = $derived.by(() => this.opts.disabled.current || this.root.opts.disabled.current);
    constructor(opts) {
        this.opts = opts;
        this.root = opts.rootState;
    }
    updateValue = () => {
        this.root.toggleItem(this.opts.value.current);
    };
    props = $derived.by(() => ({
        id: this.opts.id.current,
        "data-state": getDataOpenClosed(this.isActive),
        "data-disabled": getDataDisabled(this.isDisabled),
        "data-orientation": getDataOrientation(this.root.opts.orientation.current),
        [accordionAttrs.item]: "",
        ...attachRef(this.opts.ref),
    }));
}
// Trigger state
class AccordionTriggerState {
    opts;
    itemState;
    #root;
    #isDisabled = $derived.by(() => this.opts.disabled.current ||
        this.itemState.opts.disabled.current ||
        this.#root.opts.disabled.current);
    constructor(opts, itemState) {
        this.opts = opts;
        this.itemState = itemState;
        this.#root = itemState.root;
    }
    onclick = (e) => {
        if (this.#isDisabled || e.button !== 0) {
            e.preventDefault();
            return;
        }
        this.itemState.updateValue();
    };
    onkeydown = (e) => {
        if (this.#isDisabled)
            return;
        if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
            e.preventDefault();
            this.itemState.updateValue();
            return;
        }
        this.#root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
    };
    props = $derived.by(() => ({
        id: this.opts.id.current,
        disabled: this.#isDisabled,
        "aria-expanded": getAriaExpanded(this.itemState.isActive),
        "aria-disabled": getAriaDisabled(this.#isDisabled),
        "data-disabled": getDataDisabled(this.#isDisabled),
        "data-state": getDataOpenClosed(this.itemState.isActive),
        "data-orientation": getDataOrientation(this.#root.opts.orientation.current),
        [accordionAttrs.trigger]: "",
        tabindex: 0,
        onclick: this.onclick,
        onkeydown: this.onkeydown,
        ...attachRef(this.opts.ref),
    }));
}
// Content state with improved animation handling
class AccordionContentState {
    opts;
    item;
    #originalStyles = undefined;
    #isMountAnimationPrevented = false;
    #dimensions = $state({ width: 0, height: 0 });
    present = $derived.by(() => this.opts.forceMount.current || this.item.isActive);
    constructor(opts, item) {
        this.opts = opts;
        this.item = item;
        this.#isMountAnimationPrevented = this.item.isActive;
        // Prevent mount animations on initial render
        $effect(() => {
            const rAF = requestAnimationFrame(() => {
                this.#isMountAnimationPrevented = false;
            });
            return () => cancelAnimationFrame(rAF);
        });
        // Handle dimension updates
        watch([() => this.present, () => this.opts.ref.current], this.#updateDimensions);
    }
    #updateDimensions = ([_, node]) => {
        if (!node)
            return;
        afterTick(() => {
            const element = this.opts.ref.current;
            if (!element)
                return;
            // store original styles on first run
            this.#originalStyles ??= {
                transitionDuration: element.style.transitionDuration,
                animationName: element.style.animationName,
            };
            // temporarily disable animations for measurement
            element.style.transitionDuration = "0s";
            element.style.animationName = "none";
            const rect = element.getBoundingClientRect();
            this.#dimensions = { width: rect.width, height: rect.height };
            // restore animations if not initial mount
            if (!this.#isMountAnimationPrevented && this.#originalStyles) {
                element.style.transitionDuration = this.#originalStyles.transitionDuration;
                element.style.animationName = this.#originalStyles.animationName;
            }
        });
    };
    snippetProps = $derived.by(() => ({ open: this.item.isActive }));
    props = $derived.by(() => ({
        id: this.opts.id.current,
        "data-state": getDataOpenClosed(this.item.isActive),
        "data-disabled": getDataDisabled(this.item.isDisabled),
        "data-orientation": getDataOrientation(this.item.root.opts.orientation.current),
        [accordionAttrs.content]: "",
        style: {
            "--bits-accordion-content-height": `${this.#dimensions.height}px`,
            "--bits-accordion-content-width": `${this.#dimensions.width}px`,
        },
        ...attachRef(this.opts.ref),
    }));
}
// Header state
class AccordionHeaderState {
    opts;
    item;
    constructor(opts, item) {
        this.opts = opts;
        this.item = item;
    }
    props = $derived.by(() => ({
        id: this.opts.id.current,
        role: "heading",
        "aria-level": this.opts.level.current,
        "data-heading-level": this.opts.level.current,
        "data-state": getDataOpenClosed(this.item.isActive),
        "data-orientation": getDataOrientation(this.item.root.opts.orientation.current),
        [accordionAttrs.header]: "",
        ...attachRef(this.opts.ref),
    }));
}
const AccordionRootContext = new Context("Accordion.Root");
const AccordionItemContext = new Context("Accordion.Item");
export function useAccordionRoot(props) {
    const { type, ...rest } = props;
    const rootState = type === "single"
        ? new AccordionSingleState(rest)
        : new AccordionMultiState(rest);
    return AccordionRootContext.set(rootState);
}
export function useAccordionItem(props) {
    const rootState = AccordionRootContext.get();
    return AccordionItemContext.set(new AccordionItemState({ ...props, rootState }));
}
export function useAccordionTrigger(props) {
    return new AccordionTriggerState(props, AccordionItemContext.get());
}
export function useAccordionContent(props) {
    return new AccordionContentState(props, AccordionItemContext.get());
}
export function useAccordionHeader(props) {
    return new AccordionHeaderState(props, AccordionItemContext.get());
}
