const products = [
    "Магданоз",
    "Копър",
    "Целина",
    "Дивесил",
    "Мащерка",
    "Пресен лук",
    "Босилек",
    "Мента",
    "Джоджен",

    "Червен домат",
    "Розов домат",
    "Черри домат",
    "Краставица",
    "Тиквичка",
    "Патладжан",

    "Червен пипер",
    "Зелен пипер",
    "Пипер долма",
    "Пипер сиврия",

    "Моркови",
    "Чесън",
    "Цвекло",
    "Целина глава",

    "Стар картоф",
    "Мит картоф",
    "Дребен картоф",

    "Лук",
    "Червен лук",

    "Лимони",
    "Портокал фреш",
    "Портокал десертен",
    "Банан",
    "Лайм",
    "Грейпфрут",

    "Ябълка зелена",
    "Ябълка червена",
    "Ябълка жълта",

    "Грозде бяло",
    "Грозде черно",
    "Грозде червено",

    "Праскови",
    "Нектарини",
    "Сливи",
    "Кайсии"
];

const productsTable =
    document.querySelector("#productsTable");

const calculateButton =
    document.querySelector("#calculateButton");

const totalOrderElement =
    document.querySelector("#totalOrder");

const workDateInput =
    document.querySelector("#workDate");

function setCurrentDate() {
    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(now.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(now.getDate())
            .padStart(2, "0");

    workDateInput.value =
        `${year}-${month}-${day}`;
}

function createProductsTable() {
    productsTable.innerHTML = "";

    products.forEach((product, index) => {
        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td class="product-name">
                ${product}
            </td>

            <td>
                <input
                    type="text"
                    class="number-input stock-input"
                    inputmode="decimal"
                    autocomplete="off"
                    placeholder="0"
                    data-index="${index}"
                >
            </td>

            <td>
                <input
                    type="text"
                    class="number-input required-input"
                    inputmode="text"
                    autocomplete="off"
                    placeholder="0+0"
                    data-index="${index}"
                >
            </td>

            <td
                class="order-value"
                data-order-index="${index}"
            >
                0
            </td>
        `;

        productsTable.appendChild(row);
    });
}

function calculateExpression(value) {
    const expression = value
        .replaceAll(",", ".")
        .replaceAll(" ", "");

    if (expression === "") {
        return 0;
    }

    const validExpression =
        /^\d+(?:\.\d+)?(?:\+\d+(?:\.\d+)?)*$/;

    if (!validExpression.test(expression)) {
        return null;
    }

    const numbers =
        expression.split("+");

    const result =
        numbers.reduce((sum, number) => {
            return sum + Number(number);
        }, 0);

    if (!Number.isFinite(result)) {
        return null;
    }

    return result;
}

function calculateStock(value) {
    const normalizedValue = value
        .replace(",", ".")
        .trim();

    if (normalizedValue === "") {
        return 0;
    }

    const number =
        Number(normalizedValue);

    if (
        !Number.isFinite(number) ||
        number < 0
    ) {
        return null;
    }

    return number;
}

function calculateOrders() {
    let totalOrder = 0;
    let hasError = false;

    products.forEach((product, index) => {
        const stockInput =
            document.querySelector(
                `.stock-input[data-index="${index}"]`
            );

        const requiredInput =
            document.querySelector(
                `.required-input[data-index="${index}"]`
            );

        const orderElement =
            document.querySelector(
                `[data-order-index="${index}"]`
            );

        stockInput.classList.remove(
            "input-error"
        );

        requiredInput.classList.remove(
            "input-error"
        );

        orderElement.classList.remove(
            "positive",
            "error"
        );

        const stock =
            calculateStock(stockInput.value);

        const required =
            calculateExpression(
                requiredInput.value
            );

        if (
            stock === null ||
            required === null
        ) {
            hasError = true;

            if (stock === null) {
                stockInput.classList.add(
                    "input-error"
                );
            }

            if (required === null) {
                requiredInput.classList.add(
                    "input-error"
                );
            }

            orderElement.textContent =
                "Грешка";

            orderElement.classList.add(
                "error"
            );

            return;
        }

        if (stockInput.value !== "") {
            stockInput.value =
                formatNumber(stock);
        }

        if (requiredInput.value !== "") {
            requiredInput.value =
                formatNumber(required);
        }

        const orderAmount =
            Math.max(required - stock, 0);

        orderElement.textContent =
            formatNumber(orderAmount);

        if (orderAmount > 0) {
            orderElement.classList.add(
                "positive"
            );
        }

        totalOrder += orderAmount;
    });

    totalOrderElement.textContent =
        `${formatNumber(totalOrder)} кг`;

    if (hasError) {
        alert(
            "Има неправилно попълнени полета. " +
            "За колоната „Необходимо“ използвай формат: " +
            "20+30+12"
        );
    }
}

function formatNumber(number) {
    const roundedNumber =
        Math.round(number * 100) / 100;

    return Number.isInteger(roundedNumber)
        ? roundedNumber.toString()
        : roundedNumber.toString();
}

calculateButton.addEventListener(
    "click",
    calculateOrders
);

setCurrentDate();
createProductsTable();