export type Rule = (value: string | undefined) => true | string;

export const requiredRule: Rule = (value: any) => {
    if (value != undefined) {
        return true;
    } else {
        return "This field is required";
    }
};

export function ifPresent(rule: (value: string) => true | string): Rule {
    return (value: string | undefined) => {
        if (value != undefined && value !== "") {
            return rule(value);
        } else {
            return true;
        }
    };
}
