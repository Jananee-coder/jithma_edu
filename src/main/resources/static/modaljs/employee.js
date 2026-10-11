//browser load event – page eka reload wenakota db eken employee data okkoma update wenawa.
//eka nisa employee table eka refresh wenna reusable function ekak hadala use karanawa.
//me function eka submission, update, delete awasthawal di call karanawa.
//advantage – code reusability ekak tiyenawa, code eka simple wenawa.

//browser load event
window.addEventListener("load", () => {

    // Logged-in user ta EMPLOYEE module eka sambandha permissions ganna
    userPrivilege = getDataAjaxGetRequest("/userprivilegebymodule?modulename=EMPLOYEE");

    //call table refresh function
    loadEmployeeTable();
    //call form refresh function
    loadEmployeeForm();
});

let textEmpFullname = document.querySelector("#textEmpFullname");
let textEmpNameWithInitial = document.querySelector("#textEmpNameWithInitial");
let selectCallingName = document.querySelector("#selectCallingName");
let textEmpNic = document.querySelector("#textEmpNic");
let textEmpAge = document.querySelector("#textEmpAge");
let radioMale = document.querySelector("#radioMale");
let radioFemale = document.querySelector("#radioFemale");
let dateEmpDob = document.querySelector("#dateEmpDob");
let selectEmpDesignation = document.querySelector("#selectEmpDesignation");
let selectEmployeeStatus = document.querySelector("#selectEmployeeStatus");
let tabFormButton = document.querySelector("#tabFormButton");
let labelEmployeeStatus = document.querySelector("#labelEmployeeStatus");
let divSelectEmployeeStatus = document.querySelector("#divSelectEmployeeStatus");
// employee photo default preview image eka
let defaultPhoto = "images/usericon.jpg";

// Define designation Function
const getDesignation = (dataOb) => dataOb.designation_id.name;

// Define employee status Function
const getEmployeeStatus = (dataOb) => {
    const status = dataOb.employeestatus_id.name;

    if (status === "Working") {
        return `<span style="color: green; font-weight: bold;">${status}</span>`;
    }
    if (status === "Deleted") {
        return `<span style="color: red; font-weight: bold;">${status}</span>`;
    }
    if (status === "Resign") {
        return `<span style="color: orange; font-weight: bold;">${status}</span>`;
    }
    // Unknown status
    return `<span>${status}</span>`;
}

