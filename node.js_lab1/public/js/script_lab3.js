const numberFormat = new Intl.NumberFormat({			//объект для форматирования чисел
    style: "decimal",
    minimumFractionDigits: 4
});

/*
    while (...) {...}
*/
let a = floatInput("a");
let b = floatInput("b");
let begin = floatInput("начало диапазона");
let end = floatInput("конец диапазона");
let step = positiveNumberInput(floatInput, "шаг");
currentValue = begin;
while (currentValue <= end) {
    if (!checkFunctionArgument(currentValue, b)) break;
    let result = (a * Math.pow(Math.log(currentValue), 2)) / (b + Math.sqrt(currentValue));
    console.log("x = " + currentValue + "; y = " + numberFormat.format(result));
    currentValue += step;
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
    Функция для ограничения ввода только положительными числами
    Параметры:
    handler - функция-обработчик для преобразования введенных строк в числа,
    argName - отображаемое пользователю имя аргумента.
    Возвращает:
    число.
*/
function positiveNumberInput(handler, argName) {
    let result;
    while ((result = handler(argName)) <= 0) {
        alert("Ошибка: значение параметра '" + argName + "' должно быть положительным числом");
    }
    return result;
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