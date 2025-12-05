document.getElementById("salaryForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let name = document.getElementById("empName").value;
    let dept = document.getElementById("department").value;
    let basic = parseFloat(document.getElementById("basicSalary").value);

    let hra = basic * 0.10;
    let pf = basic * 0.05;
    let net = basic + hra - pf;

    // Greeting message
    let greet = `Hello ${name}, here is your salary slip`;

    // Display slip
    let output = `
        <h2 class="text-xl font-bold text-green-700 mb-3">${greet}</h2>
        <p><strong>Employee Name:</strong> ${name}</p>
        <p><strong>Department:</strong> ${dept}</p>
        <p><strong>Basic Salary:</strong> ₹${basic.toFixed(2)}</p>
        <p><strong>HRA (10%):</strong> ₹${hra.toFixed(2)}</p>
        <p><strong>PF (5%):</strong> ₹${pf.toFixed(2)}</p>
        <p class="font-bold text-blue-700 mt-3 text-lg">
            Net Salary: ₹${net.toFixed(2)}
        </p>
    `;

    let resultDiv = document.getElementById("result");
    resultDiv.innerHTML = output;
    resultDiv.classList.remove("hidden");
});
