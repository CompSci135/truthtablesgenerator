//buttons to change with bar content
document.getElementById("not").onclick = function(){
    document.getElementById("inputbox").value += "¬";
}
document.getElementById("and").onclick = function(){
    document.getElementById("inputbox").value += "∧";
}
document.getElementById("or").onclick = function(){
    document.getElementById("inputbox").value += "∨";
}
document.getElementById("if").onclick = function(){
    document.getElementById("inputbox").value += "→";
}
document.getElementById("iff").onclick = function(){
    document.getElementById("inputbox").value += "↔";
}
document.getElementById("open").onclick = function(){
    document.getElementById("inputbox").value += "(";
}
document.getElementById("close").onclick = function(){
    document.getElementById("inputbox").value += ")";
}

//generatebutton 
document.getElementById("submit").onclick = function(){
    let expression = document.getElementById("inputbox").value;
    let validate = validateExpression(expression);
    if (validate==true){
        document.getElementById("validated").textContent = "";
    }
    else if (validate!=true){
        document.getElementById("validated").textContent = validate;
        return;
    }
    let resulted_array = initializeTheVariables(expression);
    let resulted_expression = expression.split(' ').join('').toUpperCase();
    let postFix = PostFix(resulted_expression);
    let result = finalResult(postFix, resulted_array);
    resulted_array[resulted_expression] = result;
    console.log(resulted_array);
    generateTable(resulted_array);
    
}

//validate my expression
function validateExpression(expression){
    let allowedChars = " →↔∧∨¬()ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    for (let i = 0; i<expression.length; i++){ //validate expression has only allowed chars
        if (!allowedChars.includes(expression[i])){
            return "There is an invalid token"+expression[i]+" ";
        }
    }

    let alphabet ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let symbols = "→↔∧∨¬";
    for (let i = 0; i<expression.length -1; i++){ //validate there are no 2 operators nor 2 letters with eachother
        if (alphabet.includes(expression[i]) && alphabet.includes(expression[i+1])){
            return "The expression is invalid: "+"'"+expression[i]+expression[i+1]+"'";
        }
        else if(symbols.includes(expression[i])&&symbols.includes(expression[i+1])){
            return "The expression is invalid:"+"'"+expression[i]+expression[i+1]+"'";
        }
    }

    let stackP = [];
    for (let i = 0; i< expression.length; i++){
        if (expression[i] == '('){
            stackP.push(expression[i]);
        }
        else if(expression[i] == ')'){
            if (stackP.length === 0 || stackP.pop() !== '(') {
                return 'Parenthesis is invalid!';
            }
        }
    }
    if (stackP.length != 0){
        return 'Paranthesis is invalid!';
    }
    
    return true;

}


//initialize the variables
function initializeTheVariables(s){
    let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    let Variables = [];
    for (let i = 0; i<s.length; i++){
        if (letters.indexOf(s[i])!=-1){
            let char = s[i].toUpperCase();
            if (Variables.indexOf(char) == -1){
                Variables.push(char);
            } }
    }

    let z = [];
    let len = Math.pow(2,Variables.length);
    for (let j = 0; j<Math.pow(2,Variables.length)-1; j++){
        for (let i = 0; i<len; i++){
            if (i<len/2){
                z.push(true);
            }
            else{
                z.push(false);
            }
            if (z.length%(Math.pow(2,Variables.length)) == 0){
                len = len/2
            }
        }
    }

    let result = {};
    let counterOne = 0;
    let counterTwo = Math.pow(2,Variables.length);
    for (let k = 0; k<Variables.length; k++){
        result[Variables[k]] = z.slice(counterOne, counterTwo);
        counterOne = counterTwo;
        counterTwo+= Math.pow(2,Variables.length);
    }
    return result;
}

