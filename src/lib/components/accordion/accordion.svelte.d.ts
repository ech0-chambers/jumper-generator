import type { Box, ReadableBoxedValues, WritableBoxedValues } from "../../internal/box.svelte.js";
import type { BitsKeyboardEvent, BitsMouseEvent, WithRefProps } from "../../internal/types.js";
import { type UseRovingFocusReturn } from "../../internal/use-roving-focus.svelte.js";
import type { Orientation } from "../../shared/index.js";
type AccordionBaseStateProps = WithRefProps<ReadableBoxedValues<{
    disabled: boolean;
    orientation: Orientation;
    loop: boolean;
}>>;
type AccordionSingleStateProps = AccordionBaseStateProps & WritableBoxedValues<{
    value: string;
}>;
type AccordionMultiStateProps = AccordionBaseStateProps & WritableBoxedValues<{
    value: string[];
}>;
type AccordionState = AccordionSingleState | AccordionMultiState;
type AccordionItemStateProps = WithRefProps<ReadableBoxedValues<{
    value: string;
    disabled: boolean;
}> & {
    rootState: AccordionState;
}>;
type AccordionTriggerStateProps = WithRefProps<ReadableBoxedValues<{
    disabled: boolean | null | undefined;
}>>;
type AccordionContentStateProps = WithRefProps<ReadableBoxedValues<{
    forceMount: boolean;
}>>;
type AccordionHeaderStateProps = WithRefProps<ReadableBoxedValues<{
    level: 1 | 2 | 3 | 4 | 5 | 6;
}>>;
type InitAccordionProps = WithRefProps<{
    type: "single" | "multiple";
    value: Box<string> | Box<string[]>;
} & ReadableBoxedValues<{
    disabled: boolean;
    orientation: Orientation;
    loop: boolean;
}>>;
declare abstract class AccordionBaseState {
    readonly opts: AccordionBaseStateProps;
    readonly rovingFocusGroup: UseRovingFocusReturn;
    abstract readonly isMulti: boolean;
    constructor(opts: AccordionBaseStateProps);
    abstract includesItem(item: string): boolean;
    abstract toggleItem(item: string): void;
    readonly props: {
        readonly id: string;
        readonly "data-orientation": "horizontal" | "vertical";
        readonly "data-disabled": "" | undefined;
    };
}
export declare class AccordionSingleState extends AccordionBaseState {
    readonly opts: AccordionSingleStateProps;
    readonly isMulti: false;
    constructor(opts: AccordionSingleStateProps);
    includesItem: (item: string) => boolean;
    toggleItem: (item: string) => void;
}
export declare class AccordionMultiState extends AccordionBaseState {
    #private;
    readonly isMulti: true;
    constructor(props: AccordionMultiStateProps);
    includesItem: (item: string) => boolean;
    toggleItem: (item: string) => void;
}
export declare class AccordionItemState {
    readonly opts: AccordionItemStateProps;
    readonly root: AccordionState;
    readonly isActive: boolean;
    readonly isDisabled: boolean;
    constructor(opts: AccordionItemStateProps);
    updateValue: () => void;
    readonly props: {
        readonly id: string;
        readonly "data-state": "open" | "closed";
        readonly "data-disabled": "" | undefined;
        readonly "data-orientation": "horizontal" | "vertical";
    };
}
declare class AccordionTriggerState {
    #private;
    readonly opts: AccordionTriggerStateProps;
    readonly itemState: AccordionItemState;
    constructor(opts: AccordionTriggerStateProps, itemState: AccordionItemState);
    onclick: (e: BitsMouseEvent) => void;
    onkeydown: (e: BitsKeyboardEvent) => void;
    readonly props: {
        readonly id: string;
        readonly disabled: boolean;
        readonly "aria-expanded": "true" | "false";
        readonly "aria-disabled": "true" | "false";
        readonly "data-disabled": "" | undefined;
        readonly "data-state": "open" | "closed";
        readonly "data-orientation": "horizontal" | "vertical";
        readonly tabindex: 0;
        readonly onclick: (e: BitsMouseEvent) => void;
        readonly onkeydown: (e: BitsKeyboardEvent) => void;
    };
}
declare class AccordionContentState {
    #private;
    readonly opts: AccordionContentStateProps;
    readonly item: AccordionItemState;
    readonly present: boolean;
    constructor(opts: AccordionContentStateProps, item: AccordionItemState);
    readonly snippetProps: {
        open: boolean;
    };
    readonly props: {
        readonly id: string;
        readonly "data-state": "open" | "closed";
        readonly "data-disabled": "" | undefined;
        readonly "data-orientation": "horizontal" | "vertical";
        readonly style: {
            readonly "--bits-accordion-content-height": `${number}px`;
            readonly "--bits-accordion-content-width": `${number}px`;
        };
    };
}
declare class AccordionHeaderState {
    readonly opts: AccordionHeaderStateProps;
    readonly item: AccordionItemState;
    constructor(opts: AccordionHeaderStateProps, item: AccordionItemState);
    readonly props: {
        readonly id: string;
        readonly role: "heading";
        readonly "aria-level": 1 | 2 | 3 | 4 | 6 | 5;
        readonly "data-heading-level": 1 | 2 | 3 | 4 | 6 | 5;
        readonly "data-state": "open" | "closed";
        readonly "data-orientation": "horizontal" | "vertical";
    };
}
export declare function useAccordionRoot(props: InitAccordionProps): AccordionState;
export declare function useAccordionItem(props: Omit<AccordionItemStateProps, "rootState">): AccordionItemState;
export declare function useAccordionTrigger(props: AccordionTriggerStateProps): AccordionTriggerState;
export declare function useAccordionContent(props: AccordionContentStateProps): AccordionContentState;
export declare function useAccordionHeader(props: AccordionHeaderStateProps): AccordionHeaderState;
export {};
