declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    property: {
        type: ObjectConstructor;
        required: true;
    };
    showOwnerActions: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    delete: (...args: any[]) => void;
    edit: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    property: {
        type: ObjectConstructor;
        required: true;
    };
    showOwnerActions: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{
    onDelete?: ((...args: any[]) => any) | undefined;
    onEdit?: ((...args: any[]) => any) | undefined;
}>, {
    showOwnerActions: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
