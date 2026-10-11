//browser refresh event – page eka reload wenakota db eken teacher data okkoma update wenawa.
//eka nisa teacher table eka refresh wenna reusable function ekak hadala use karanawa.
//me function eka submission, update, delete awasthawal di call karanawa.
//advantage – code reusability ekak tiyenawa, code eka simple wenawa.

//browser load event
window.addEventListener("load", () => {

    $('.js-example-basic-single').select2({
        theme: "bootstrap-5",
        width: '100%'
    });

    // Logged-in user ta TEACHER module eka sambandha permissions ganna
    userPrivilege = getDataAjaxGetRequest("/userprivilegebymodule?modulename=TEACHER")

    //call table refresh function
    loadTeacherTable();
    //call form refresh function
    loadTeacherForm();

});

let textTeacherFullname = document.querySelector("#textTeacherFullname");
let fileTeacherPhoto = document.querySelector("#fileTeacherPhoto");
let selectCallingName = document.querySelector("#selectCallingName");
let textTeacherNic = document.querySelector("#textTeacherNic");
let radioMale = document.querySelector("#radioMale");
let radioFemale = document.querySelector("#radioFemale");
let dateDob = document.querySelector("#dateDob");
let textBcontactNo = document.querySelector("#textBcontactNo");
let textPcontactNo = document.querySelector("#textPcontactNo");
let textTeacherAddress = document.querySelector("#textTeacherAddress");
let textThQualifiacations = document.querySelector("#textThQualifiacations");
let textTeacherSchool = document.querySelector("#textTeacherSchool");
let selectThSubject = document.querySelector("#selectThSubject");
let textTeacherEmail = document.querySelector("#textTeacherEmail");
let selectThStatus = document.querySelector("#selectThStatus");
let teacherStatusLabel = document.querySelector("#teacherStatusLabel");
let teacherStatusSelect = document.querySelector("#teacherStatusSelect");
let tabFormButton = document.querySelector("#tabFormButton");
let selectBank = document.querySelector("#selectBank");
let textBankAccountName = document.querySelector("#textBankAccountName");
let textBankAccuntNo = document.querySelector("#textBankAccuntNo");
let textBankBranchName = document.querySelector("#textBankBranchName");
let imgThPhoto = document.querySelector("#imgThPhoto");
// teacher photo default preview image eka
let defaultPhoto = "images/usericon.jpg";


//define subject detail
const getSubjectDetail = (dataOb) => {
    return dataOb.subjectdetail_id.name;
}
// Define teacher status function
const getTeacherStatus = (dataOb) => {
    const status = dataOb.teacherstatus_id.name;

    if (status === "Active") {
        return `<span style="color: green; font-weight: bold;">${status}</span>`;
    }
    if (status === "In-Active") {
        return `<span style="color: orange; font-weight: bold;">${status}</span>`;
    }

    // Unknown status
    return `<span>${status}</span>`;
}

//teacher table refresh function
loadTeacherTable = () => {
    //teacher data get
    teachers = new Array();
    // backend eken  teachers okkoma gannawa
    teachers = getDataAjaxGetRequest("/teacher/alldata");
    teachers.reverse();//decending kra


    //string-string, numbers, date
    //function-object, array, boolean, image
    //create property array
    let displayColumns = [
        { property: "teacherno", dataType: "string" },
        { property: "fullname", dataType: "string" },
        { property: "mobilenobusiness", dataType: "string" },
        { property: "nic", dataType: "string" },
        { property: getSubjectDetail, dataType: "function" },
        { property: getTeacherStatus, dataType: "function" }
    ];

    // Call reusable table data fill function
    loadTableData(tableBodyTeacher, teachers, displayColumns, printTeacher, editTeacher, deleteTeacher);

    for (const index in teachers) {
        // Update permission naththm – update button hide karanawa
        if (!userPrivilege.privi_update) {
            tableBodyTeacher.children[index].children[7].children[1].style.display = "none";
        }
        // Delete permission naththm – delete button hide karanawa
        if (!userPrivilege.privi_delete) {
            tableBodyTeacher.children[index].children[7].children[2].style.display = "none";
        }
    }

    // initialize datatable plugin
    $('#tableTeacher').dataTable();
}

