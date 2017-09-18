var bt = document.getElementsByTagName('td');
var tb = document.getElementById('tb');
var resoult = document.getElementById('big');
var process = document.getElementById('small');

var currentNum = 0;                 // 当前输入值
var cache = 0;                      // 缓存的计算结果
var op = -1;                        // 记录上一个运算符
var input = 0;                      // 判断有没有输入了数字

function init() {
    tb.addEventListener('click', getNum);
    resoult.innerHTML = 0;
    process.innerHTML = '';
}

function getNum(event) {
    var target = event.target;
    target = target.innerHTML;
    if (parseInt(target) >= 0 && parseInt(target) <= 9) {       // 输入了数字，计算当前输入值并显示在结果栏
        if (op == 4) resoult.innerHTML = "请先按C清空";
        else {
            currentNum = currentNum * 10 + parseInt(target);
            resoult.innerHTML = currentNum;
            input = 1;
        }
    }
    else if (currentNum != 0 || op == 4 || input == 1) {                      // 输入了运算符，显示运算过程并储存该运算符
        input = 0;
        process.innerHTML += currentNum;
        switch (op) {                             // 根据上一个运算符来计算当前值并缓存
            case 0:
                cache = cache + currentNum;
                break;
            case 1:
                cache = cache - currentNum;
                break;
            case 2:
                cache = cache * currentNum;
                break;
            case 3:
                cache = cache / currentNum;
                break;
            case 4:
                process.innerHTML = cache;
                break;
            default:
                cache = currentNum;
        }
        resoult.innerHTML = cache;
        currentNum = 0;
        switch (target) {                        //记录当前运算符
            case 'C':
                process.innerHTML = '';
                resoult.innerHTML = 0;
                op = -1;
                cache = 0;
                break;
            case '+':
                op = 0;
                process.innerHTML += '+';
                break;
            case '-':
                op = 1;
                process.innerHTML += '-';
                break;
            case '*':
                op = 2;
                process.innerHTML += '*';
                break;
            case '/':
                op = 3;
                process.innerHTML += '/';
                break;
            case '=':
                op = 4;
                resoult.innerHTML = cache;
                process.innerHTML += '=' + cache;
                break;
        }

    }
}

window.onload = init;