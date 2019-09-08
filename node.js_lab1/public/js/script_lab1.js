const numberFormat = new Intl.NumberFormat({			//объект для форматирования чисел
    style: "decimal",
    minimumFractionDigits: 4
});

/*
    if (...) {...} else {...}
*/
let x = floatInput("x");
let y = floatInput("y");
let z = floatInput("z");
if (x > y) {
    let answer = Math.pow(y, x) + 3 * z;
    console.log("A = " + numberFormat.format(answer));
}
else {
    let answer = Math.pow(Math.E, Math.abs(y - x)) + x / 2;
    console.log("B = " + numberFormat.format(answer));
}
    
/*
    Функция для проверки корректности ввода числа с плавающей запятой
    Параметры:
    argName - отображаемое пользователю имя аргумента.
    Возвращает:
    число с плавающей запятой.
*/
function floatInput(argName) {
    let number = prompt("Введите " + argName);
    while (isNaN(number)) {
        number = prompt("Ошибка: задано неверное значение для параметра '" + argName +
        "'.\r\nВведите число");
    }
    return parseFloat(number);
}