//teacher form refresh function
loadTeacherForm = () => {
    //tab button
    tabFormButton.innerText = "Add Teacher";

    // form eka reset karanawa(input walata dapu values okkoma clear wenawa)
    formTeacher.reset();

    // empty object ekak hadanawa
    teacher = new Object();
    // why -Vaild value tika collect krala backend ekata pass krnna ona.
    // one by one pass krnawata wada object eka pass krna eka lesi.

    // subject list
    // DB eken okkoma subjectdetails ganna -> dropdown ekata load karanna
    let subjectdetails = getDataAjaxGetRequest("/subjectdetail/alldata");
    loadSelectOptions(selectThSubject, subjectdetails, "Select Subject...!", "name");

    // DB eken okkoma bank details ganna -> dropdown ekata load karanna
    let banks = getDataAjaxGetRequest("/bank/alldata");
    loadSelectOptions(selectBank, banks, "Select Bank...!", "name");

    // teacher status
    // DB eken okkoma teacherstatuses ganna -> dropdown ekata load karanna
    let teacherstatuses = getDataAjaxGetRequest("/teacherstatus/alldata");
    loadSelectOptions(selectThStatus, teacherstatuses, "Select Teacher Status..!", "name");


    //db ekata active widihata status eka pass krnawa
    teacher.teacherstatus_id = { id: 1, name: "Active" };
    selectThStatus.value = JSON.stringify(teacher.teacherstatus_id);

    // Hide Teacher Status label and select
    teacherStatusLabel.style.display = "none";
    teacherStatusSelect.style.display = "none";

    // userta ta insert privilege naththam form buttons hide karanawa
    if (!userPrivilege.privi_insert) {
        tabFormButton.style.display = "none";   // "Add New" button hide
        buttonSubmit.style.display = "none";    // "Save" button hide
    }
    // buttons control karanawa
    buttonUpdate.style.display = "none"; // update button hide
    buttonSubmit.style.display = "block"; // submit button show


    // form eke tiyena input, select, radio okkoma border colour / UI reset karanawa
    setUIColour([textTeacherFullname, selectCallingName, textTeacherNic, radioMale, radioFemale, textBcontactNo, textPcontactNo, textTeacherAddress, textThQualifiacations, textTeacherSchool, selectThSubject, textTeacherEmail, selectThStatus, selectBank, textBankAccountName, textBankAccuntNo, textBankBranchName]);
    let tableTab = new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabTableArea"]'));
    tableTab.show(); // form tab hide karanna epa, table tab activate wenawa
}


//  print teacher karanna hadapu function eka define karanawa
const printTeacher = (dataOb) => {
    teacher = dataOb;

    // Employee details tika modal eke thiyena td walata danna
    tdTeacherNo.innerText = teacher.teacherno;
    tdFullName.innerText = teacher.fullname;
    tdCallingName.innerText = teacher.callingname;
    tdNic.innerText = teacher.nic;
    tdGender.innerText = teacher.gender;
    tdDob.innerText = teacher.dob;
    tdBMobile.innerText = teacher.mobilenobusiness;
    tdPMobile.innerText = teacher.mobilenoprivate;
    tdAddress.innerText = teacher.address;
    tdQualifications.innerText = teacher.qualification;
    tdSchool.innerText = teacher.schoolname;
    tdSubject.innerText = teacher.subjectdetail_id.name;
    tdBankName.innerText = teacher.bank_id.name;
    tdBankAcNo.innerText = teacher.bankacnumber;
    tdBankAcHolder.innerText = teacher.bankholdername;
    tdBankBranch.innerText = teacher.bankbranch;

    tdTeahcerStatus.innerText = teacher.teacherstatus_id.name;

    // Bootstrap modal eka open karanawa
    $("#modalTeacherPrint").modal("show");
}

