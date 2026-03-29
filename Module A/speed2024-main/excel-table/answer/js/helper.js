const number2column = number => {
    let alphabet = "";
    while (number > 0) {
        let remainder = (number - 1) % 26;
        alphabet = String.fromCharCode(65 + remainder) + alphabet;
        number = Math.floor((number - 1) / 26);
    }
    return alphabet;
}

const column2number = column => {
    column = column.toUpperCase();
    let number = 0;
    for (let i = 0; i < column.length; i++) {
        let charCode = column.charCodeAt(i) - 64;
        number = number * 26 + charCode;
    }
    return number;
}