class MathTenGame {
    constructor() {
        this.numbers = [1, 2, 3, 4];
        this.operators = ['+', '-', '*', '/'];
        this.init();
    }

    init() {
        this.generateProblem();
        this.bindEvents();
        this.updateDisplay();
    }

    bindEvents() {
        document.getElementById('new-problem-btn').addEventListener('click', () => {
            this.generateProblem();
        });

        document.getElementById('submit-btn').addEventListener('click', () => {
            this.checkAnswer();
        });

        // 演算子が変更されたときに結果を自動更新
        ['op1', 'op2', 'op3'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => {
                this.updateResult();
            });
        });
    }

    generateProblem() {
        let attempts = 0;
        const maxAttempts = 1000;
        
        do {
            // 1から9までのランダムな数字を4つ生成
            this.numbers = [
                Math.floor(Math.random() * 9) + 1,
                Math.floor(Math.random() * 9) + 1,
                Math.floor(Math.random() * 9) + 1,
                Math.floor(Math.random() * 9) + 1
            ];
            attempts++;
        } while (!this.hasSolution() && attempts < maxAttempts);

        this.updateDisplay();
        this.clearMessage();
    }

    hasSolution() {
        const operators = ['+', '-', '*', '/'];
        
        // 全ての演算子の組み合わせをチェック
        for (let op1 of operators) {
            for (let op2 of operators) {
                for (let op3 of operators) {
                    if (this.calculateExpression(this.numbers, [op1, op2, op3]) === 10) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    calculateExpression(nums, ops) {
        try {
            // 式を文字列として構築
            let expression = `${nums[0]} ${ops[0]} ${nums[1]} ${ops[1]} ${nums[2]} ${ops[2]} ${nums[3]}`;
            
            // 安全な計算のため、evalの代わりに手動で計算
            return this.evaluateExpression(nums[0], ops[0], nums[1], ops[1], nums[2], ops[2], nums[3]);
        } catch (error) {
            return null;
        }
    }

    evaluateExpression(a, op1, b, op2, c, op3, d) {
        // 演算子の優先順位を考慮して計算
        let result;
        
        // 乗除を先に計算
        let values = [a, b, c, d];
        let operations = [op1, op2, op3];
        
        // 左から右に乗除を処理
        for (let i = 0; i < operations.length; i++) {
            if (operations[i] === '*' || operations[i] === '/') {
                if (operations[i] === '*') {
                    values[i] = values[i] * values[i + 1];
                } else {
                    if (values[i + 1] === 0) return null; // ゼロ除算回避
                    values[i] = values[i] / values[i + 1];
                }
                values.splice(i + 1, 1);
                operations.splice(i, 1);
                i--;
            }
        }
        
        // 加減を処理
        result = values[0];
        for (let i = 0; i < operations.length; i++) {
            if (operations[i] === '+') {
                result += values[i + 1];
            } else if (operations[i] === '-') {
                result -= values[i + 1];
            }
        }
        
        // 小数点の誤差を考慮
        return Math.round(result * 1000) / 1000;
    }

    getCurrentResult() {
        const ops = [
            document.getElementById('op1').value,
            document.getElementById('op2').value,
            document.getElementById('op3').value
        ];
        
        return this.calculateExpression(this.numbers, ops);
    }

    updateDisplay() {
        document.getElementById('num1').textContent = this.numbers[0];
        document.getElementById('num2').textContent = this.numbers[1];
        document.getElementById('num3').textContent = this.numbers[2];
        document.getElementById('num4').textContent = this.numbers[3];
        
        // 演算子をランダムに設定
        ['op1', 'op2', 'op3'].forEach(id => {
            const select = document.getElementById(id);
            select.selectedIndex = Math.floor(Math.random() * 4);
        });
        
        this.updateResult();
    }

    updateResult() {
        const result = this.getCurrentResult();
        document.getElementById('result').textContent = result !== null ? result : 'エラー';
    }

    checkAnswer() {
        const result = this.getCurrentResult();
        const messageElement = document.getElementById('message');
        
        if (result === 10) {
            messageElement.textContent = 'SUCCESS! 🎉';
            messageElement.className = 'message success';
        } else {
            messageElement.textContent = 'FAILED 😓';
            messageElement.className = 'message failed';
        }
    }

    clearMessage() {
        const messageElement = document.getElementById('message');
        messageElement.textContent = '';
        messageElement.className = 'message';
    }
}

// ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    new MathTenGame();
});