document.addEventListener("DOMContentLoaded", function () {
    const expenseForm = document.getElementById("expenseForm");
    const expenseName = document.getElementById("expenseName");
    const expenseAmount = document.getElementById("expenseAmount");
    const expenseCategory = document.getElementById("expenseCategory");
    const expenseTableBody = document.getElementById("expenseTableBody");
    const totalExpense = document.getElementById("totalExpense");
    const categoryFilter = document.getElementById("categoryFilter");
  
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  
    // Handle section navigation
    const sections = document.querySelectorAll("#home, #addExpense, #expenseList, #about");
    const navLinks = document.querySelectorAll("#sidebar .nav-link");
  
    navLinks.forEach(link => {
      link.addEventListener("click", function (event) {
        const targetSection = document.querySelector(`#${link.getAttribute("href").slice(1)}`);
        sections.forEach(section => section.classList.add("d-none"));
        targetSection.classList.remove("d-none");
      });
    });

    // Function to format amount in Indian Rupees (₹)
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    }
  
    // Add Expense Function
    function addExpense(event) {
      event.preventDefault();
  
      const expenseNameValue = expenseName.value.trim();
      const expenseAmountValue = parseFloat(expenseAmount.value);
  
      if (expenseNameValue && expenseAmountValue > 0) {
        const expense = {
          name: expenseNameValue,
          amount: expenseAmountValue,
          category: expenseCategory.value,
        };
  
        expenses.push(expense);
  
        // Save expenses to local storage
        localStorage.setItem("expenses", JSON.stringify(expenses));
  
        // Reset form fields
        expenseName.value = '';
        expenseAmount.value = '';
        expenseCategory.value = 'Food';
  
        // Update the table and total
        updateExpenseTable();
        updateTotalExpense();
      } else {
        alert("Please provide a valid expense name and amount.");
      }
    }
  
    // Update Expense Table
    function updateExpenseTable() {
      expenseTableBody.innerHTML = '';
      const filteredCategory = categoryFilter.value;
  
      let filteredExpenses = expenses;
      if (filteredCategory !== "All") {
        filteredExpenses = expenses.filter(exp => exp.category === filteredCategory);
      }
  
      filteredExpenses.forEach((expense, index) => {
        const row = document.createElement("tr");
  
        row.innerHTML = `
          <td>${expense.name}</td>
          <td>${formatCurrency(expense.amount)}</td>
          <td>${expense.category}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="editExpense(${index})">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteExpense(${index})">Delete</button>
          </td>
        `;
  
        expenseTableBody.appendChild(row);
      });
    }
  
    // Edit Expense Function
    window.editExpense = function (index) {
      const expense = expenses[index];
      expenseName.value = expense.name;
      expenseAmount.value = expense.amount;
      expenseCategory.value = expense.category;
  
      // Remove the expense being edited from the array
      expenses.splice(index, 1);
      localStorage.setItem("expenses", JSON.stringify(expenses));
      updateExpenseTable();
      updateTotalExpense();
    };
  
    // Delete Expense Function
    window.deleteExpense = function (index) {
      expenses.splice(index, 1);
      localStorage.setItem("expenses", JSON.stringify(expenses));
      updateExpenseTable();
      updateTotalExpense();
    };
  
    // Update Total Expense
    function updateTotalExpense() {
      const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      totalExpense.textContent = formatCurrency(total);
    }
  
    // Handle Category Filter Change
    categoryFilter.addEventListener("change", updateExpenseTable);
  
    // Add expense when the form is submitted
    expenseForm.addEventListener("submit", addExpense);
  
    // Initial Table and Total Update
    updateExpenseTable();
    updateTotalExpense();
  });
  