const loadEmployeeTable = () => {
    // create empty array for catch many objects 
    employees = new Array();
    // backend eken guardian okkoma gannawa
    employees = getDataAjaxGetRequest("/employee/alldata");
    employees.reverse();//decending kra

    //string-string,numbers,date
    //function-object,array,boolean,image
    //create property array
    let displayColumns = [
        { property: "empno", dataType: "string" },
        { property: "fullname", dataType: "string" },
        //{ property: "callingname", dataType: "string" },
        //{ property: "nic", dataType: "string" },
        // { property: "email", dataType: "string" },
        // { property: "mobileno", dataType: "string" },
        // { property: "gender", dataType: "string" },
        // { property: "photo", dataType: "image" },
        { property: getDesignation, dataType: "function" },
        { property: getEmployeeStatus, dataType: "function" }
    ];

    // Call fillDataIntoTable function
    loadTableData(tableBodyEmployee, employees, displayColumns, printEmployee, editEmployee, deleteEmployee);

    for (const index in employees) {
        // Update permission naththm – update button hide karanawa
        if (!userPrivilege.privi_update) {
            tableBodyEmployee.children[index].children[5].children[1].style.display = "none";
        }
        // Delete permission naththm – delete button hide karanawa
        if (!userPrivilege.privi_delete) {
            tableBodyEmployee.children[index].children[5].children[2].style.display = "none";
        }
    }
    $('#tableEmployee').dataTable();
}
// define function to load employee form
const loadEmployeeForm = () => {

    tabFormButton.innerText = "Add Employee";

    // form eka reset karanawa (input walata dapu values okkoma clear wenawa)
    formEmployee.reset();

    // empty object ekak hadanawa → data binding walata use wenna
    employee = new Object();

    selectCallingName.innerHTML = "";

    // DB eken okkoma designations ganna -> dropdown ekata load karanna
    let designations = getDataAjaxGetRequest("/designation/alldata");
    loadSelectOptions(selectEmpDesignation, designations, "Select Designation...!", "name");

    // employee status dropdown eka load karanawa 
    // DB eken okkoma employeestatuses ganna -> dropdown ekata load karanna
    let employeestatuses = getDataAjaxGetRequest("/employeestatus/alldata");
    loadSelectOptions(selectEmployeeStatus, employeestatuses, "Select Employee Status...!", "name");

    // DOB, age clear karanawa
    dateEmpDob.value = "";
    dateEmpDob.disabled = true;
    textEmpAge.value = "";
    //employee status set working
    employee.employeestatus_id = { id: 1, name: "Working" };
    selectEmployeeStatus.value = JSON.stringify(employee.employeestatus_id);

    // Hide Employee Status label and select
    labelEmployeeStatus.style.display = "none";
    divSelectEmployeeStatus.style.display = "none";

    // User ta insert privilege naththam form buttons hide karanawa
    if (!userPrivilege.privi_insert) {
        tabFormButton.style.display = "none";   // "Add New" button hide
        buttonSubmit.style.display = "none";    // "Save" button hide
    }
    // --- Buttons control karanawa ---
    buttonUpdate.style.display = "none"; // update button hide
    buttonSubmit.style.display = "block"; // submit button show

    // form eke tiyena input, select, radio okkoma border colour / UI reset karanawa
    setUIColour([textEmpFullname, textEmpNameWithInitial, selectCallingName, textEmpNic, textEmpAge, radioMale, radioFemale, dateEmpDob, textEmpMobileno, textEmpLandno, textEmpEmail, textEmpAddress, selectEmpDesignation, selectEmpCivilStatus, selectEmployeeStatus]);

    let tableTab = new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabTableArea"]'));
    tableTab.show(); // form tab hide karanna epa, table tab activate wenawa
}

// define fullname validation function
const textFullnameValidator = () => {

    // input eke value gannawa
    let fullname = textEmpFullname.value;

    // regex pattern define karanawa
    let regPattern = new RegExp("^([A-Z][a-z]{2,20}(\\s)){1,20}([Dd]e\\s)?([A-Z][a-z]{2,20})$");
    // regex pattern:
    // ^ → string eka start wenna one
    // ([A-Z][a-z]{2,20}(\\s)){1,20} → first name(s) capital letter + simple letters, 1–20 words + space
    // ([Dd]e\\s)? → middle name "de" ekak thiyenawanam allow karanawa, optional
    // ([A-Z][a-z]{2,20}) → last name capital letter + simple letters
    // $ → string eka end wenna one

    if (regPattern.test(fullname)) {
        // valid → green border 2px
        textEmpFullname.style.border = '2px solid green';
        employee.fullname = fullname; // data bind karanawa

        // calling name select box clear karanawa (html eke thiyna)
        selectCallingName.innerHTML = "";

        // first option eka default message set karanawa
        let optionMsg = document.createElement("option");
        optionMsg.selected = "selected";
        optionMsg.disabled = "disabled";
        optionMsg.value = "";
        optionMsg.innerText = "Select Calling name..!";
        selectCallingName.appendChild(optionMsg);

        // fullname eka split karala option walata danawa
        let nameParts = fullname.split(" ");
        nameParts.forEach(namePart => {
            let option = document.createElement("option");
            option.value = namePart;
            option.innerText = namePart;
            selectCallingName.appendChild(option);
        });

        // name with initial hadanna variable ekak hadanawa
        let nameWithInitial = "";

        // last name eka hariyata passe ganna nisa, me loop eka first names walata witharai
        nameParts.forEach((namePart, index) => {
            if (index < nameParts.length - 1) {
                // charAt(0) → word eke first letter eka gannawa
                // toUpperCase() → eka capital letter karanawa
                // + "." → eka letter eke passe dot ekak dila initials wage hadanawa (e.g. P. or S.)
                nameWithInitial += namePart.charAt(0).toUpperCase() + ".";
            }
        });
        // anthimata last name eka gannawa
        nameWithInitial +=
            nameParts[nameParts.length - 1].charAt(0).toUpperCase() +
            nameParts[nameParts.length - 1].substring(1);

        // initials input eke value set karanawa
        textEmpNameWithInitial.value = nameWithInitial;
        textEmpNameWithInitial.style.border = '2px solid green';
        // data bind karanawa
        employee.nameWithInitial = nameWithInitial;

    } else {
        // invalid → red border 2px
        textEmpFullname.style.border = '2px solid red';
        textEmpNameWithInitial.style.border = '2px solid red';
        //selectCallingName.style.border = '2px solid red';
        employee.nameWithInitial = null; // clear karanawa

    }
}

