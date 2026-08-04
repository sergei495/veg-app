const productGroups = [
    {
        name: "Подправки",
        products: [
            "Босилек",
            "Джоджен",
            "Копър",
            "Магданоз",
            "Пресен чесън",
            "Люцерна/Девесил",
            "Кориандър",
            "Мащерка",
            "Мента",
            "Пресен лук",
            "Розмарин",
            "Рукола",
            "Салвия",
            "Див лук",
            "Кълнове",
            "Микрорастения"
        ]
    },
    {
        name: "Зеленчуци",
        products: [
            "Авокадо",
            "Батат",
            "Броколи",
            "Гъби",

            "Розов домат Екстра",
            "Домат чери",
            "Домат I клас",
            "Домат II клас",

            "Зеле",
            "Зеле червено",
            "Дребни картофи",
            "Картофи",
            "Картофи мит",

            "Китайско зеле",
            "Карфиол",
            "Джинджифил",

            "Краставици I",
            "Краставици II",

            "Лук жълт",
            "Лук червен",
            "Люти чушки",

            "Моркови",
            "Патладжан",

            "Пипер зелен",
            "Пипер червен",
            "Пащърнак",
            "Пипер долма",
            "Пипер сиврия",

            "Репички",
            "Ряпа дълга",
            "Тиква",
            "Тиквички",

            "Цвекло",
            "Целина глава",
            "Чесън",

            "Радичио",
            "Камби зелени",
            "Камби червени",
            "Алабаш",
            "Праз",

            "Айсберг",
            "Аспержи",
            "Бейби спанак",
            "Зелена салата",
            "Селъри",
            "Спанак",
            "Целина",
            "Червена салата",
            "Салата микс",
            "Фенел"
        ]
    },
    {
        name: "Плодове",
        products: [
            "Нектарини",
            "Праскови",
            "Кайсии",

            "Боровинки",
            "Малини",
            "Къпини",

            "Круша",
            "Сливи",
            "Нар",
            "Пъпеши",

            "Бяло грозде",
            "Черно грозде",

            "Ябълка шарена",
            "Ябълка жълта",
            "Ябълка зелена",
            "Ябълки червена",
            "Дребна ябълка",

            "Ананас",
            "Банани",
            "Грейпфрут",
            "Киви",
            "Лайм",
            "Лимони",
            "Манго",
            "Мандарини",

            "Портокал фреш",
            "Портокали-десертен",

            "Физалис",
            "Череши",
            "Ягоди",
            "Диня"
        ]
    },
    {
        name: "Други продукти",
        products: [
            "Боб",
            "Леща (насипна)",
            "Орех",
            "Кашу-суров",
            "Бадем-суров",
            "Мешена туршия",
            "Кисело зеле"
        ]
    }
];

const products = productGroups.flatMap(
    (group) => group.products
);

const STORAGE_KEY = "vegAppCurrentData";

/* Основни елементи */

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

/* Елементи на долния прозорец */

const expressionModal =
    document.querySelector("#expressionModal");

const modalContent =
    expressionModal.querySelector(".modal-content");

const modalBackdrop =
    expressionModal.querySelector(".modal-backdrop");

const modalProductName =
    document.querySelector("#modalProductName");

const expressionInput =
    document.querySelector("#expressionInput");

const expressionTotal =
    document.querySelector("#expressionTotal");

const expressionError =
    document.querySelector("#expressionError");

const closeModalButton =
    document.querySelector("#closeModalButton");

const saveExpressionButton =
    document.querySelector("#saveExpressionButton");

const sheetHandle =
    document.querySelector("#sheetHandle");

let activeProductIndex = null;

/* Дата */

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

/* Създаване на таблицата */

