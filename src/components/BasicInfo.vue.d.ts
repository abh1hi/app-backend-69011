declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    initialData: {
        type: ObjectConstructor;
        default: () => {};
    };
    isEditMode: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    update: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    initialData: {
        type: ObjectConstructor;
        default: () => {};
    };
    isEditMode: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{
    onUpdate?: ((...args: any[]) => any) | undefined;
}>, {
    initialData: Record<string, any>;
    isEditMode: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