//get the PostFix expression:
function PostFix(resulted_expression){
    let operators = "→ ↔ ∧ ∨ ¬ ( )";
    let precedence = ["¬", "∧", "∨", "→", "↔"]; //precedence starting from most important to least
    let stackMain = [];
    let queueMain = [];
    for (let i = 0; i<resulted_expression.length; i++){
        if (!operators.includes(resulted_expression[i])){
            queueMain.push(resulted_expression[i]);
        }
        else if(resulted_expression[i] == '('){
            stackMain.push(resulted_expression[i]);
        }
        else if(resulted_expression[i] == ')') {
            while (stackMain.length > 0) {
                let head = stackMain.pop();
                if (head === '(') {
                    break;
                } else {
                    queueMain.push(head);
                }
            }
        }
        else{
            if(stackMain.length == 0){
                stackMain.push(resulted_expression[i]);
            }
            
            else if (stackMain[stackMain.length-1] == ')' || stackMain[stackMain.length-1] == '('){
                stackMain.push(resulted_expression[i]);
            }
            else {
                while (stackMain.length > 0 && precedence.indexOf(resulted_expression[i]) >= precedence.indexOf(stackMain[stackMain.length - 1])) {
                        queueMain.push(stackMain.pop());
                    }
                    stackMain.push(resulted_expression[i]);
                }
        }
    }

    while(stackMain.length!=0){  //remaining characters in the stack
        queueMain.push(stackMain.pop());
    }
    return queueMain;
}

//Define the functions done by the operation:
function andOperation (operand1, operand2){
    let r = [];
    for (let i = 0; i<operand1.length; i++){
        r[i] = operand1[i] && operand2[i];
    }
    return r;
}
function orOperation (operand1, operand2){
    let r = [];
    for (let i = 0; i<operand1.length; i++){
        r[i] = operand1[i] || operand2[i];
    }
    return r;
}
function notOperation(operand){
    let r = [];
    for (let i = 0; i<operand.length; i++){
        r[i] = !operand[i]
    }
    return r;
}
function conditional(operand1, operand2){
    let r = [];
    for (let i = 0; i<operand1.length; i++){
        if (operand1[i] == true && operand2[i] == false){
            r[i] = false;
        }
        else{
            r[i] = true;
        }
    }
    return r;
}
function biconditional(operand1, operand2){
    let r = [];
    for (let i = 0; i<operand1.length; i++){
        if (operand1[i] == operand2[i]){
            r[i] = true;
        }
        else{
            r[i] = false;
        }
    }
    return r;
}


//getting the final array using shunting and yard algorithm
function finalResult(postFix,result){
    let operators = "→ ↔ ∧ ∨ ¬ ( )";
    let expression = postFix.join('');
    let stackExp = [];
    for (let i = 0; i<expression.length; i++){
        if (!operators.includes(expression[i])){
            stackExp.push(result[expression[i]]);
        }
        else{
            switch(expression[i]){
                case('¬'):
                    stackExp.push(notOperation(stackExp.pop()));
                    break;
                case('∧'):
                    let secondOperandAnd = stackExp.pop();
                    stackExp.push(andOperation(stackExp.pop(), secondOperandAnd));
                    break;
                case('∨'):
                    let secondOperandOr = stackExp.pop();
                    stackExp.push(orOperation(stackExp.pop(), secondOperandOr));
                    break;
                case('→'):
                    let secondOperandIf = stackExp.pop();
                    stackExp.push(conditional(stackExp.pop(), secondOperandIf));
                    break;
                case('↔'):
                    let secondOperandDoubleIf = stackExp.pop();
                    stackExp.push(biconditional(stackExp.pop(), secondOperandDoubleIf));
                    break;
        }
    }
    }
    return stackExp;
}

function generateTable(data) {
    let table = document.getElementById("table");
    table.innerHTML = ""; //delete existing content and generate only one table at a time
    let headers = Object.keys(data);
    let headerRow = table.insertRow();
    for (let header of headers) {
        let cell = headerRow.insertCell();
        cell.textContent = header;
    }
    let numRows = data[headers[0]].length; 
    for (let i = 0; i < numRows; i++) {
        let row = table.insertRow();
        for (let header of headers) {
            let cell = row.insertCell();
            if (String(header).length == 1){
            cell.textContent = data[header][i];}
            else{
                cell.textContent = data[header][0][i];
            }
            
        }
    }
}