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