// Print button eka click karama call wenna function eka
const buttonPrint = () => {
    // Aluth tab ekak open karanawa
    const newTab = window.open();

    // Print page eka create karanawa
    newTab.document.writeln(
        "<html><head><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'><title>Print Teacher </title></head>" +
        "<body>" +
        "<h2>Print Teacher </h2>" +
        tablePrintTeacher.outerHTML +
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
    $("#modalTeacherPrint").modal("hide");
}

//define edit function
const editTeacher = (dataOb) => {
    // teacher = dataOb;
    // oldTeacher = dataOb;
    // mehema use krnna ba mokada methana reference variable wage hasirennne...
    // teacher, oldTeacher eke thiyenne ekama memory address ekane.
    // e nisa apita update wunu widiha hoyanna ba, dekama enne ekama value.
    // hodatama kiyanna nam — oba teacher object ekata changes karoth,
    // oldTeacher ekatath ehema change wenawa (eka object ekak nisa).

    // ithin e nisa reference eka galawanna ona.
    // mehema wela thiyenne object gaththa nisa (object type eke thiyenawa reference ekak).
    // eka string ekakata convert krgannwa (deep copy hadanna).
    // but string ekata convert karama access krnna ba,
    // e nisa eka aye object ekakata path krgnna JSON ekenma.
    // -> JSON.stringify() : object ekata string ekakata hadanawa.
    // -> JSON.parse() : string ekata object ekakata hadanawa.
    // mehema krama eken deep copy ekak hadanawa.

    // open Add Teacher tab
    new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabFormArea"]')).show();
    tabFormButton.innerText = "Update Teacher";

    // deep copy krnna dataOb eka (teacher & oldTeacher)
    teacher = JSON.parse(JSON.stringify(dataOb));
    oldTeacher = JSON.parse(JSON.stringify(dataOb));

    //teacher photo refil
    if (teacher.teacherphoto != null) {
        imgThPhoto.src = atob(teacher.teacherphoto);
    }
    //refill fullname
    textTeacherFullname.value = teacher.fullname;
    //refill calling name

    // calling name select box clear karanawa (html eke thiyna)
    selectCallingName.innerHTML = "";

    let optionMsg = document.createElement("option");
    optionMsg.selected = "selected";
    optionMsg.disabled = "disabled";
    optionMsg.value = "";
    optionMsg.innerText = "Select Calling name..!";
    selectCallingName.appendChild(optionMsg);

    // fullname eka split karala option walata danawa
    let nameParts = teacher.fullname.split(" ");
    nameParts.forEach(namePart => {
        let option = document.createElement("option");
        option.value = namePart;
        option.innerText = namePart;
        selectCallingName.appendChild(option);
    });
    selectCallingName.value = teacher.callingname;

    //refill nic, dob, gender
    textTeacherNic.value = teacher.nic;
    let nic = teacher.nic;
    //date generate
    let birthYear = "";
    let dayCount = "";  // NIC eke thiyana day count eka store karanna

    if (nic.length == 10) { // old 10-digit NIC nam
        birthYear = "19" + nic.substring(0, 2); // 19 + first 2 digits → birth year
        dayCount = nic.substring(2, 5);         // next 3 digits → day of year
    } else { // new 12-digit NIC nam
        birthYear = nic.substring(0, 4);       // first 4 digits → birth year
        dayCount = nic.substring(4, 7);        // next 3 digits → day of year
    }

    // gender determine karanawa dayCount eka use karala
    let dayNumber = parseInt(dayCount);
    if (dayNumber > 500) { // female nam
        dayNumber -= 501; // 500 gihin pasuwa calculate karanawa
        radioFemale.checked = true;
        radioMale.checked = false;
        teacher.gender = "Female";
    } else { // male nam
        radioMale.checked = true;
        radioFemale.checked = false;
        teacher.gender = "Male";
    }
    // actual DOB calculate karanawa birthYear + dayNumber use karala
    let dob = new Date(birthYear, 0); // Jan 1 of birthYear
    dob.setDate(dayNumber);           // dayNumber add karanawa
    let formattedDOB = dob.getFullYear() + "-" +
        String(dob.getMonth() + 1).padStart(2, "0") + "-" +
        String(dob.getDate()).padStart(2, "0");

    dateDob.value = formattedDOB;  // DOB input field set karanawa
    teacher.dob = formattedDOB;      // teacher object ekata bind

    dateDob.value = teacher.dob;
    textBcontactNo.value = teacher.mobilenobusiness;
    textTeacherAddress.value = teacher.address;
    textThQualifiacations.value = teacher.qualification;
    textTeacherEmail.value = teacher.email;
    textBankAccountName.value = teacher.bankholdername;
    textBankAccuntNo.value = teacher.bankacnumber;
    textBankBranchName.value = teacher.bankbranch;

    //optional
    if (teacher.mobilenoprivate == null || teacher.mobilenoprivate == undefined) {
        textPcontactNo.value = "";
    } else {
        textPcontactNo.value = teacher.mobilenoprivate;
    }
    if (teacher.schoolname == null || teacher.schoolname == undefined) {
        textTeacherSchool.value = "";
    } else {
        textTeacherSchool.value = teacher.schoolname;
    }
    //dynamic elemnts
    //object pase wena nisa ---object eka thiyenne string format eken
    selectThSubject.value = JSON.stringify(teacher.subjectdetail_id);

    //selectBank.value = JSON.stringify(teacher.bank_id);
    // Bank value eka Select2 dropdown ekata set karanawa
    $(selectBank)
        .val(JSON.stringify(teacher.bank_id))
        .trigger("change");

    // Select2 border colour reset karanawa
    $(selectBank)
        .next(".select2-container")
        .find(".select2-selection")
        .removeClass("valid-border invalid-border")
        .css("border-color", "");


    selectThStatus.value = JSON.stringify(teacher.teacherstatus_id);
    //teacher status visible
    teacherStatusLabel.style.display = "block";
    teacherStatusSelect.style.display = "block";


    // Buttons control
    buttonSubmit.style.display = "none";  // submit button hide
    buttonUpdate.style.display = "block"; // update button show
    buttonClear.style.display = "none";  // clear button hide
}

// me function eka form eke errors check karanna use karanne
const checkFormError = () => {
    let errors = ""; // Collect errors here

    // Fullname check
    if (teacher.fullname == null) {
        errors += "Please enter a valid Fullname. This is a required field<br>";
        textTeacherFullname.style.border = "1px solid red";
    }
    // Calling name check
    if (teacher.callingname == null) {
        errors += "Please enter Calling Name. This is a required field. <br>";
        selectCallingName.style.border = "1px solid red";
    }
    // NIC check
    if (teacher.nic == null) {
        errors += "Please enter a valid NIC. This is a required field. <br>";
        textTeacherNic.style.border = "1px solid red";
    }
    // Gender check
    if (teacher.gender == null) {
        errors += "Please select Gender. This is a required field. <br>";
    }
    // Date of Birth check
    if (teacher.dob == null) {
        errors += "Please enter Date of Birth. This is a required field. <br>";
        dateDob.style.border = "1px solid red";
    }
    // Mobile number check
    if (teacher.mobilenobusiness == null) {
        errors += "Please enter a valid Mobile Number(Business). This is a required field. <br>";
        textBcontactNo.style.border = "1px solid red";
    }
    // Address check
    if (teacher.address == null) {
        errors += "Please enter a valid Address. This is a required field. <br>";
        textTeacherAddress.style.border = "1px solid red";
    }
    // Address check
    if (teacher.address == null) {
        errors += "Please enter a valid Address. This is a required field. <br>";
        textTeacherAddress.style.border = "1px solid red";
    }
    // Qulifiacation check
    if (teacher.qualification == null) {
        errors += "Please enter Qualifications. This is a required field. <br>";
        textThQualifiacations.style.border = "1px solid red";
    }
    // Subject check
    if (teacher.subjectdetail_id == null) {
        errors += "Please select Subject. This is a required field. <br>";
        selectThSubject.style.border = "1px solid red";
    }
    // Email check
    if (teacher.email == null) {
        errors += "Please enter a valid Email. This is a required field. <br>";
        textTeacherEmail.style.border = "1px solid red";
    }
    // bank name check
    if (teacher.bank_id == null) {
        errors += "Please select Bank. This is a required field. <br>";
        selectBank.style.border = "1px solid red";
    }
    // Bank ac name check
    if (teacher.bankholdername == null) {
        errors += "Please enter a valid Bank holder name. This is a required field. <br>";
        textBankAccountName.style.border = "1px solid red";
    }
    // Bank ac no check
    if (teacher.bankacnumber == null) {
        errors += "Please enter a valid Bank AC number. This is a required field. <br>";
        textBankAccuntNo.style.border = "1px solid red";
    }
    // Bank branch check
    if (teacher.bankbranch == null) {
        errors += "Please enter a valid Branch name. This is a required field. <br>";
        textBankBranchName.style.border = "1px solid red";
    }

    return errors; // Return all errors
}

// define method for teacher form submission
const buttonTeacherSubmit = () => {
    //call common submit function
    submitWithConfirm(checkFormError, teacher, "/teacher/insert", () => {
        // success → reset form + reload table
        loadTeacherForm();
        loadTeacherTable();

    });
}

// define function for get teacher form updates
const checkTeacherFormUpdate = () => {
    let updates = "";

    // check karanawa teacher object dekama null nadda kiyala
    if (teacher != null && oldTeacher != null) {

        // check fullname change
        if (teacher.fullname != oldTeacher.fullname) {
            updates = updates + "Fullname is changed. " + oldTeacher.fullname + " --> " + teacher.fullname + "\n";
        }
        //check photo change
        if (teacher.teacherphoto != oldTeacher.teacherphoto) {
            updates += "Photo is changed.\n";
        }
        // check calling name change
        if (teacher.callingname != oldTeacher.callingname) {
            updates = updates + "Callingname is changed. " + oldTeacher.callingname + " --> " + teacher.callingname + "\n";
        }
        // check NIC change
        if (teacher.nic != oldTeacher.nic) {
            updates = updates + "NIC is changed. " + oldTeacher.nic + " --> " + teacher.nic + "\n";
        }
        // check gender change
        if (teacher.gender != oldTeacher.gender) {
            updates = updates + "Gender is changed. " + oldTeacher.gender + " --> " + teacher.gender + "\n";
        }
        // check dob change
        if (teacher.dob != oldTeacher.dob) {
            updates = updates + "DOB is changed. " + oldTeacher.dob + " --> " + teacher.dob + "\n";
        }
        // check business mobile no change
        if (teacher.mobilenobusiness != oldTeacher.mobilenobusiness) {
            updates = updates + "Mobileno (Business) is changed. " + oldTeacher.mobilenobusiness + " --> " + teacher.mobilenobusiness + "\n";
        }
        // check private mobile no change
        if (teacher.mobilenoprivate != oldTeacher.mobilenoprivate) {
            updates = updates + "Mobileno (Private) is changed. " + oldTeacher.mobilenoprivate + " --> " + teacher.mobilenoprivate + "\n";
        }
        // check address change
        if (teacher.address != oldTeacher.address) {
            updates = updates + "Address is changed. " + oldTeacher.address + " --> " + teacher.address + "\n";
        }
        // check quailfication change
        if (teacher.qualification != oldTeacher.qualification) {
            updates = updates + "Qualification area is changed. " + oldTeacher.qualification + " --> " + teacher.qualification + "\n";
        }
        // check school change
        if (teacher.schoolname != oldTeacher.schoolname) {
            updates = updates + "School  is changed. " + oldTeacher.schoolname + " --> " + teacher.schoolname + "\n";
        }
        // check subject change
        if (teacher.subjectdetail_id.name != oldTeacher.subjectdetail_id.name) {
            updates = updates + "Subject  is changed. " + oldTeacher.subjectdetail_id.name + " --> " + teacher.subjectdetail_id.name + "\n";
        }
        // check email change
        if (teacher.email != oldTeacher.email) {
            updates = updates + "Email  is changed. " + oldTeacher.email + " --> " + teacher.email + "\n";
        }
        // check teacher status change
        if (teacher.teacherstatus_id.name != oldTeacher.teacherstatus_id.name) {
            updates = updates + "Teacher Status is changed. " + oldTeacher.teacherstatus_id.name + " --> " + teacher.teacherstatus_id.name + "\n";
        }
        // check bank change
        if (teacher.bank_id.name != oldTeacher.bank_id.name) {
            updates = updates + "Bank name is changed. " + oldTeacher.bank_id.name + " --> " + teacher.bank_id.name + "\n";
        }
        // check bank holder name change
        if (teacher.bankholdername != oldTeacher.bankholdername) {
            updates = updates + "Bank holder name is changed. " + oldTeacher.bankholdername + " --> " + teacher.bankholdername + "\n";
        }
        // check bank ac no change
        if (teacher.bankacnumber != oldTeacher.bankacnumber) {
            updates = updates + "Bank AC no is changed. " + oldTeacher.bankacnumber + " --> " + teacher.bankacnumber + "\n";
        }
        // check bank branch change
        if (teacher.bankbranch != oldTeacher.bankbranch) {
            updates = updates + "Bank Branch name is changed. " + oldTeacher.bankbranch + " --> " + teacher.bankbranch + "\n";
        }
    }
    return updates;
}

// define function for update teacher records
const buttonTeacherUpdate = () => {
    // call common update function with error & update check
    updateWithConfirm(checkFormError, checkTeacherFormUpdate, teacher, "/teacher/update", () => {
        // success → reset form + reload table
        loadTeacherForm();
        loadTeacherTable();
    });
}
// define method for teacher delete
const deleteTeacher = (dataOb) => {
    // Data object eka assign karanawa local variable ekakata
    const teacher = dataOb;

    // SweetAlert eke pennanna one message eka hadanawa
    const message =
        "<b>Full Name :</b> " + teacher.fullname + "<br>" +
        "<b>NIC :</b> " + teacher.nic + "<br>" +
        "<b>Mobile no :</b> " + teacher.mobilenobusiness + "<br>" +
        "<b>Email :</b> " + teacher.email;

    // common delete function eka call karanawa
    deleteWithConfirm(teacher, message, "/teacher/delete", () => {
        // success unama passe form eka reset + table reload
        loadTeacherForm();
        loadTeacherTable();

    });
}
// Clear photo button functionality
const clearPhoto = () => {
    imgThPhoto.src = "images/usericon.jpg"; // default image
    fileTeacherPhoto.value = "";
    if (typeof teacher !== "undefined" && teacher !== null) {
        teacher.teacherphoto = null;
    }
}

//define full name validator
const textFullnameValidator = () => {

    //input eke value gannawa
    let fullname = textTeacherFullname.value;

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
        textTeacherFullname.style.border = '2px solid green';
        teacher.fullname = fullname; // data bind karanawa

        //calling name part generate

        // calling name select box clear karanawa (html eke thiyna)
        selectCallingName.innerHTML = "";

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

    } else {
        // invalid → red border 2px
        textTeacherFullname.style.border = '2px solid red';
    }
}

