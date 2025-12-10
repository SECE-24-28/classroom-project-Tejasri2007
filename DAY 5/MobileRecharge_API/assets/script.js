/* =========================================================
   COMMON HELPERS
========================================================= */
function $(id) {
    return document.getElementById(id);
}

/* =========================================================
   LOGIN PAGE
========================================================= */
function loginValidate(e) {
    if (e) e.preventDefault();

    const email = $("loginEmail").value.trim();
    const password = $("loginPass").value.trim();
    const msg = $("loginMsg");

    if (!email.includes("@") || password.length < 4) {
        msg.innerText = "Invalid email or password";
        msg.classList.remove("hidden");
        return false;
    }

    // Save session (demo purpose)
    sessionStorage.setItem("loggedUser", email);
    window.location.href = "plans.html";
    return false;
}

/* =========================================================
   SIGNUP PAGE
========================================================= */
function signupValidate(e) {
    if (e) e.preventDefault();

    const name = $("signupName").value.trim();
    const email = $("signupEmail").value.trim();
    const password = $("signupPass").value.trim();
    const agree = $("agree")?.checked;

    if (!name || !email.includes("@") || password.length < 4 || !agree) {
        alert("Please fill all details correctly");
        return false;
    }

    // Save user (demo purpose only)
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful! Please login.");
    window.location.href = "index.html";
    return false;
}

/* =========================================================
   PAYMENT PAGE
========================================================= */
function loadPaymentPage() {
    const amountText = $("amountText");
    if (!amountText) return;

    const params = new URLSearchParams(window.location.search);
    const amount = params.get("amount");
    const operator = params.get("operator");

    amountText.innerText = `₹${amount}`;
    amountText.dataset.final = amount;

    const info = $("planInfo");
    if (info) {
        info.innerText = `${operator} Recharge`;
    }
}

/* =========================================================
   COUPONS
========================================================= */
const COUPONS = {
    "SAVE50": 50,
    "DISC100": 100
};

function applyCoupon() {
    const code = $("couponCode").value.trim().toUpperCase();
    const amountEl = $("amountText");

    if (!code) {
        alert("Enter a coupon code");
        return;
    }

    if (!COUPONS[code]) {
        alert("Invalid coupon code");
        return;
    }

    let amount = parseInt(amountEl.dataset.final);
    let discount = COUPONS[code];

    let final = amount - discount;
    if (final < 0) final = 0;

    amountEl.dataset.final = final;
    amountEl.innerText = `₹${final}`;

    alert(`Coupon applied! You saved ₹${discount}`);
}

/* =========================================================
   PROCESS PAYMENT
========================================================= */
function processPayment() {
    const mobile = $("payMobile").value.trim();
    const amount = $("amountText").dataset.final;
    const params = new URLSearchParams(window.location.search);

    if (!/^[6-9]\d{9}$/.test(mobile)) {
        alert("Enter valid 10-digit mobile number");
        return;
    }

    const record = {
        id: Date.now(),
        mobile,
        amount,
        operator: params.get("operator"),
        date: new Date().toLocaleString()
    };

    const history = JSON.parse(localStorage.getItem("rechargeHistory")) || [];
    history.unshift(record);
    localStorage.setItem("rechargeHistory", JSON.stringify(history));

    window.location.href = "success.html";
}

/* =========================================================
   SUCCESS PAGE
========================================================= */
function loadSuccess() {
    const el = $("successText");
    if (!el) return;

    const history = JSON.parse(localStorage.getItem("rechargeHistory")) || [];
    if (history.length === 0) return;

    const last = history[0];
    el.innerText = `Recharge of ₹${last.amount} for ${last.mobile} was successful.`;
}

/* =========================================================
   HISTORY PAGE
========================================================= */
function renderHistory() {
    const container = $("historyList");
    if (!container) return;

    const history = JSON.parse(localStorage.getItem("rechargeHistory")) || [];
    container.innerHTML = "";

    if (history.length === 0) {
        container.innerHTML =
            `<div class="bg-white p-6 rounded shadow text-center">
                No recharge history found
             </div>`;
        return;
    }

    history.forEach(item => {
        const div = document.createElement("div");
        div.className = "bg-white p-4 rounded shadow flex justify-between";

        div.innerHTML = `
            <div>
                <p class="font-semibold">${item.mobile}</p>
                <p class="text-sm text-gray-600">${item.operator}</p>
                <p class="text-sm">₹${item.amount}</p>
                <p class="text-xs text-gray-500">${item.date}</p>
            </div>
        `;

        container.appendChild(div);
    });
}

/* =========================================================
   CLEAR HISTORY
========================================================= */
function clearHistory() {
    if (confirm("Clear recharge history?")) {
        localStorage.removeItem("rechargeHistory");
        renderHistory();
    }
}

/* =========================================================
   AUTO LOAD BASED ON PAGE
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    loadPaymentPage();
    loadSuccess();
    renderHistory();
});
