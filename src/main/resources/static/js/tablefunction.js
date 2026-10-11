//filDataIntoTable	Direct Edit/Delete/Print buttons
//filDataIntoTable2	3 dot dropdown actions
//filDataIntoTable3	Radio select row
//filDataIntoTable4	Row click select
//filDataIntoTable5	Row click + edit function

// 1. filDataIntoTable use karana widihata

/* filDataIntoTable(
    tableStudent,
    studentList,
    displayPropertyList,
    editStudent,
    deleteStudent,
    printStudent
); */

// 2. filDataIntoTable2 use karana widihata

/* filDataIntoTable2(
    tableStudent,
    studentList,
    displayPropertyList,
    editStudent,
    deleteStudent,
    printStudent
);
 */
// 3. filDataIntoTable3 use karana widihata

/* filDataIntoTable3(
    tableStudent,
    studentList,
    displayPropertyList,
    true,
    modifyRow
); */

// 4. filDataIntoTable4 use karana widihata

/* filDataIntoTable4(
    tableStudent,
    studentList,
    displayPropertyList,
    true,
    modifyRow
); */

// 5. filDataIntoTable5 use karana widihata

/* filDataIntoTable5(
    tableStudent,
    studentList,
    displayPropertyList,
    editStudent,
    true,
    modifyRow
); */

/* const tableStudent = document.querySelector("#tableStudent");

const studentList = getDataAjaxGetRequestForString("/student/alldata");

const displayPropertyList = [
    {
        property: "studentno",
        datatype: "text"
    },
    {
        property: "fullname",
        datatype: "text"
    },
    {
        property: "mobile",
        datatype: "text"
    }
];

const modifyRow = document.querySelector("#modifyRow"); */

//create function for fill data into table
const filDataIntoTable = (tableId, datalist, displayPropertyList, editfunction, deletefunction, printfunction, buttonVisibility = true) => {
    // const table=document.querySelector('#');
    const tableBody = tableId.children[1];
    tableBody.innerHTML = '';

    datalist.forEach((element, index) => {

        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);

        displayPropertyList.forEach((ob, ind) => {
            const td = document.createElement('td');
            // td.innerText='jp';

            if (ob.datatype == 'text') {
                td.innerText = element[ob.property];

            }
            if (ob.datatype == 'function') {
                td.innerHTML = ob.property(element);

            }

            tr.appendChild(td);
        })


        const tdButton = document.createElement('td');

        const buttonEdit = document.createElement('button');
        buttonEdit.className = 'btn btn-edit fw-bold table-input form-input';
        buttonEdit.innerHTML = '<i class="fa-solid fa-edit "></i> Edit';
        buttonEdit.onclick = () => {
            editfunction(element, index);
        }

        const buttonDelete = document.createElement('button');
        buttonDelete.className = 'btn btn-delete fw-bold table-input ms-1 me-1 form-input';
        buttonDelete.innerHTML = '<i class="fa-solid fa-trash "></i> Delete';
        buttonDelete.onclick = () => {
            deletefunction(element, index);
        }

        const buttonPrint = document.createElement('button');
        buttonPrint.className = 'btn btn-print fw-bold table-input form-input';
        buttonPrint.innerHTML = '<i class="fa-solid fa-eye "></i> Print';
        buttonPrint.onclick = () => {
            printfunction(element, index);
        }

        tdButton.appendChild(buttonEdit);
        tdButton.appendChild(buttonDelete);
        tdButton.appendChild(buttonPrint);



        /*  tr.appendChild(tdfullname);
         tr.appendChild(tdnic);
         tr.appendChild(tdemail);
         tr.appendChild(tdmobile);
         tr.appendChild(tdstatus); */


        if (buttonVisibility) {
            tr.appendChild(tdButton);
        }


        tableBody.appendChild(tr);

    });
}