// calling name validator
const callingNameValidator = () => {
    const callingname = selectCallingName.value;

    if (callingname) {
        selectCallingName.style.border = '2px solid green';
        employee.callingname = callingname;
    } else {
        selectCallingName.style.border = '2px solid red';
        employee.callingname = null;
    }
}

// NIC validate karana function eka define karanawa
const textNicValidator = () => {
    // User enter karana NIC eka gannawa
    let nic = textEmpNic.value;

    // NIC format validate karana regex
    // Matches karanne:
    // - old 10-digit NIC: 6,7,8,9 first digit + 7 digits + V/v/X/x/S/s
    // - new 12-digit NIC: 12 digits
    let regPattern = new RegExp("^((([6][56789][0-9]{7}[VvXxSs])|([7-9][0-9]{8}[VvXxSs]))|([0-9]{12}))$");

    // NIC valid nam
    if (regPattern.test(nic)) {
        let birthYear = "";
        let dayCount = "";  // NIC eke thiyana day count eka store karanna

        if (nic.length == 10) { // old 10-digit NIC nam
            birthYear = "19" + nic.substring(0, 2); // 19 + first 2 digits → birth year
            dayCount = nic.substring(2, 5);         // next 3 digits → day of year
        } else { // new 12-digit NIC nam
            birthYear = nic.substring(0, 4);       // first 4 digits → birth year
            dayCount = nic.substring(4, 7);        // next 3 digits → day of year
        }

        // age calculate karanawa
        let currentYear = new Date().getFullYear(); // current year gannawa
        let age = parseInt(currentYear) - parseInt(birthYear); // age calculate karanawa
        textEmpAge.value = age; // age input field ekata display karanawa
        employee.age = age;      // employee object ekata bind karanawa

        // valid age 18-60 check karanawa
        if (age >= 18 && age <= 60) {
            textEmpNic.style.border = '2px solid green'; // NIC field green wenawa
            textEmpAge.style.border = '2px solid green'; // Age field green wenawa
            employee.nic = nic; // employee object ekata NIC bind karanawa

            // DOB field enable karanawa
            dateEmpDob.disabled = false;

            // gender determine karanawa dayCount eka use karala
            let dayNumber = parseInt(dayCount);
            if (dayNumber > 500) { // female nam
                dayNumber -= 501; // 500 gihin pasuwa calculate karanawa
                radioFemale.checked = true;
                radioMale.checked = false;
                employee.gender = "Female";
            } else { // male nam
                radioMale.checked = true;
                radioFemale.checked = false;
                employee.gender = "Male";
            }

            // actual DOB calculate karanawa birthYear + dayNumber use karala
            let dob = new Date(birthYear, 0); // Jan 1 of birthYear
            dob.setDate(dayNumber);           // dayNumber add karanawa
            let formattedDOB = dob.getFullYear() + "-" +
                String(dob.getMonth() + 1).padStart(2, "0") + "-" +
                String(dob.getDate()).padStart(2, "0");

            dateEmpDob.value = formattedDOB;  // DOB input field set karanawa
            employee.dob = formattedDOB;      // employee object ekata bind karanawa
            dateEmpDob.style.border = '2px solid green'; // date field green wenawa

            /*  // DOB field min/max set karanawa date picker ekata
             dateEmpDob.min = birthYear + "-01-01";
             dateEmpDob.max = birthYear + "-12-31";
             employee.birthYear = parseInt(birthYear); */

        } else { // age valid nathnam
            textEmpNic.style.border = '2px solid red';
            textEmpAge.style.border = '2px solid red';
            textEmpAge.value = "Age not allowed"; // warning message
            dateEmpDob.value = "";                 // DOB clear karanawa
            dateEmpDob.disabled = true;
            employee.nic = null;
            employee.age = null;
            employee.gender = null;
            employee.dob = null;
            radioMale.checked = false;
            radioFemale.checked = false;
        }
    } else { // NIC invalid nam
        textEmpNic.style.border = '2px solid red';
        textEmpAge.style.border = '1px solid rgb(164, 201, 232)';
        textEmpAge.value = "";
        dateEmpDob.value = "";
        dateEmpDob.disabled = true;
        employee.dob = null;
        employee.nic = null;
        employee.age = null;
        employee.gender = null;
        radioMale.checked = false;
        radioFemale.checked = false;
    }
}

