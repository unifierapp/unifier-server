import {BadArgumentError} from "@/utils/errors";
import multer, {} from "multer";

export function forceString(arg: any): string {
    if (typeof arg !== 'string') {
        throw new BadArgumentError("This argument must be a string.");
    }
    return arg;
}


export function forceNonEmptyString(arg: any): string {
    if (typeof arg !== 'string' || !arg) {
        throw new BadArgumentError("This argument must be a nonempty string.");
    }
    return arg;
}

export function forceOptionalString(arg: any): string | undefined {
    const msg = "This argument must be a string or undefined.";
    if (typeof arg === 'string') {
        return arg;
    }
    if (typeof arg !== 'undefined') {
        throw new BadArgumentError(msg);
    }
    return arg;
}

export function forceOptionalNonEmptyString(arg: any): string | undefined {
    const msg = "This argument must be a nonempty string or undefined.";
    if (typeof arg === 'string') {
        if (!arg) {
            throw new BadArgumentError(msg);
        }
        return arg;
    }
    if (typeof arg !== 'undefined') {
        throw new BadArgumentError(msg);
    }
    return arg;
}

export function forceDate(arg: any): Date {
    if (!(arg instanceof Date)) {
        throw new BadArgumentError("This argument must be a string.");
    }
    return arg;
}

export function forceOptionalDate(arg: any): Date | undefined {
    if (typeof arg !== 'undefined' && !(arg instanceof Date)) {
        throw new BadArgumentError("This argument must be a string.");
    }
    return arg;
}

export function forceOptionalFile(arg: any): Express.Multer.File | undefined {
    if (typeof arg !== 'undefined' && !(arg instanceof multer)) {
        throw new BadArgumentError("This argument must be a string.");
    }
    return arg;
}