//create function for fill data into table2
const filDataIntoTable2 = (tableId, datalist, displayPropertyList, editfunction, deletefunction, printfunction, buttonVisibility = true) => {
    // const table=document.querySelector('#');
    const tableBody = tableId.children[1];
    tableBody.innerHTML = '';

    datalist.forEach((element, index) => {

        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);

        displayPropertyList.forEach((ob, ind) => {
            const td = document.createElement('td');
            // td.innerText='jp';

            if (ob.datatype == 'text') {
                td.innerText = element[ob.property];

            }
            if (ob.datatype == 'function') {
                td.innerHTML = ob.property(element);

            }

            tr.appendChild(td);
        })

        const tdButton = document.createElement('td');
        tdButton.className = 'text-center';

        const dropdownDiv = document.createElement('div');
        dropdownDiv.className = 'dropdown mt-2';

        const dropdownI = document.createElement('i');
        dropdownI.className = 'fa solid fa-ellipsis-vertical btn fa-beat';
        dropdownI.setAttribute('data-bs-toggle', 'dropdown');
        dropdownI.setAttribute('aria-expanded', 'false');


        const dropdownUL = document.createElement('ul');
        dropdownUL.className = 'dropdown-menu';

        const dropdownLiEdit = document.createElement('li');
        dropdownLiEdit.className = 'dropdown-item';

        const dropdownLiDelete = document.createElement('li');
        dropdownLiDelete.className = 'dropdown-item';

        const dropdownLiPrint = document.createElement('li');
        dropdownLiPrint.className = 'dropdown-item';

        dropdownUL.appendChild(dropdownLiEdit);
        dropdownUL.appendChild(dropdownLiDelete);
        dropdownUL.appendChild(dropdownLiPrint);

        dropdownDiv.appendChild(dropdownUL);
        dropdownDiv.appendChild(dropdownI);
        tdButton.appendChild(dropdownDiv);

        const buttonEdit = document.createElement('button');
        buttonEdit.className = 'btn fw-bold fa-solid fa-edit btn-primary form-input';
        buttonEdit.innerText = '';
        // buttonEdit.innerHTML='<i class="fa-solid da-trash"></i>';
        buttonEdit.onclick = function () {
            //console.log("Edit");
            editfunction(element, index);
        }
        dropdownLiEdit.appendChild(buttonEdit);


        const buttonDelete = document.createElement('button');
        buttonDelete.className = 'btn fw-bold fa-solid fa-trash btn-danger form-input';
        buttonDelete.innerText = '';

        buttonDelete.onclick = () => {
            /* console.log("Delete");
            console.log(element);

            confirm() */
            deletefunction(element, index);
        }
        dropdownLiDelete.appendChild(buttonDelete);

        const buttonPrint = document.createElement('button');
        buttonPrint.className = 'btn fw-bold fa-solid fa-eye  btn-success form-input';
        buttonPrint.innerText = '';
        buttonPrint.onclick = () => {
            //console.log("Print");
            printfunction(element, index);
        }
        dropdownLiPrint.appendChild(buttonPrint);
        /* tdButton.appendChild(buttonEdit);
        tdButton.appendChild(buttonDelete);
        tdButton.appendChild(buttonPrint);
 */

        if (buttonVisibility) {
            tr.appendChild(tdButton);
        }

        tableBody.appendChild(tr);

    });
}

//create function for fill data into table3
const filDataIntoTable3 = (tableId, datalist, displayPropertyList, buttonVisibility = true, modiryRow) => {
    // const table=document.querySelector('#');
    const tableBody = tableId.children[1];
    tableBody.innerHTML = '';

    datalist.forEach((element, index) => {

        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);

        displayPropertyList.forEach((ob, ind) => {
            const td = document.createElement('td');
            // td.innerText='jp';

            if (ob.datatype == 'text') {
                td.innerText = element[ob.property];

            }
            if (ob.datatype == 'function') {
                td.innerHTML = ob.property(element);

            }

            tr.appendChild(td);

        })



        const tdButton = document.createElement('td');
        tdButton.className = 'text-center';

        const inputRadio = document.createElement('input');
        inputRadio.type = 'radio';
        inputRadio.name = 'modify';
        inputRadio.className = 'form-check-input mt-2';
        inputRadio.onclick = () => {
            window['editOb'] = element;
            window['editRow'] = index;
            modiryRow.classList.remove('d-none');
        }



        tdButton.appendChild(inputRadio);



        if (buttonVisibility) {
            tr.appendChild(tdButton);
        }


        tableBody.appendChild(tr);

    });
}

const filDataIntoTable4 = (tableId, datalist, displayPropertyList, buttonVisibility = true, modiryRow) => {
    // const table=document.querySelector('#');
    const tableBody = tableId.children[1];
    tableBody.innerHTML = '';

    datalist.forEach((element, index) => {

        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);

        displayPropertyList.forEach((ob, ind) => {
            const td = document.createElement('td');
            // td.innerText='jp';

            if (ob.datatype == 'text') {
                td.innerText = element[ob.property];

            }
            if (ob.datatype == 'function') {
                td.innerHTML = ob.property(element);

            }

            tr.appendChild(td);

        })









        if (buttonVisibility) {
            tr.onclick = () => {
                window['editOb'] = element;
                window['editRow'] = index;
                modiryRow.classList.remove('d-none');
            }

        }


        tableBody.appendChild(tr);

    });
}

const filDataIntoTable5 = (tableId, datalist, displayPropertyList, editfunction, buttonVisibility = true, modiryRow) => {
    // const table=document.querySelector('#');
    const tableBody = tableId.children[1];
    tableBody.innerHTML = '';

    datalist.forEach((element, index) => {

        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);

        displayPropertyList.forEach((ob, ind) => {
            const td = document.createElement('td');
            // td.innerText='jp';

            if (ob.datatype == 'text') {
                td.innerText = element[ob.property];

            }
            if (ob.datatype == 'function') {
                td.innerHTML = ob.property(element);

            }

            tr.appendChild(td);

        })


        if (buttonVisibility) {
            tr.onclick = () => {
                //console.log('edit-1');
                editfunction(element, index);
                window['editOb'] = element;
                window['editRow'] = index;
                modiryRow.classList.remove('d-none');
            }

        }


        tableBody.appendChild(tr);

    });
}