// calling name validator
const callingNameValidator = () => {
    const callingname = selectCallingName.value;

    if (callingname) {
        selectCallingName.style.border = '2px solid green';
        teacher.callingname = callingname;
    } else {
        selectCallingName.style.border = '2px solid red';
        teacher.callingname = null;
    }
}

// NIC validate karana function eka define karanawa
/* const textNicValidator = () => {
    // User enter karana NIC eka gannawa
    let nic = textTeacherNic.value;

    // NIC format validate karana regex Matches karanne
    // - old 10-digit NIC: 6,7,8,9 first digit + 7 digits + V/v/X/x/S/s
    // - new 12-digit NIC: 12 digits
    let regPattern = new RegExp("^((([6][56789][0-9]{7}[VvXxSs])|([7-9][0-9]{8}[VvXxSs]))|([0-9]{12}))$");

    //nic valid nam
    if (regPattern.test(nic)) {
        // valid → green border 2px
        textTeacherNic.style.border = '2px solid green';
        teacher.nic = nic; // data bind karanawa

        //date generate
        let birthYear = "";
        let dayCount = "";  // NIC eke thiyana day count eka store karanna

        if (nic.length == 10) { // old 10-digit NIC nam
            birthYear = "19" + nic.substring(0, 2); // 19 + first 2 digits → birth year
            dayCount = nic.substring(2, 5);         // next 3 digits → day of year
        } else { // new 12-digit NIC nam
            birthYear = nic.substring(0, 4);       // first 4 digits → birth year
            dayCount = nic.substring(4, 7);        // next 3 digits → day of year
        }

        // gender determine karanawa dayCount eka use karala
        let dayNumber = parseInt(dayCount);
        if (dayNumber > 500) { // female nam
            dayNumber -= 501; // 500 gihin pasuwa calculate karanawa
            radioFemale.checked = true;
            radioMale.checked = false;
            teacher.gender = "Female";
        } else { // male nam
            radioMale.checked = true;
            radioFemale.checked = false;
            teacher.gender = "Male";
        }
        // actual DOB calculate karanawa birthYear + dayNumber use karala
        let dob = new Date(birthYear, 0); // Jan 1 of birthYear
        dob.setDate(dayNumber);           // dayNumber add karanawa
        let formattedDOB = dob.getFullYear() + "-" +
            String(dob.getMonth() + 1).padStart(2, "0") + "-" +
            String(dob.getDate()).padStart(2, "0");

        dateDob.value = formattedDOB;  // DOB input field set karanawa
        teacher.dob = formattedDOB;      // teacher object ekata bind karanawa
        dateDob.style.border = '2px solid green'; // date field green wenawa
    }
    else { // NIC invalid nam
        textTeacherNic.style.border = '2px solid red';
        dateDob.value = "";
        dateDob.disabled = true;
        teacher.dob = null;
        teacher.nic = null;
        teacher.gender = null;
        radioMale.checked = false;
        radioFemale.checked = false;
    }
} */

