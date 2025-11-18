declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    isVisible: BooleanConstructor;
    title: StringConstructor;
    options: () => string[];
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: (...args: any[]) => void;
    select: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    isVisible: BooleanConstructor;
    title: StringConstructor;
    options: () => string[];
}>> & Readonly<{
    onClose?: ((...args: any[]) => any) | undefined;
    onSelect?: ((...args: any[]) => any) | undefined;
}>, {
    isVisible: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