// me function eka form eke errors check karanna use karanne
const checkFormError = () => {
    let errors = ""; // Collect errors here empty string pass

    // current employee object eke Fullname check
    if (employee.fullname == null) {
        //thiyana errors ekata ekthu wenwa  "Please enter a valid Fullname. This is a required field pllehata ynna ona nisa br danwa
        errors += "Please enter a valid Fullname. This is a required field<br>";
        textEmpFullname.style.border = "1px solid red";
    }
    // Name with Initial check
    if (employee.nameWithInitial == null) {
        errors += "Please enter Name With Initial. This is a required field. <br>";
        //thiyna errors tikata nameinitial eken empty pass unoth thiyna erros tikata meka ekthu wenwa
        textEmpNameWithInitial.style.border = "1px solid red";
        //
    }
    // Calling name check
    if (employee.callingname == null) {
        errors += "Please enter Calling Name. This is a required field. <br>";
        selectCallingName.style.border = "1px solid red";
    }
    // NIC check
    if (employee.nic == null) {
        errors += "Please enter a valid NIC. This is a required field. <br>";
        textEmpNic.style.border = "1px solid red";
    }
    // Mobile number check
    if (employee.mobileno == null) {
        errors += "Please enter a valid Mobile Number. This is a required field. <br>";
        textEmpMobileno.style.border = "1px solid red";
    }
    // Gender check
    if (employee.gender == null) {
        errors += "Please select Gender. This is a required field. <br>";
    }
    // Designation check
    if (employee.designation_id == null) {
        errors += "Please select Designation. This is a required field.. <br>";
        selectEmpDesignation.style.border = "1px solid red";
    }
    // Date of Birth check
    if (employee.dob == null) {
        errors += "Please enter Date of Birth. This is a required field. <br>";
        dateEmpDob.style.border = "1px solid red";
    }
    // Email check
    if (employee.email == null) {
        errors += "Please enter a valid Email. This is a required field. <br>";
        textEmpEmail.style.border = "1px solid red";
    }
    // Civil Status check
    if (employee.civilstatus == null) {
        errors += "Please select Civil Status. This is a required field. <br>";
        selectEmpCivilStatus.style.border = "1px solid red";
    }
    // Address check
    if (employee.address == null) {
        errors += "Please enter a valid Address. This is a required field. <br>";
        textEmpAddress.style.border = "1px solid red";
    }
    return errors; // Return all errors or
    //okkoma fil krla nm methnin pass wenne ------> empty string
    //bageta hri all hri fill krala nathi noth ------>send kranwa adala validation error statments
}