// NIC validate karana function eka define karanawa
const textNicValidator = () => {
    // User enter karana NIC eka gannawa
    let nic = textTeacherNic.value;

    // NIC format validate karana regex Matches karanne
    // - old 10-digit NIC: 6,7,8,9 first digit + 7 digits + V/v/X/x/S/s
    // - new 12-digit NIC: 12 digits
    let regPattern = new RegExp("^((([6][56789][0-9]{7}[VvXxSs])|([7-9][0-9]{8}[VvXxSs]))|([0-9]{12}))$");

    //nic valid nam
    if (regPattern.test(nic)) {
        // valid → green border 2px
        textTeacherNic.style.border = '2px solid green';
        teacher.nic = nic; // data bind karanawa

        //date generate
        let birthYear = "";
        let dayCount = "";  // NIC eke thiyana day count eka store karanna

        if (nic.length == 10) { // old 10-digit NIC nam
            birthYear = "19" + nic.substring(0, 2); // 19 + first 2 digits → birth year
            dayCount = nic.substring(2, 5);         // next 3 digits → day of year
        } else { // new 12-digit NIC nam
            birthYear = nic.substring(0, 4);       // first 4 digits → birth year
            dayCount = nic.substring(4, 7);        // next 3 digits → day of year
        }

        // gender determine karanawa dayCount eka use karala
        let dayNumber = parseInt(dayCount);
        if (dayNumber > 500) { // female nam
            dayNumber -= 501; // 500 gihin pasuwa calculate karanawa
            radioFemale.checked = true;
            radioMale.checked = false;
            teacher.gender = "Female";
        } else { // male nam
            radioMale.checked = true;
            radioFemale.checked = false;
            teacher.gender = "Male";
        }

        // actual DOB calculate karanawa birthYear + dayNumber use karala
        let dob = new Date(birthYear, 0); // Jan 1 of birthYear
        dob.setDate(dayNumber);           // dayNumber add karanawa

        let formattedDOB = dob.getFullYear() + "-" +
            String(dob.getMonth() + 1).padStart(2, "0") + "-" +
            String(dob.getDate()).padStart(2, "0");

        // teacher ge age eka calculate karanawa
        let today = new Date();
        let age = today.getFullYear() - dob.getFullYear();

        // birthday eka thama awilla nathnam age eken 1k adu karanawa
        if (
            today.getMonth() < dob.getMonth() ||
            (today.getMonth() == dob.getMonth() && today.getDate() < dob.getDate())
        ) {
            age--;
        }

        // age eka 18 ta adu ho 60 ta wadi nam invalid karanawa
        if (age < 18 || age > 60) {
            textTeacherNic.style.border = '2px solid red';
            dateDob.value = "";
            dateDob.style.border = '2px solid red';

            teacher.nic = null;
            teacher.dob = null;
            teacher.gender = null;

            radioMale.checked = false;
            radioFemale.checked = false;

            alert("Teacher age must be between 18 and 60 years.");
            return;
        }

        dateDob.value = formattedDOB;  // DOB input field set karanawa
        teacher.dob = formattedDOB;    // teacher object ekata bind karanawa
        dateDob.style.border = '2px solid green'; // date field green wenawa
    }
    else { // NIC invalid nam
        textTeacherNic.style.border = '2px solid red';
        dateDob.value = "";
        dateDob.disabled = true;
        teacher.dob = null;
        teacher.nic = null;
        teacher.gender = null;
        radioMale.checked = false;
        radioFemale.checked = false;
    }
}

