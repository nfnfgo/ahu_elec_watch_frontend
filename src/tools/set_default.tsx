/**
 * If the `param` is `undefined`, return `defaultValue`, else return `param`
 */
export function setDefault<ParamType>(param: ParamType | undefined, defaultValue: ParamType): ParamType {
    if (param === undefined) {
        return defaultValue;
    }
    return param;
}