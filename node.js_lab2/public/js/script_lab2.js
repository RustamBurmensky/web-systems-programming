const numberFormat = new Intl.NumberFormat({			//объект для форматирования чисел
    style: "decimal",
    minimumFractionDigits: 4
});

/*
    for (...) {...}
*/
let a = floatInput("a");
let b = floatInput("b");
let values = [];
const ELEMENTS_COUNT = 5;
for (let i = 0; i < ELEMENTS_COUNT; i++) {
    values.push(floatInput("x" + (i + 1)));
}
for (let i = 0; i < values.length; i++) {
    if (!checkFunctionArgument(values[i], b)) break;
    let result = (a * Math.pow(Math.log(values[i]), 2)) / (b + Math.sqrt(values[i]));
    console.log("x = " + values[i] + "; y = " + numberFormat.format(result));
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

/*
    Функция для проверки допустимости аргументов арифметического выражения
    y = (a * Math.pow(Math.ln(x), 2)) / (b + Math.sqrt(x))
    Параметры:
    arg - аргумент x арифметического выражения,
    b - параметр b в знаменателе выражения.
    Возвращает:
    аргумент допустим - булево значение true,
    аргумент недопустим - булево значение false.
*/
function checkFunctionArgument(arg, b) {
    let result = true;
    if (arg <= 0 || (b + Math.sqrt(arg)) == 0) {
        result = false;
        console.log((arg <= 0) ?
        "Ошибка: аргумент натурального логарифма не является положительным числом." :
        "Ошибка: деление на ноль.");
    }
    return result;
}