// bank branch suggestion load function eka
const loadBankBranchSuggestion = () => {

    // datalist eka gannawa
    let bankBranchList = document.querySelector("#bankBranchList");

    // input eka page eke thiyanawanam witharak run karanawa
    if (textBankBranchName != null && bankBranchList != null) {

        // user type karana welawata search karanawa
        textBankBranchName.addEventListener("keyup", () => {

            // type karapu value eka gannawa
            let text = textBankBranchName.value;

            // value ekak thiyanawanam backend search karanawa
            if (text.length > 0) {

                // database eken matching branch names gannawa
                let branches = getDataAjaxGetRequest("/teacher/searchbankbranch/" + text);

                // old suggestions ain karanawa
                bankBranchList.innerHTML = "";

                // aluth suggestions add karanawa
                branches.forEach(branch => {
                    let option = document.createElement("option");

                    // branch name eka set karanawa
                    option.value = branch;
                    bankBranchList.appendChild(option);

                });

            }

        });

    }

}
// function eka call karanawa
loadBankBranchSuggestion();

/* ----------- subjectdetail form ------------------------ */

const textSubjectDetail = document.querySelector("#textSubjectDetail");


// define loadSubjectDetailForm 
const loadSubjectDetailForm = () => {

    // form eke thiyena values clear karanawa
    formsubjectDetail.reset();

    // old subjectdetail object eka remove karala new empty object ekak create karanawa
    subjectdetail = new Object();

}

