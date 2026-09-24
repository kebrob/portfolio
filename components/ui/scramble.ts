const RANDOM_CHARS = ["!", '"', "*", "/", "\\", ":", "(", ")", "?", ";", "-"];

export interface InvertBox {
    backgroundColor?: string;
    textColor?: string;
}

function getRandomChar() {
    return RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)];
}

/** Spaces render as non-breaking so they keep their width while characters are swapped. */
export function displayChar(char: string) {
    return char === " " ? "\u00A0" : char;
}

export function mapRange(
    value: number,
    fromLow: number,
    fromHigh: number,
    toLow: number,
    toHigh: number
) {
    if (fromLow === fromHigh) return toLow;
    const percentage = (value - fromLow) / (fromHigh - fromLow);
    return toLow + percentage * (toHigh - toLow);
}

export function highlightChar(el: HTMLSpanElement, invertBox: InvertBox) {
    el.style.backgroundColor = invertBox.backgroundColor || "#000";
    el.style.color = invertBox.textColor || "#fff";
    el.textContent = getRandomChar();
}

export function restoreChar(el: HTMLSpanElement, original: string) {
    el.style.backgroundColor = "";
    el.style.color = "";
    el.textContent = displayChar(original);
}
