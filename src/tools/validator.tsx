// Some data field validator

/**
 * For validators, return exceptions message if there is an exceptions in the data, else return undefined
 */

/**
 * Email field validator
 */
export function emailValidator(data: string): string | undefined {
    // no empty
    if (data === '' || data === undefined) {
        return 'this field can not be empty';
    }

    // email regex
    let emailRegex = new RegExp(/(?<email>^[\w\-\.]+@(?<domain>([\w-]+\.)*(?<rootDomain>([\w-]+\.)[\w\-]+))$)/, 'gm');
    let res = emailRegex.test(data);
    if (res === false) {
        return 'invalid email addresss';
    }

    return undefined;
}

/**
 * Validator for password
 */
export function passwordSecurityValidator(password: string): string | undefined {
    // no empty
    if (password === '' || password === undefined) {
        return 'password can not be empty';
    }

    // check length
    if (password.length < 6) {
        return 'password must contains at least 6 digits';
    }

    return undefined;
}