function createProductsTable() {
    productsTable.innerHTML = "";

    let productIndex = 0;

    productGroups.forEach((group) => {
        const categoryRow =
            document.createElement("tr");

        categoryRow.className =
            "category-row";

        categoryRow.innerHTML = `
            <td colspan="4">
                ${group.name}
            </td>
        `;

        productsTable.appendChild(
            categoryRow
        );

        group.products.forEach((product) => {
            const index = productIndex;

            const row = document.createElement("tr");
row.className = "product-row";
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
                        aria-label="Остатък за ${product}"
                    >
                </td>

                <td>
                    <input
                        type="text"
                        class="number-input required-input"
                        inputmode="none"
                        autocomplete="off"
                        placeholder="0"
                        readonly
                        data-index="${index}"
                        data-expression=""
                        aria-label="Необходимо за ${product}"
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

            productIndex++;
        });
    });
}

/* Изчисления */

function calculateExpression(value) {
    const expression = String(value)
        .replaceAll(",", ".")
        .replaceAll(" ", "")
        .replaceAll("\n", "");

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
    const normalizedValue = String(value)
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

function formatNumber(number) {
    const roundedNumber =
        Math.round(number * 100) / 100;

    return roundedNumber.toString();
}

function calculateOrders(showAlert = true) {
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

        orderElement.classList.remove(
            "positive",
            "error"
        );

        const stock =
            calculateStock(stockInput.value);

        const expression =
            requiredInput.dataset.expression || "";

        const required =
            calculateExpression(expression);

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

        requiredInput.value =
            expression === ""
                ? ""
                : formatNumber(required);

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
        updateRowState(index);
    });

    totalOrderElement.textContent =
        `${formatNumber(totalOrder)} кг`;

    saveCurrentData();

    if (hasError && showAlert) {
        alert(
            "Има неправилно попълнени полета."
        );
    }
}

/* Автоматична височина */

function resizeExpressionInput() {
    expressionInput.style.height = "auto";

    const newHeight = Math.min(
        expressionInput.scrollHeight,
        112
    );

    expressionInput.style.height =
        `${Math.max(newHeight, 52)}px`;
}

/* Долен прозорец */

function openExpressionModal(index) {
    activeProductIndex = index;

    const requiredInput =
        document.querySelector(
            `.required-input[data-index="${index}"]`
        );

    modalProductName.textContent =
        products[index];

    expressionInput.textContent =
    requiredInput.dataset.expression || "";

    expressionError.textContent = "";

    updateExpressionPreview();
    resizeExpressionInput();

    expressionModal.classList.add("open");

    expressionModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-open"
    );

    
}

function closeExpressionModal() {
    expressionModal.classList.remove("open");

    expressionModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-open"
    );

    modalContent.style.transform = "";
    modalContent.style.transition = "";

    activeProductIndex = null;
    expressionError.textContent = "";
}

function updateExpressionPreview() {
    const result =
    calculateExpression(
        expressionInput.textContent
    );

    if (result === null) {
        expressionTotal.textContent = "—";

        expressionError.textContent =
            "Използвай формат: 20+30+12";

        return;
    }

    expressionError.textContent = "";

    expressionTotal.textContent =
        `${formatNumber(result)} кг`;
}

function saveExpression() {
    if (activeProductIndex === null) {
        return;
    }

    const expression =
    expressionInput.textContent
        .replaceAll(" ", "")
        .replaceAll("\n", "");

    const result =
        calculateExpression(expression);

    if (result === null) {
        expressionError.textContent =
            "Неправилен формат. Използвай: 20+30+12";

        expressionInput.focus();
        return;
    }

    const requiredInput =
        document.querySelector(
            `.required-input[data-index="${activeProductIndex}"]`
        );

    requiredInput.dataset.expression =
        expression;

    requiredInput.value =
        expression === ""
            ? ""
            : formatNumber(result);

    calculateOrders(false);
    closeExpressionModal();
}