// define method for employee form submission
const buttonEmployeeSubmit = () => {
    console.log(employee);

    //call common submit function
    submitWithConfirm(checkFormError, employee, "/employee/insert", () => {
        // ----------------------------------------------------
        // This function runs ONLY after successful save
        // ----------------------------------------------------
        // success → reset form + reload table
        loadEmployeeForm();
        loadEmployeeTable();

    });
}

// Employee print karanna hadapu function eka define karanawa
const printEmployee = (dataOb) => {
    employee = dataOb;

    // Employee details tika modal eke thiyena td walata danna
    tdFullName.innerText = employee.fullname;
    tdCallingName.innerText = employee.callingname;
    tdNic.innerText = employee.nic;
    tdGender.innerText = employee.gender;
    tdMobile.innerText = employee.mobileno;
    tdEmail.innerText = employee.email;
    tdAddress.innerText = employee.address;
    tdDesignation.innerText = employee.designation_id.name;
    tdCivilStatus.innerText = employee.civilstatus;
    tdEmployeeStatus.innerText = employee.employeestatus_id.name;

    // Bootstrap modal eka open karanawa
    $("#modalEmployeePrint").modal("show");
}

// Print button eka click karama call wenna function eka
const buttonPrint = () => {
    // Aluth tab ekak open karanawa
    const newTab = window.open();

    // Print page eka create karanawa
    newTab.document.writeln(
        "<html><head><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'><title>Print Employee</title></head>" +
        "<body>" +
        "<h2>Print Employee</h2>" +
        tablePrintEmployee.outerHTML +
        "</body></html>"
    );
    // Document eka close karanawa (render wenna)
    newTab.document.close();

    // interval ekak set kara mili second 250 kin - print eka click karama 250ms thiyala tab eka open wenawa.
    // eeta passe print page eka close karama mulu new tab ekama close wenawa.
    setTimeout(() => {
        newTab.print();
        newTab.close();
    }, 250);
    // Bootstrap modal eka hide karanawa
    $("#modalEmployeePrint").modal("hide");
}

