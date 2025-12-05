// ---------------------- LOGIN VALIDATION ----------------------
document.getElementById("loginForm")?.addEventListener("submit", function (e) {
    e.preventDefault();

    let email = document.getElementById("email").value;
    let pass = document.getElementById("password").value;

    if (!email.includes("@") || pass.length < 4) {
        alert("Invalid email or password");
        return;
    }

    window.location.href = "index.html";
});

// ---------------------- RECHARGE FORM ----------------------
document.getElementById("rechargeForm")?.addEventListener("submit", function (e) {
    e.preventDefault();

    let mobile = document.getElementById("mobile").value;
    let operator = document.getElementById("operator").value;
    let amount = document.getElementById("amount").value;

    if (isNaN(mobile) || mobile.length != 10) {
        alert("Enter valid 10-digit mobile number");
        return;
    }

    if (amount <= 0) {
        alert("Enter valid amount");
        return;
    }

    localStorage.setItem("mobile", mobile);
    localStorage.setItem("operator", operator);
    localStorage.setItem("amount", amount);

    window.location.href = "summary.html";
});

// ---------------------- SUMMARY PAGE DATA ----------------------
if (document.getElementById("sumMobile")) {
    document.getElementById("sumMobile").innerText = localStorage.getItem("mobile");
    document.getElementById("sumOperator").innerText = localStorage.getItem("operator");
    document.getElementById("sumAmount").innerText = localStorage.getItem("amount");
}

// ---------------------- PLANS PAGE ----------------------
const plans = [
    { price: 199, data: "1.5GB/day", validity: "28 days" },
    { price: 249, data: "2GB/day", validity: "28 days" },
    { price: 299, data: "2GB/day", validity: "30 days" },
];

if (document.getElementById("planList")) {
    let list = document.getElementById("planList");

    plans.forEach(p => {
        let card = `
            <div class="bg-white p-6 rounded-2xl shadow card-hover">
                <h3 class="text-xl font-bold text-blue-700">₹${p.price}</h3>
                <p class="text-gray-700 mt-2">${p.data}</p>
                <p class="text-gray-700">Validity: ${p.validity}</p>

                <button class="btn-gradient mt-4 text-white w-full py-2 rounded-xl"
                    onclick="selectPlan(${p.price})">
                    Choose Plan
                </button>
            </div>
        `;
        list.innerHTML += card;
    });
}

function selectPlan(price) {
    localStorage.setItem("amount", price);
    window.location.href = "recharge.html";
}
