const cvData = {
    "Şəxsi məlumatlar": [
        ["Ad Soyad", "Akbar Gafarov"],
        ["Telefon", "+994103138723"],
        ["E-poçt", "Ekberqafarov06@gmail.com"],
        ["Ünvan", "Bakı şəhəri,Nizami rayonu,Özbəkistan küçəsi 9"]
    ],
    "Təhsil": [
        ["Universitet", "Azərbaycan Texniki Universiteti"],
        ["İxtisas", "İnformasiya Təhlükəsizliyi,Kibertəhlükəsizlik"],
        ["Qrup", "6424A2"],
        ["Kurs", "I kurs"]
    ],
    "Bacarıqlar": [
        ["Windows,Linux", "Windows və Linux əməliyyat sistemi bilikləri"],
        ["Kali Linux", "Əməliyyat sistemi bilikləri və alətlərlə işləmə bacarığı"],
        ["Proqramlaşdırma", "Orta səviyyədə baza bilikləri"],
        ["Şəbəkə", "Orta səviyyədə şəbəkə bilikləri və helpdesk bilikləri"]
    ],
    "Layihələr": [
        ["Layihə", "Universitet tərkibində layihələrdə iştirak etmişəm"]
    ]
};
function renderCV() {
    const container = document.getElementById("cvSections");
    container.innerHTML = "";
    Object.keys(cvData).forEach(section => {
        const sectionDiv = document.createElement("div");
        sectionDiv.className = "section";

        const button = document.createElement("button");
        button.className = "accordion";
        button.textContent = section;
        sectionDiv.appendChild(button);

        const panel = document.createElement("div");
        panel.className = "panel";

        const table = document.createElement("table");
        const header = document.createElement("tr");
        header.innerHTML = `<th>${section}</th><th>Təsviri</th><th>Əməliyyat</th>`;
        table.appendChild(header);

        cvData[section].forEach((entry, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td contenteditable="true">${entry[0]}</td>
                <td contenteditable="true">${entry[1]}</td>
                <td>
                    <button onclick="saveEntry('${section}', ${index})">Yadda saxla</button>
                    <span class="delete-btn" onclick="deleteEntry('${section}', ${index})">X</span>
                </td>
            `;
            table.appendChild(row);
        });

        panel.appendChild(table);

        const addBtn = document.createElement("button");
        addBtn.className = "add-entry-btn";
        addBtn.textContent = "Yeni məlumat əlavə et";
        addBtn.onclick = () => addEntry(section);
        panel.appendChild(addBtn);

        sectionDiv.appendChild(panel);
        container.appendChild(sectionDiv);
    });

    document.querySelectorAll(".accordion").forEach(btn => {
        btn.addEventListener("click", function () {
            this.classList.toggle("active");
            const panel = this.nextElementSibling;
            panel.style.display = panel.style.display === "block" ? "none" : "block";
        });
    });
}

function addEntry(section) {
    cvData[section].push(["Yeni başlıq", "Yeni təsvir"]);
    renderCV();
}

function deleteEntry(section, index) {
    cvData[section].splice(index, 1);
    renderCV();
}

function saveEntry(section, index) {
    const table = document.querySelectorAll(".section")[Object.keys(cvData).indexOf(section)]
        .querySelector("table");
    const row = table.rows[index + 1];
    const key = row.cells[0].innerText;
    const value = row.cells[1].innerText;
    cvData[section][index] = [key, value];
}

document.addEventListener("DOMContentLoaded", renderCV);
// 1. LocalStorage-dən oxuma
document.addEventListener("DOMContentLoaded", () => {
    const savedData = localStorage.getItem('cvData');
    if (savedData) {
        Object.assign(cvData, JSON.parse(savedData));
    }
    renderCV();
});

// 2. Validation funksiyası
function validateEntry(section, key, value) {
    if (!key.trim() || !value.trim()) {
        return "Boş sahələr yolverilməzdir.";
    }

    if (section === "Şəxsi məlumatlar") {
        if (key.toLowerCase().includes("ad soyad")) {
            // Ad Soyad yalnız hərflərdən ibarət olmalıdır (space daxil olmaqla)
            const nameRegex = /^[A-Za-zƏəÖöÜüĞğİıŞşÇç\s]+$/u;
            if (!nameRegex.test(value)) {
                return "Ad Soyad sahəsində yalnız hərflər və boşluq ola bilər.";
            }
        }

        if (key.toLowerCase().includes("telefon")) {
            // Telefon nömrəsi formatı: +994XXXXXXXXX (yəni +994 + 9 rəqəm)
            const phoneRegex = /^\+994\d{9}$/;
            if (!phoneRegex.test(value)) {
                return "Telefon nömrəsi +994XXXXXXXXX formatında olmalıdır.";
            }
        }

        if (key.toLowerCase().includes("e-poçt")) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return "Zəhmət olmasa düzgün e-poçt daxil edin.";
            }
        }
    }

    return null; // səhv yoxdur
}

// 3. saveEntry funksiyasını yenilə
function saveEntry(section, index) {
    const table = document.querySelectorAll(".section")[Object.keys(cvData).indexOf(section)]
        .querySelector("table");
    const row = table.rows[index + 1];
    const keyCell = row.cells[0];
    const valueCell = row.cells[1];

    // Xəta mesajı varsa əvvəlcə varsa sil
    let errorMsg = row.querySelector(".error-msg");
    if (errorMsg) errorMsg.remove();

    const key = keyCell.innerText;
    const value = valueCell.innerText;

    const error = validateEntry(section, key, value);
    if (error) {
        // Xəta mesajını göstər
        const errSpan = document.createElement("span");
        errSpan.className = "error-msg";
        errSpan.style.color = "red";
        errSpan.textContent = error;
        valueCell.appendChild(errSpan);
        return; // yadda saxlamırıq
    }

    // Yadda saxla və localStorage-a yaz
    cvData[section][index] = [key, value];
    localStorage.setItem('cvData', JSON.stringify(cvData));
}

// 4. addEntry funksiyasında da localStorage-a yaz
function addEntry(section) {
    cvData[section].push(["Yeni başlıq", "Yeni təsvir"]);
    localStorage.setItem('cvData', JSON.stringify(cvData));
    renderCV();
}

// 5. deleteEntry funksiyasında da localStorage-a yaz
function deleteEntry(section, index) {
    cvData[section].splice(index, 1);
    localStorage.setItem('cvData', JSON.stringify(cvData));
    renderCV();
}
localStorage.setItem('cvData', JSON.stringify(cvData));