const editEmployee = (dataOb) => {
    // employee = dataOb;
    // oldEmployee = dataOb;
    // mehema use krnna ba mokada methana reference variable wage hasirennne...
    // employee, oldEmployee eke thiyenne ekama memory address ekane.
    // e nisa apita update wunu widiha hoyanna ba, dekama enne ekama value.
    // hodatama kiyanna nam — oba employee object ekata changes karoth,
    // oldEmployee ekatath ehema change wenawa (eka object ekak nisa).

    // ithin e nisa reference eka galawanna ona.
    // mehema wela thiyenne object gaththa nisa (object type eke thiyenawa reference ekak).
    // eka string ekakata convert krgannwa (deep copy hadanna).
    // but string ekata convert karama access krnna ba,
    // e nisa eka aye object ekakata path krgnna JSON ekenma.
    // -> JSON.stringify() : object ekata string ekakata hadanawa.
    // -> JSON.parse() : string ekata object ekakata hadanawa.
    // mehema krama eken deep copy ekak hadanawa.

    // open Add Employee tab
    new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabFormArea"]')).show();
    tabFormButton.innerText = "Update Employee";


    // deep copy krnna dataOb eka (employee & oldEmployee)
    employee = JSON.parse(JSON.stringify(dataOb));
    oldEmployee = JSON.parse(JSON.stringify(dataOb));

    //emp photo refil
    if (employee.photo != null) {
        imgEmpPhoto.src = atob(employee.photo);
    }

    // --- Fullname input eka fill karanawa ---
    textEmpFullname.value = employee.fullname;

    // --- Calling Name dropdown generate karanawa ---
    selectCallingName.innerHTML = ""; // purana option clear karanawa
    let optionMsg = document.createElement("option"); // first option default message
    optionMsg.selected = true;
    optionMsg.disabled = true;
    optionMsg.value = "";
    optionMsg.innerText = "Select Calling name..!";
    selectCallingName.appendChild(optionMsg);

    // fullname split karala option walata danawa
    let nameParts = employee.fullname.split(" ");
    nameParts.forEach(namePart => {
        let option = document.createElement("option");
        option.value = namePart;
        option.innerText = namePart;
        selectCallingName.appendChild(option);
    });

    // calling name select karanawa employee.callingname value ekata
    selectCallingName.value = employee.callingname;

    // --- Name with Initials generate karanawa ---
    let nameWithInitial = "";
    nameParts.forEach((part, i) => {
        if (i < nameParts.length - 1) {
            // first letters walata dot dila initials hadanawa
            nameWithInitial += part.charAt(0).toUpperCase() + ".";
        }
    });
    // last name pura danawa
    nameWithInitial += nameParts[nameParts.length - 1];
    textEmpNameWithInitial.value = nameWithInitial;
    employee.nameWithInitial = nameWithInitial;

    // --- NIC fill karanawa ---
    textEmpNic.value = employee.nic;
    let nic = employee.nic;

    // --- DOB, Age, Gender calculate karanawa NIC eka use karala ---
    let birthYear = "";
    let dayCount = "";

    if (nic.length == 10) { // old 10-digit NIC nam
        birthYear = "19" + nic.substring(0, 2); // 19 + first 2 digits → birth year
        dayCount = nic.substring(2, 5); // next 3 digits → day of year
    } else { // new 12-digit NIC nam
        birthYear = nic.substring(0, 4); // first 4 digits → birth year
        dayCount = nic.substring(4, 7); // next 3 digits → day of year
    }

    // calculate age
    let currentYear = new Date().getFullYear(); // current year gannawa
    let age = parseInt(currentYear) - parseInt(birthYear); // age calculate karanawa
    textEmpAge.value = age; // age input field eke display karanawa
    employee.age = age; // employee object eke age bind karanawa

    if (age >= 18 && age <= 60) { // age 18-60 valid nam
        employee.nic = nic; // employee object eke NIC bind karanawa

        // enable DOB field now
        dateEmpDob.disabled = false;

        // generate gender
        if (parseInt(dayCount) > 500) { // 500+ dayCount nam female
            radioFemale.checked = true;
            employee.gender = "Female";
        } else { // else male
            radioMale.checked = true;
            employee.gender = "Male";
        }
        dateEmpDob.min = birthYear + "-01-01";
        dateEmpDob.max = birthYear + "-12-31";
        dateEmpDob.value = employee.dob;
        // --- Other fields fill karanawa ---
        textEmpMobileno.value = employee.mobileno; // mobile number
        textEmpEmail.value = employee.email;       // email
        textEmpAddress.value = employee.address;   // address
        selectEmpCivilStatus.value = employee.civilstatus; // civil status

        //optional
        if (employee.landno == null || employee.landno == undefined) {
            textEmpLandno.value = "";
        } else {
            textEmpLandno.value = employee.landno;
        }

        //dynamic elemnts
        //object pase wena nisa ---object eka thiyenne string format eken
        selectEmpDesignation.value = JSON.stringify(employee.designation_id); // designation
        // Enable the status dropdown for updating
        selectEmployeeStatus.value = JSON.stringify(employee.employeestatus_id);
        //employee status visible
        labelEmployeeStatus.style.display = "block";
        divSelectEmployeeStatus.style.display = "block";

        buttonSubmit.style.display = "none"; // submit button hide
        buttonUpdate.style.display = "block"; // update button show
        buttonClear.style.display = "none";  // clear button hide

    }
}

