export function slugify(text: string): string {
    const azeToEng: Record<string, string> = {
        'ə': 'e', 'ç': 'c', 'ö': 'o', 'ğ': 'g', 'ş': 's', 'ı': 'i', 'ü': 'u',
        'Ə': 'e', 'Ç': 'c', 'Ö': 'o', 'Ğ': 'g', 'Ş': 's', 'I': 'i', 'Ü': 'u',
    };

    const transliterated = text.split('').map(char => azeToEng[char] || char).join('');

    return transliterated
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w-]+/g, '')        // Remove all non-word chars
        .replace(/--+/g, '-')           // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}
