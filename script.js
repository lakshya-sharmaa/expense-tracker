let expenses = {};

let chart;


function drawPieChart(expenses) {
    var ctx = document.getElementById('chart').getContext('2d');
    var labels = Object.keys(expenses);
    var data = Object.values(expenses);
    var colors = ['red', 'blue', 'green', 'orange']; 

    if (chart) {
        chart.destroy(); 
    }

    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Expenses Breakdown'
                }
            }
        },
    });
}


let transactions = [];


function addItem() {
    let itemType = document.getElementById('itemType').value;
    let name = document.getElementById('name').value;
    let amount = parseFloat(document.getElementById('amount').value);
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    let category = '';
    if (itemType === '0') { 
        category = document.getElementById('expenseType').value;
    }

    let transaction = {
        type: itemType == '1' ? 'Income' : 'Expense',
        name: name,
        amount: itemType == '1' ? amount : -amount, 
        category: category,
        date: new Date().toLocaleDateString() 
    };

    
    if (transaction.type === 'Expense') {
        if (expenses[category]) {
            expenses[category] += Math.abs(amount); 
        } else {
            expenses[category] = Math.abs(amount); 
        }
    }

    transactions.push(transaction);
    updateTransactions();
    drawPieChart(expenses); 
}


function updateTransactions() {
    let totalIncome = 0;
    let totalExpense = 0;

    let transactionList = document.getElementById('transactionList');
    transactionList.innerHTML = '';

    transactions.forEach((transaction, index) => {
        let listItem = document.createElement('li');
        listItem.textContent = `${transaction.date} - ${transaction.type}: ${transaction.name} (${transaction.category})  ₹${transaction.amount.toLocaleString('en-IN')}`; // Display amount in INR format
        listItem.classList.add('transactionItem'); 

        if (transaction.type === 'Expense') {
            listItem.style.color = 'red';
        } else {
            listItem.style.color = 'green';
        }

       
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'deleteButton'; 
        deleteButton.onclick = function () {
            if (transaction.type === 'Expense') {
                expenses[transaction.category] -= Math.abs(transaction.amount); 
            }
            transactions.splice(index, 1);
            updateTransactions();
            drawPieChart(expenses); 
        };
        listItem.appendChild(deleteButton);

        transactionList.appendChild(listItem);

        if (transaction.amount > 0) {
            totalIncome += transaction.amount;
        } else {
            totalExpense += Math.abs(transaction.amount);
        }
    });

    let totalIncomeElement = document.getElementById('totalIncome');
    let totalExpenseElement = document.getElementById('totalExpense');
    let balanceElement = document.getElementById('balance');

    
    totalIncomeElement.textContent = `₹${totalIncome.toLocaleString('en-IN')}`;
    totalExpenseElement.textContent = `₹${totalExpense.toLocaleString('en-IN')}`;
    balanceElement.textContent = `₹${(totalIncome - totalExpense).toLocaleString('en-IN')}`;
}