// define function for get employee form updates
const checkEmployeeFormUpdate = () => {
    let updates = "";

    // check karanawa employee object dekama null nadda kiyala
    if (employee != null && oldEmployee != null) {

        // fullname change unada kiyala check karanawa
        if (employee.fullname != oldEmployee.fullname) {
            updates = updates + "Fullname is changed. " + oldEmployee.fullname + " --> " + employee.fullname + "\n";
        }
        // calling name change unada kiyala check karanawa
        if (employee.callingname != oldEmployee.callingname) {
            updates = updates + "Callingname is changed. " + oldEmployee.callingname + " --> " + employee.callingname + "\n";
        }
        // NIC change unada kiyala check karanawa
        if (employee.nic != oldEmployee.nic) {
            updates = updates + "NIC is changed. " + oldEmployee.nic + " --> " + employee.nic + "\n";
        }
        // gender change unada kiyala check karanawa
        if (employee.gender != oldEmployee.gender) {
            updates = updates + "Gender is changed. " + oldEmployee.gender + " --> " + employee.gender + "\n";
        }
        // dob change unada kiyala check karanawa
        if (employee.dob != oldEmployee.dob) {
            updates = updates + "DOB is changed. " + oldEmployee.dob + " --> " + employee.dob + "\n";
        }
        // email change unada kiyala check karanawa
        if (employee.email != oldEmployee.email) {
            updates = updates + "Email is changed. " + oldEmployee.email + " --> " + employee.email + "\n";
        }
        // civil status change unada kiyala check karanawa
        if (employee.civilstatus != oldEmployee.civilstatus) {
            updates = updates + "Civilstatus is changed. " + oldEmployee.civilstatus + " --> " + employee.civilstatus + "\n";
        }
        // mobile no change unada kiyala check karanawa
        if (employee.mobileno != oldEmployee.mobileno) {
            updates = updates + "Mobileno is changed. " + oldEmployee.mobileno + " --> " + employee.mobileno + "\n";
        }
        // land no change unada kiyala check karanawa
        if (employee.landno != oldEmployee.landno) {
            updates = updates + "Landno is changed. " + oldEmployee.landno + " --> " + employee.landno + "\n";
        }
        // designation change unada kiyala check karanawa
        if (employee.designation_id.name != oldEmployee.designation_id.name) {
            updates = updates + "Designation is changed. " + oldEmployee.designation_id.name + " --> " + employee.designation_id.name + "\n";
        }
        // employee status change unada kiyala check karanawa
        if (employee.employeestatus_id.name != oldEmployee.employeestatus_id.name) {
            updates = updates + "Employeestatus is changed. " + oldEmployee.employeestatus_id.name + " --> " + employee.employeestatus_id.name + "\n";
        }
        // address change unada kiyala check karanawa
        if (employee.address != oldEmployee.address) {
            updates = updates + "Address is changed. " + oldEmployee.address + " --> " + employee.address + "\n";
        }
        if (employee.photo != oldEmployee.photo) {
            updates += "Photo is changed.\n";
        }

    }
    return updates;
}

// define function for update employee records
const buttonEmployeeUpdate = () => {
    // call common update function with error & update check
    updateWithConfirm(checkFormError, checkEmployeeFormUpdate, employee, "/employee/update", () => {
        // success → reset form + reload table
        loadEmployeeForm();
        loadEmployeeTable();
    });
}

// define method for employee delete
const deleteEmployee = (dataOb) => {

    // Data object eka assign karanawa local variable ekakata
    const employee = dataOb;

    // SweetAlert eke pennanna one message eka hadanawa
    const message =
        "<b>Full Name :</b> " + employee.fullname + "<br>" +
        "<b>NIC :</b> " + employee.nic + "<br>" +
        "<b>Designation :</b> " + employee.designation_id.name + "<br>" +
        "<b>Email :</b> " + employee.email;

    // common delete function eka call karanawa
    deleteWithConfirm(employee, message, "/employee/delete", () => {
        // success unama passe form eka reset + table reload
        loadEmployeeForm();
        loadEmployeeTable();

    });
}
function clearPhoto() {
    // reset the image preview to default user icon
    document.getElementById("imgEmpPhoto").src = "images/usericon.jpg";

    // clear the file input value
    document.getElementById("fileEmpPhoto").value = "";

    // optional: clear the employee object photo property if using JS object
    if (typeof employee !== "undefined") {
        employee.photo = null;
    }
}

