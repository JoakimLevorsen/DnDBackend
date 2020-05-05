export interface Character {
    ID: number;
    name: string;
    health: number;
    xp: number;
    turnIndex?: number;
    race: string;
    class: string;
    campaign?: string;
}

export const isCharacter = (input: any): input is Character =>
    typeof input === 'object' &&
    Object.entries(input).every(([key, value]) => {
        switch (key) {
            case 'ID':
                return typeof value === 'number';
            case 'name':
                return typeof value === 'string';
            case 'health':
                return typeof value === 'number';
            case 'xp':
                return typeof value === 'number';
            case 'turnIndex':
                return typeof value === 'number';
            case 'race':
                return typeof value === 'string';
            case 'class':
                return typeof value === 'string';
            case 'campaign':
                return typeof value === 'string';
            default:
                return false;
        }
    });

export const isCharacterArray = (input: any): input is Character[] =>
    typeof input === 'object' &&
    input instanceof Array &&
    input.every(v => isCharacter(v));
