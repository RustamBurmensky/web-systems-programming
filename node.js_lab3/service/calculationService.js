/*
    Модуль сервісного шару для реалізації обчислень
*/
module.exports = {

    calculateConditional: function(x, y, z) {
        if (x > y) {
            let answer = Math.pow(y, x) + 3 * z;
            return {variant: 'A', result: answer };
        } else {
            let answer = Math.pow(Math.E, Math.abs(y - x)) + x / 2;
            return {variant: 'B', result: answer };
        }
    },
    calculateForLoop: function(a, b, values) {
        const resultArray = [];
        for (let i = 0; i < values.length; i++) {
            let result = (a * Math.pow(Math.log(values[i]), 2)) / (b + Math.sqrt(values[i]));
            resultArray.push({x: values[i], y: result});
        }
        return resultArray;
    },
    calculateWhileLoop: function(a, b, begin, end, step) {
        const resultArray = [];
        currentValue = begin;
        while (currentValue <= end) {
            let result = (a * Math.pow(Math.log(currentValue), 2)) / (b + Math.sqrt(currentValue));
            resultArray.push({x: currentValue, y: result});
            currentValue += step;
        }
        return resultArray;
    },
    calculateDoWhileLoop: function(a, b, begin, end, step) {
        const resultArray = [];
        let currentValue = begin;
        do {
            let result = (a * Math.pow(Math.log(currentValue), 2)) / (b + Math.sqrt(currentValue));
            resultArray.push({x: currentValue, y: result});
            currentValue += step;
        } while (currentValue <= end);
        return resultArray;
    }

}