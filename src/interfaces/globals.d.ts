/**
 * Convert union type to intersection type. [Doc](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types)
 */
export {};

declare global {
    type ConstValue<T> = T extends Record<string | number | symbol, infer U> ? U : never;
    type ConstKey<T> = T extends Record<string | number | symbol, any> ? keyof T : never;
    type TypeMapObject<Properties extends string, TypeValue> = {
        readonly [P in Properties]: TypeValue;
    };
}