// me function eka designation  form eke errors check karanna use karanne
const checkFormErrorSubjectDetail = () => {
    let errors = ""; // Collect errors here empty string pass

    // current subjectdetail object eke subjectdetail name check
    if (subjectdetail.name == null) {
        errors += "Please enter a valid Subject name. This is a required field<br>";
        textSubjectDetail.style.border = "1px solid red";
    }

    return errors; // Return all errors or
    //okkoma fil krla nm methnin pass wenne ------> empty string
}

// define function for subject details form submission
const buttonSubjectDetailSubmit = () => {

    console.log(subjectdetail);

    // form validation check karanawa
    let errors = checkFormErrorSubjectDetail();

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
        title: "Save Subject?",
        text: "Do you want to save this subject?",
        icon: "question",
        width: 320,
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#0d6efd",
        cancelButtonColor: "#6c757d"
    }).then((result) => {

        // user save kiyala confirm karoth
        if (result.isConfirmed) {

            // designation object eka database ekata save karanawa
            let response = setDataAjaxGetRequest("/subjectdetail/insert", "POST", subjectdetail);

            // save success nam
            if (response == "OK") {

                // success message eka pennanawa
                Swal.fire({
                    icon: "success",
                    title: "Saved!",
                    text: "Subject saved successfully.",
                    width: 320,
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {

                    // form eka reset karanawa
                    loadSubjectDetailForm();

                    // modal eka close karanawa
                    $("#subjectDetailModal").modal("hide");

                    // teacher form tab eka active karanawa
                    let formTab = new bootstrap.Tab(document.querySelector("#tabFormButton"));
                    formTab.show();

                    // aluthin add una subjectdetail list eka gannawa
                    let subjectdetails = getDataAjaxGetRequest("/subjectdetail/alldata");

                    // subjectdetail dropdown eka aluth list eken refill karanawa
                    loadSelectOptions(selectThSubject, subjectdetails, "Select Subject...!", "name");

                    // aluthin add una subjectdetail eka automatically select karanawa
                    selectThSubject.value = JSON.stringify(subjectdetails[subjectdetails.length - 1]);

                    // teacher object ekata selected subjectdetail eka assign karanawa
                    teacher.subjectdetail_id = subjectdetails[subjectdetails.length - 1];

                    // success kiyala penenna dropdown border eka green karanawa
                    selectThSubject.style.border = "2px solid green";

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