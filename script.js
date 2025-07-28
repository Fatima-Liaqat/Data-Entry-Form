document.addEventListener('DOMContentLoaded', function () 
{
    let data = JSON.parse(localStorage.getItem('formData')) || [];
    let updatedIndex = -1;

    const form = document.getElementById('dataForm');
    const table = document.querySelector('table tbody');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('resetBtn');
     const resetDiv = document.querySelector(".data-display-section");

    function renderTable() 
    {
        table.innerHTML = '';
        if (data.length === 0) 
        {
            resetDiv.style.display = "none";
            return;
        }

    
        resetDiv.style.display = "block";
            data.forEach((entry, index) => 
            {
                const row = document.createElement('tr');

                const first_name = document.createElement('td');
                first_name.textContent = entry.first_name;
                row.appendChild(first_name);

                const last_name = document.createElement('td');
                last_name.textContent = entry.last_name;
                row.appendChild(last_name);

                const email = document.createElement('td');
                email.textContent = entry.email;
                row.appendChild(email);

                const phone = document.createElement('td');
                phone.textContent = entry.phone;
                row.appendChild(phone);

                const update = document.createElement('td');
                const update_btn = document.createElement('button');
                update_btn.textContent = 'Update';
                update_btn.onclick = () => editEntry(index);
                update.appendChild(update_btn);
                row.appendChild(update);

                table.appendChild(row);
            });

            localStorage.setItem('formData', JSON.stringify(data));
    }

    form.addEventListener('submit', function (e) 
    {
        e.preventDefault();
        const f_name = document.getElementById('first_name').value;
        const l_name = document.getElementById('last_name').value;
        const mail = document.getElementById('email').value;
        const contact = document.getElementById('phone').value;

        const newEntry = 
        {
            first_name: f_name,
            last_name: l_name,
            email: mail,
            phone: contact,
        };

        if (updatedIndex > -1) 
        {
            data[updatedIndex] = newEntry;
            updatedIndex = -1;
        } 
        else 
        {
            data.push(newEntry);
        }

        form.reset();
        renderTable();
    });
    resetBtn.addEventListener("click", function() 
    {
        localStorage.removeItem("formData"); // Clear localStorage
        data = []; 
        renderTable(); 
    });
    function editEntry(index) 
    {
        const entry = data[index];
        document.getElementById('first_name').value = entry.first_name;
        document.getElementById('last_name').value = entry.last_name;
        document.getElementById('email').value = entry.email;
        document.getElementById('phone').value = entry.phone;
        updatedIndex = index;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    downloadBtn.addEventListener('click', function () 
    {
        if (!data.length) 
        {
            alert('No data to download!');
            return;
        }

        const csvRows = [];
        const headers = ['First Name', 'Last Name', 'Email', 'Phone'];
        csvRows.push(headers.join(','));

        data.forEach(entry => 
        {
            const values = [
                entry.first_name,
                entry.last_name,
                entry.email,
                entry.phone,
            ];
            csvRows.push(values.join(','));
        });

        const csvData = csvRows.join('\n');
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'form_data.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    renderTable();
});
