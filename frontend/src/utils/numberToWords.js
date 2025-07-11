// utils/numberToWords.ts
export const numberToWords = (n) => {
    console.log(n)
    if (n === 0) return "zero";

    const belowTwenty = [
        "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
        "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
        "seventeen", "eighteen", "nineteen"
    ];
    const tens = [
        "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"
    ];

    const toWords = (num) => {
        if (num < 20) return belowTwenty[num];
        if (num < 100) {
            return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? "-" + belowTwenty[num % 10] : "");
        }
        if (num < 1000) {
            return (
                belowTwenty[Math.floor(num / 100)] +
                " hundred" +
                (num % 100 !== 0 ? " and " + toWords(num % 100) : "")
            );
        }
        if (num < 1000000) {
            return (
                toWords(Math.floor(num / 1000)) +
                " thousand" +
                (num % 1000 !== 0 ? " " + toWords(num % 1000) : "")
            );
        }
        return num.toString(); // fallback for very large numbers
    };

    return toWords(n);
}
  