function updateRowState(index) {

    const row =
        document.querySelectorAll(".product-row")[index];

    if (!row) return;

    const stockInput =
        document.querySelector(
            `.stock-input[data-index="${index}"]`
        );

    const requiredInput =
        document.querySelector(
            `.required-input[data-index="${index}"]`
        );

    const stock =
        Number(stockInput.value.replace(",", ".")) || 0;

    const required =
        calculateExpression(
            requiredInput.dataset.expression || ""
        ) || 0;

    if (stock > 0 || required > 0) {
        row.classList.add("active");
    } else {
        row.classList.remove("active");
    }
}
/* Запазване в браузъра */

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
                expression:
                    requiredInput.dataset.expression || ""
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

            /*
                Поддържа и данните,
                записани от старата версия.
            */
            const savedExpression =
                savedItem.expression ??
                savedItem.required ??
                "";

            requiredInput.dataset.expression =
                savedExpression;

            const result =
                calculateExpression(savedExpression);

            requiredInput.value =
                savedExpression !== "" &&
                result !== null
                    ? formatNumber(result)
                    : "";
        });

        calculateOrders(false);
    } catch (error) {
        console.error(
            "Грешка при зареждане:",
            error
        );

        workDateInput.value =
            getCurrentDate();
    }
}

/* Изчистване */

function clearCurrentData() {
    const confirmed = confirm(
        "Сигурен ли си, че искаш да изчистиш всички въведени данни?"
    );

    if (!confirmed) {
        return;
    }

    document
        .querySelectorAll(".stock-input")
        .forEach((input) => {
            input.value = "";

            input.classList.remove(
                "input-error"
            );
        });

    document
        .querySelectorAll(".required-input")
        .forEach((input) => {
            input.value = "";
            input.dataset.expression = "";
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

/* Таблица */

productsTable.addEventListener(
    "click",
    (event) => {
        const requiredInput =
            event.target.closest(
                ".required-input"
            );

        if (!requiredInput) {
            return;
        }

        const index =
            Number(requiredInput.dataset.index);

        openExpressionModal(index);
    }
);

productsTable.addEventListener(
    "input",
    (event) => {
        if (
            event.target.classList.contains(
                "stock-input"
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
        calculateOrders(true);
    }
);

clearButton.addEventListener(
    "click",
    clearCurrentData
);

/* Събития на прозореца */

expressionInput.addEventListener(
    "input",
    () => {
        resizeExpressionInput();
        updateExpressionPreview();
    }
);

saveExpressionButton.addEventListener(
    "click",
    saveExpression
);

closeModalButton.addEventListener(
    "click",
    closeExpressionModal
);

modalBackdrop.addEventListener(
    "click",
    closeExpressionModal
);

document.addEventListener(
    "keydown",
    (event) => {
        if (
            event.key === "Escape" &&
            expressionModal.classList.contains(
                "open"
            )
        ) {
            closeExpressionModal();
        }
    }
);

/* Свайп надолу */

let sheetStartY = 0;
let sheetCurrentY = 0;
let isDraggingSheet = false;

function startSheetDrag(event) {
    const touch =
        event.touches[0];

    sheetStartY =
        touch.clientY;

    sheetCurrentY =
        touch.clientY;

    isDraggingSheet = true;

    modalContent.style.transition =
        "none";
}

function moveSheetDrag(event) {
    if (!isDraggingSheet) {
        return;
    }

    const touch =
        event.touches[0];

    sheetCurrentY =
        touch.clientY;

    const distance = Math.max(
        sheetCurrentY - sheetStartY,
        0
    );

    modalContent.style.transform =
        `translateY(${distance}px)`;
}

function finishSheetDrag() {
    if (!isDraggingSheet) {
        return;
    }

    isDraggingSheet = false;

    const distance =
        sheetCurrentY - sheetStartY;

    modalContent.style.transition = "";

    if (distance > 90) {
        closeExpressionModal();
        return;
    }

    modalContent.style.transform = "";
}

sheetHandle.addEventListener(
    "touchstart",
    startSheetDrag,
    { passive: true }
);

sheetHandle.addEventListener(
    "touchmove",
    moveSheetDrag,
    { passive: true }
);

sheetHandle.addEventListener(
    "touchend",
    finishSheetDrag
);

sheetHandle.addEventListener(
    "touchcancel",
    finishSheetDrag
);

/* Стартиране */

createProductsTable();
loadCurrentData();