/* ----------- designation form ------------------------ */

const textDesignation = document.querySelector("#textDesignation");
const chkNeedUserAccount = document.querySelector("#chkNeedUserAccount");
const lblUserAccount = document.querySelector("#lblUserAccount");
const textRoleId = document.querySelector("#textRoleId");

// define loadDesignationForm 
const loadDesignationForm = () => {

    // form eke thiyena values clear karanawa
    formDesignation.reset();

    // old designation object eka remove karala new empty object ekak create karanawa
    designation = new Object();

    designation.useraccount = false;



}
// me function eka designation  form eke errors check karanna use karanne
const checkFormErrorDesignation = () => {
    let errors = ""; // Collect errors here empty string pass

    // current designation object eke designation name check
    if (designation.name == null) {
        errors += "Please enter a valid Designation name. This is a required field<br>";
        textDesignation.style.border = "1px solid red";
    }
    // Check need user account field
    if (designation.useraccount == null) {
        errors += "Please check useraccount needed. This is a required field. <br>";

    }
    return errors; // Return all errors or
    //okkoma fil krla nm methnin pass wenne ------> empty string
    //bageta hri all hri fill krala nathi noth ------>send kranwa adala validation error statments
}

// define function for designation form submission
const buttonDesignationSubmit = () => {

    console.log(designation);

    // form validation check karanawa
    let errors = checkFormErrorDesignation();

    // errors thiyenawanam warning message eka pennanawa
    if (errors != "") {
        Swal.fire({
            icon: "warning",
            title: "Validation Error",
            html: errors,
            confirmButtonColor: "#0d6efd"
        });
        return;
    }

    // usergen save karanna confirmation illanawa
    Swal.fire({
        title: "Save Designation?",
        text: "Do you want to save this designation?",
        icon: "question",
        width: 360,
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#0d6efd",
        cancelButtonColor: "#6c757d"
    }).then((result) => {

        // user save kiyala confirm karoth
        if (result.isConfirmed) {

            // designation object eka database ekata save karanawa
            let response = setDataAjaxGetRequest("/designation/insert", "POST", designation);

            // save success nam
            if (response == "OK") {

                // success message eka pennanawa
                Swal.fire({
                    icon: "success",
                    title: "Saved!",
                    text: "Designation saved successfully.",
                    width: 320,
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {

                    // form eka reset karanawa
                    loadDesignationForm();

                    // modal eka close karanawa
                    $("#designationModal").modal("hide");

                    // employee form tab eka active karanawa
                    let formTab = new bootstrap.Tab(document.querySelector("#tabFormButton"));
                    formTab.show();

                    // aluthin add una designation list eka gannawa
                    let designations = getDataAjaxGetRequest("/designation/alldata");

                    // designation dropdown eka aluth list eken refill karanawa
                    loadSelectOptions(selectEmpDesignation, designations, "Select Designation...!", "name");

                    // aluthin add una designation eka automatically select karanawa
                    selectEmpDesignation.value = JSON.stringify(designations[designations.length - 1]);

                    // employee object ekata selected designation eka assign karanawa
                    employee.designation_id = designations[designations.length - 1];

                    // success kiyala penenna dropdown border eka green karanawa
                    selectEmpDesignation.style.border = "2px solid green";

                });

            } else {

                // save fail nam error message eka pennanawa
                Swal.fire({
                    icon: "error",
                    title: "Save Failed",
                    html: response,
                    confirmButtonColor: "#dc3545"
                });

            }

        }

    });

}