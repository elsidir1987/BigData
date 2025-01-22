document.addEventListener("DOMContentLoaded", () => {
    const dataTable = document.getElementById("data-table").querySelector("tbody");
    let data = []; // Κύριος πίνακας δεδομένων

    // 1. Φόρτωση δεδομένων από CSV
    const loadCSVData = () => {
        fetch('data.csv')
            .then(response => {
                console.log('Response from fetch: ',response);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.text();
            })
            .then(csv => {
                console.log('Raw CSV data: ',csv)
                const rows = csv.trim().split('\n').slice(1); // Αγνοεί την πρώτη γραμμή (κεφαλίδα)
                console.log('Processed rows:',rows);
                data = rows.map(row => {
                    const [invoice_no, customer_id, gender, age, category, quantity, price, payment_method, invoice_date, shopping_mall] = row.split(',');
                    return {
                        invoice_no,
                        customer_id,
                        gender,
                        age: parseInt(age),
                        category,
                        quantity: parseInt(quantity),
                        price: parseFloat(price),
                        payment_method,
                        invoice_date,
                        shopping_mall
                    };
                });
                console.log('Processed data:',data);
                displayData(); // Εμφάνιση των δεδομένων στον πίνακα
            })
            .catch(err => console.error('Σφάλμα κατά τη φόρτωση του CSV:', err));
    };

    // 2. Εμφάνιση δεδομένων στον πίνακα
const displayData = () => {
    dataTable.innerHTML = ""; // Καθαρισμός πίνακα
    if (Array.isArray(data)){
        data.forEach((entry, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${entry.invoice_no}</td>
                <td>${entry.customer_id}</td>
                <td>${entry.gender}</td>
                <td>${entry.age}</td>
                <td>${entry.category}</td>
                <td>${entry.quantity}</td>
                <td>${entry.price.toFixed(2)}</td>
                <td>${entry.payment_method}</td>
                <td>${entry.invoice_date}</td>
                <td>${entry.shopping_mall}</td>
                <td>
                    <button class="edit-btn" data-index="${index}">Επεξεργασία</button>
                </td>
            `;
            dataTable.appendChild(row);
        });
        attachEditButtons(); // Ενεργοποίηση κουμπιών επεξεργασίας
        }
    };
    console.log('Περιεχόμενο της data:', data);
    console.log('Είναι πίνακας:', Array.isArray(data));

    // 3. Προσθήκη νέας εγγραφής
    const addNewEntry = () => {
        const newEntry = {
            invoice_no: `INV${String(data.length + 1).padStart(3, '0')}`,
            customer_id: prompt("ID Πελάτη:"),
            gender: prompt("Φύλο:"),
            age: parseInt(prompt("Ηλικία:")),
            category: prompt("Κατηγορία:"),
            quantity: parseInt(prompt("Ποσότητα:")),
            price: parseFloat(prompt("Τιμή:")),
            payment_method: prompt("Τρόπος Πληρωμής:"),
            invoice_date: prompt("Ημερομηνία (π.χ. 2025-01-21):"),
            shopping_mall: prompt("Πολυκατάστημα:")
        };
        data.push(newEntry);
        displayData();
    };

    // 4. Επεξεργασία υπάρχουσας εγγραφής
    const editEntry = (index) => {
        const entry = data[index];
        entry.customer_id = prompt("Νέο ID Πελάτη:", entry.customer_id);
        entry.gender = prompt("Νέο Φύλο:", entry.gender);
        entry.age = parseInt(prompt("Νέα Ηλικία:", entry.age));
        entry.category = prompt("Νέα Κατηγορία:", entry.category);
        entry.quantity = parseInt(prompt("Νέα Ποσότητα:", entry.quantity));
        entry.price = parseFloat(prompt("Νέα Τιμή:", entry.price));
        entry.payment_method = prompt("Νέος Τρόπος Πληρωμής:", entry.payment_method);
        entry.invoice_date = prompt("Νέα Ημερομηνία:", entry.invoice_date);
        entry.shopping_mall = prompt("Νέο Πολυκατάστημα:", entry.shopping_mall);
        displayData();
    };

    // Ενεργοποίηση κουμπιών επεξεργασίας
    const attachEditButtons = () => {
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", () => {
                const index = button.getAttribute("data-index");
                editEntry(index);
            });
        });
    };

    // 5. Εξαγωγή δεδομένων σε CSV
    const exportToCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "invoice_no,customer_id,gender,age,category,quantity,price,payment_method,invoice_date,shopping_mall\n";
        data.forEach(entry => {
            csvContent += `${entry.invoice_no},${entry.customer_id},${entry.gender},${entry.age},${entry.category},${entry.quantity},${entry.price},${entry.payment_method},${entry.invoice_date},${entry.shopping_mall}\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Κουμπιά Προσθήκης και Εξαγωγής
    document.getElementById("add-entry").addEventListener("click", addNewEntry);
    document.getElementById("download-csv").addEventListener("click", exportToCSV);

    // Αρχική Φόρτωση Δεδομένων
    loadCSVData();
});