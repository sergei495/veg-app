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

const STORAGE_KEY = "vegAppCurrentData";

const productsTable =
    document.querySelector("#productsTable");

const calculateButton =
    document.querySelector("#calculateButton");

const clearButton =
    document.querySelector("#clearButton");

const totalOrderElement =
    document.querySelector("#totalOrder");

const workDateInput =
    document.querySelector("#workDate");

function getCurrentDate() {
    const now = new Date();

    const year = now.getFullYear();

    const month = String(
        now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        now.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
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

    const numbers = expression.split("+");

    const result = numbers.reduce(
        (sum, number) => {
            return sum + Number(number);
        },
        0
    );

    return Number.isFinite(result)
        ? result
        : null;
}

function calculateStock(value) {
    const normalizedValue = value
        .replace(",", ".")
        .trim();

    if (normalizedValue === "") {
        return 0;
    }

    const number = Number(normalizedValue);

    if (
        !Number.isFinite(number) ||
        number < 0
    ) {
        return null;
    }

    return number;
}

function calculateOrders(options = {}) {
    const replaceExpressions =
        options.replaceExpressions ?? true;

    const showAlert =
        options.showAlert ?? true;

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

        if (
            replaceExpressions &&
            stockInput.value !== ""
        ) {
            stockInput.value =
                formatNumber(stock);
        }

        if (
            replaceExpressions &&
            requiredInput.value !== ""
        ) {
            requiredInput.value =
                formatNumber(required);
        }

        const orderAmount = Math.max(
            required - stock,
            0
        );

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

    saveCurrentData();

    if (hasError && showAlert) {
        alert(
            "Има неправилно попълнени полета. " +
            "За колоната „Необходимо“ използвай формат: " +
            "20+30+12"
        );
    }
}

function collectCurrentData() {
    const items = products.map(
        (product, index) => {
            const stockInput =
                document.querySelector(
                    `.stock-input[data-index="${index}"]`
                );

            const requiredInput =
                document.querySelector(
                    `.required-input[data-index="${index}"]`
                );

            return {
                product,
                stock: stockInput.value,
                required: requiredInput.value
            };
        }
    );

    return {
        date: workDateInput.value,
        items
    };
}

function saveCurrentData() {
    try {
        const currentData =
            collectCurrentData();

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(currentData)
        );
    } catch (error) {
        console.error(
            "Грешка при запазване:",
            error
        );
    }
}

function loadCurrentData() {
    const savedData =
        localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
        workDateInput.value =
            getCurrentDate();

        return;
    }

    try {
        const data =
            JSON.parse(savedData);

        workDateInput.value =
            data.date || getCurrentDate();

        if (!Array.isArray(data.items)) {
            return;
        }

        const savedItemsByProduct =
            new Map(
                data.items.map((item) => [
                    item.product,
                    item
                ])
            );

        products.forEach((product, index) => {
            const savedItem =
                savedItemsByProduct.get(product);

            if (!savedItem) {
                return;
            }

            const stockInput =
                document.querySelector(
                    `.stock-input[data-index="${index}"]`
                );

            const requiredInput =
                document.querySelector(
                    `.required-input[data-index="${index}"]`
                );

            stockInput.value =
                savedItem.stock ?? "";

            requiredInput.value =
                savedItem.required ?? "";
        });

        calculateOrders({
            replaceExpressions: false,
            showAlert: false
        });
    } catch (error) {
        console.error(
            "Грешка при зареждане:",
            error
        );

        workDateInput.value =
            getCurrentDate();
    }
}

function clearCurrentData() {
    const confirmed = confirm(
        "Сигурен ли си, че искаш да изчистиш всички въведени данни?"
    );

    if (!confirmed) {
        return;
    }

    document
        .querySelectorAll(
            ".stock-input, .required-input"
        )
        .forEach((input) => {
            input.value = "";
            input.classList.remove(
                "input-error"
            );
        });

    document
        .querySelectorAll(".order-value")
        .forEach((element) => {
            element.textContent = "0";

            element.classList.remove(
                "positive",
                "error"
            );
        });

    workDateInput.value =
        getCurrentDate();

    totalOrderElement.textContent =
        "0 кг";

    localStorage.removeItem(
        STORAGE_KEY
    );
}

function formatNumber(number) {
    const roundedNumber =
        Math.round(number * 100) / 100;

    return roundedNumber.toString();
}

productsTable.addEventListener(
    "input",
    (event) => {
        if (
            event.target.classList.contains(
                "stock-input"
            ) ||
            event.target.classList.contains(
                "required-input"
            )
        ) {
            saveCurrentData();
        }
    }
);

workDateInput.addEventListener(
    "change",
    saveCurrentData
);

calculateButton.addEventListener(
    "click",
    () => {
        calculateOrders({
            replaceExpressions: true,
            showAlert: true
        });
    }
);

clearButton.addEventListener(
    "click",
    clearCurrentData
);

createProductsTable();
loadCurrentData();