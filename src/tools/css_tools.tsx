

/// Use to combine css class properties string
export function classNames(...classes: (string | null)[]): string {
    return classes.filter(Boolean).join(' ');
}