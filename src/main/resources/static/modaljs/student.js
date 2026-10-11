//browser refresh event – page eka reload wenakota db eken student data okkoma update wenawa.
//eka nisa student table eka refresh wenna reusable function ekak hadala use karanawa.
//me function eka submission, update, delete awasthawal di call karanawa.
//advantage – code reusability ekak tiyenawa, code eka simple wenawa.

//browser load event
window.addEventListener("load", () => {

    // Logged-in user ta STUDENT module eka sambandha permissions ganna
    userPrivilege = getDataAjaxGetRequest("/userprivilegebymodule?modulename=STUDENT");

    // Add input event listener for Guardian NIC
    //(type krna kota loadGurdian function call wenawa)
    textGuardianFilterNic.addEventListener("input", loadGuardian);



    //call table refresh function
    loadStudentTable();
    //call form refresh function
    loadStudentForm();



});

let textGuardianFilterNic = document.querySelector("#textGuardianFilterNic");
let textGuardianName = document.querySelector("#textGuardianName");
let textGuardianMobile = document.querySelector("#textGuardianMobile");
let selectGuardianType = document.querySelector("#selectGuardianType");
let textGuAddress = document.querySelector("#textGuAddress");
let divGuardian = document.querySelector("#divGuardian");

let labelStuStatus = document.querySelector("#labelStuStatus");
let divSelectStuStatus = document.querySelector("#divSelectStuStatus");


let textStuFullname = document.querySelector("#textStuFullname");
let selectCallingName = document.querySelector("#selectCallingName");
let textStuNic = document.querySelector("#textStuNic");
let dateDob = document.querySelector("#dateDob");
let textStuAge = document.querySelector("#textStuAge");
let radioMale = document.querySelector("#radioMale");
let textStuAddress = document.querySelector("#textStuAddress");
let radioFemale = document.querySelector("#radioFemale");
let textMobileWhatsApp = document.querySelector("#textMobileWhatsApp");
let selectGuardianStatus = document.querySelector("#selectGuardianStatus");
let tabFormButton = document.querySelector("#tabFormButton");
let selectStuStatus = document.querySelector("#selectStuStatus");
// student photo default preview image eka
let defaultPhoto = "images/studenticon.jpg";

const guardians = getDataAjaxGetRequest("/guardian/alldata");
// Guardian NIC input ekata adala details load karana reusable function eka
const loadGuardian = () => {

    // Guardian NIC input field eke value eka trim karala gannawa
    const nic = textGuardianFilterNic.value.trim();

    // 1.NIC empty nam (user clear karoth)
    if (nic.length === 0) {

        // Guardian details div eka hide karanawa
        divGuardian.style.display = "none";

        // Guardian related input fields clear karanawa
        textGuardianName.value = "";
        textGuardianMobile.value = "";
        selectGuardianType.value = "";
        textGuAddress.value = "";
        selectGuardianStatus.value = "";

        // Student auto-filled address & mobile clear karanawa
        textStuAddress.value = "";
        textMobileWhatsApp.value = "";

        // Default border style reset karanawa
        textStuAddress.style.border = "1.5px solid rgb(164, 201, 232)";
        textMobileWhatsApp.style.border = "1.5px solid rgb(164, 201, 232)";

        // Student object eke guardian reference eka clear karanawa
        student.guardianId = null;

        // Function eka stop karanawa
        return;
    }

    // 2️.NIC length 10 ta wada adu nam function eka stop
    if (nic.length < 10) return;

    // 3️.Guardians array eke NIC eka match karala guardian hoyagannawa
    const guardianData = guardians.find(g => g.nic === nic);

    // 4️.Guardian hamba wenne naththam
    if (!guardianData) {

        // Guardian div eka hide karanawa
        divGuardian.style.display = "none";

        // Student guardian reference eka clear karanawa
        student.guardianId = null;

        // Function eka stop karanawa
        return;
    }
    // 5️.Guardian hamba unoth guardian div eka show karanawa
    divGuardian.style.display = "block";

    // Student object eke guardian foreign key eka set karanawa
    student.guardian_id = { id: guardianData.id };

    // 6️. Student Address auto-fill + bind
    if (guardianData.address) {

        // UI eke address fill karanawa
        textStuAddress.value = guardianData.address;

        // Student object ekata address bind karanawa
        student.address = guardianData.address;

        // Green border danna
        textStuAddress.style.border = "2px solid green";

    } else {

        // Address naththam UI eka clear karanawa
        textStuAddress.value = "";

        // Student object eka clear karanawa
        student.address = null;

        // Default border danna
        textStuAddress.style.border = "1.5px solid rgb(164, 201, 232)";
    }

    // User manual edit karoth student.address update wenna
    textStuAddress.oninput = () => {
        student.address = textStuAddress.value;
    }

    // 7️.Student Mobile (WhatsApp) auto-fill + bind
    if (guardianData.mobileno) {

        // UI eke mobile fill karanawa
        textMobileWhatsApp.value = guardianData.mobileno;

        // Student object ekata mobile bind karanawa
        student.whatsapno = guardianData.mobileno;

        // Green border danna
        textMobileWhatsApp.style.border = "2px solid green";

    } else {

        // Mobile naththam UI eka clear karanawa
        textMobileWhatsApp.value = "";

        // Student object clear karanawa
        student.whatsapno = null;

        // Default border danna
        textMobileWhatsApp.style.border = "1.5px solid rgb(164, 201, 232)";
    }

    // User manual edit karoth student.whatsapno update wenna
    textMobileWhatsApp.oninput = () => {
        student.whatsapno = textMobileWhatsApp.value;
    }

    // 8️.Guardian personal details fill karanawa (read-only)
    textGuardianName.value = guardianData.guardianname;
    textGuardianMobile.value = guardianData.mobileno;
    textGuAddress.value = guardianData.address;

    // 9️. Guardian Type handling (Other support)
    if (guardianData.guardiantype_id) {
        selectGuardianType.value =
            (guardianData.guardiantype_id.name === "Other" && guardianData.otherguardian)
                ? guardianData.otherguardian
                : guardianData.guardiantype_id.name;
    } else {
        selectGuardianType.value = "";
    }

    // 10. Guardian Status handling (Other support)
    if (guardianData.guardianstatus_id != null) {
        selectGuardianStatus.value = guardianData.guardianstatus_id.name;
    } else {
        selectGuardianStatus.value = "";
    }

}

//define getGurdainName
/* const getGurdainName = (dataOb) => {
    return dataOb.guardian_id.guardianname;
} */
// Define student status function
const getStudentStatus = (dataOb) => {
    const status = dataOb.studentstatus_id.name;

    if (status === "Active") {
        return `<span style="color: green; font-weight: bold;">${status}</span>`;
    }
    if (status === "In-Active") {
        return `<span style="color: orange; font-weight: bold;">${status}</span>`;
    }

    // Unknown status
    return `<span>${status}</span>`;
}

//student table refresh function
loadStudentTable = () => {
    // create empty array for catch many objects 
    students = new Array();
    // backend eken student okkoma gannawa
    students = getDataAjaxGetRequest("/student/alldata");
    students.reverse();//decending kra

    //string-string, numbers, date
    //function-object, array, boolean, image
    //create property array
    let displayColumns = [
        { property: "regno", dataType: "string" },
        { property: "fullname", dataType: "string" },
        /*  { property: getGurdainName, dataType: "function" },
         { property: "whatsapno", dataType: "string" }, */
        { property: getStudentStatus, dataType: "function" }
    ];

    // Call reusable table data fill function
    loadTableData(tableBodyStudent, students, displayColumns, printStudent, editStudent, deleteStudent);

    // initialize datatable plugin

    for (const index in students) {
        // Update permission naththm – update button hide karanawa
        if (!userPrivilege.privi_update) {
            tableBodyStudent.children[index].children[4].children[1].style.display = "none";
        }
        // Delete permission naththm – delete button hide karanawa
        if (!userPrivilege.privi_delete) {
            tableBodyStudent.children[index].children[4].children[2].style.display = "none";
        }
    }
    $('#tableStudent').dataTable();
}

//define  function for student form error check
const checkStudentFormError = () => {
    let errors = ""; // errors collect karanna empty string ekak hadanawa

    if (!student.guardian_id || !student.guardian_id.id) {
        errors += "Please enter valid Guardian NIC. This is a required field. <br>";
        textGuardianFilterNic.style.border = "1px solid red";
    }

    // Student Name check
    if (student.fullname == null) {
        errors += "Please enter valid Student Full name. This is a required field. <br>";
        textStuFullname.style.border = "1px solid red"; // input field red border
    }
    // Calling name check
    if (student.callingname == null) {
        errors += "Please enter Calling Name. This is a required field. <br>";
        selectCallingName.style.border = "1px solid red";
    }

    // Date of Birth check
    if (student.dob == null) {
        errors += "Please enter Date of Birth. This is a required field. <br>";
        dateDob.style.border = "1px solid red";
    }
    // Gender check
    if (student.gender == null) {
        errors += "Please select Gender. This is a required field. <br>";
    }

    // school name check
    if (student.schoolname == null) {
        errors += "Please enter valid School name. This is a required field. <br>";
        textStuSchool.style.border = "1px solid red";
    }


    return errors; // return all errors
}
// define method for student form submission
const buttonStudentSubmit = () => {
    console.log(student);
    //call common submit function
    submitWithConfirm(checkStudentFormError, student, "/student/insert", () => {
        // success → reset form + reload table
        loadStudentForm();
        loadStudentTable();
    });
}

// define function to edit student records
const editStudent = (dataOb) => {
    // student = dataOb;
    // oldStudent = dataOb;
    // mehema use krnna ba mokada methana reference variable wage hasirennne...
    // student, oldStudent eke thiyenne ekama memory address ekane.
    // e nisa apita update wunu widiha hoyanna ba, dekama enne ekama value.
    // student object ekata changes karoth,
    // oldStudent ekatath ehema change wenawa (eka object ekak nisa).

    // ithin e nisa reference eka galawanna ona.
    // mehema wela thiyenne object gaththa nisa (object type eke thiyenawa reference ekak).
    // eka string ekakata convert krgannwa (deep copy hadanna).
    // but string ekata convert karama access krnna ba,
    // e nisa eka aye object ekakata path krgnna JSON ekenma.
    // -> JSON.stringify() : object ekata string ekakata hadanawa.
    // -> JSON.parse() : string ekata object ekakata hadanawa.
    // mehema krama eken deep copy ekak hadanawa.

    // open Add Student tab
    new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabFormArea"]')).show();
    tabFormButton.innerText = "Update Student";

    // deep copy krnna dataOb eka (student & oldStudent)
    student = JSON.parse(JSON.stringify(dataOb));
    oldStudent = JSON.parse(JSON.stringify(dataOb));

    //emp photo refil
    if (student.photo != null) {
        imgPhoto.src = atob(student.photo);
    }

    // Fullname input
    textStuFullname.value = student.fullname != null ? student.fullname : "";

    // Calling name dropdown
    selectCallingName.innerHTML = "";
    let optionMsg = document.createElement("option");
    optionMsg.selected = true;
    optionMsg.disabled = true;
    optionMsg.value = "";
    optionMsg.innerText = "Select Calling Name..!";
    selectCallingName.appendChild(optionMsg);

    if (student.fullname != null) {
        student.fullname.split(" ").forEach(namePart => {
            let option = document.createElement("option");
            option.value = namePart;
            option.innerText = namePart;
            selectCallingName.appendChild(option);
        });
    }

    selectCallingName.value = student.callingname != null ? student.callingname : "";

    // NIC
    textStuNic.value = student.nic != null ? student.nic : "";

    // DOB, Age, Gender calculation based on NIC
    const regPattern = /^[0-9]{12}$/;
    let nic = textStuNic.value;
    if (nic !== "" && regPattern.test(nic)) {
        let birthYear = parseInt(nic.substring(0, 4));
        let dayCount = parseInt(nic.substring(4, 7));
        let age = new Date().getFullYear() - birthYear;

        if (age < 12 || age > 18) {
            alert("Student age must be between 12 and 18 years!");
            textStuNic.style.border = '2px solid red';
            textStuAge.style.border = '2px solid red';
            student.nic = null;
            student.age = null;
            student.dob = null;
            student.gender = null;
            return;
        }

        student.age = age;
        textStuAge.value = age;
        dateDob.disabled = true;

        if (dayCount > 500) {
            radioFemale.checked = true;
            radioMale.checked = false;
            student.gender = "Female";
            dayCount -= 501;
        } else {
            radioMale.checked = true;
            radioFemale.checked = false;
            student.gender = "Male";
        }

        let dob = new Date(birthYear, 0);
        dob.setDate(dayCount);
        let formattedDOB = dob.getFullYear() + "-" + String(dob.getMonth() + 1).padStart(2, "0") + "-" + String(dob.getDate()).padStart(2, "0");
        student.dob = formattedDOB;
        dateDob.value = formattedDOB;

    } else {
        // NIC empty → manual DOB & gender input allow
        dateDob.disabled = false;

        if (student.dob != null) {
            dateDob.value = student.dob;
            let birthYear = parseInt(student.dob.substring(0, 4));
            let age = new Date().getFullYear() - birthYear;
            student.age = age;
            textStuAge.value = age;
        }

        // Gender manual fill
        if (student.gender === "Male") {
            radioMale.checked = true;
            radioFemale.checked = false;
        } else if (student.gender === "Female") {
            radioFemale.checked = true;
            radioMale.checked = false;
        }
    }

    // Remaining Student fields
    textStuAddress.value = student.address;
    textMobileWhatsApp.value = student.whatsapno;
    textStuSchool.value = student.schoolname;

    // Dynamic select elements
    if (student.grade_id != null) selectStuGrade.value = JSON.stringify(student.grade_id);
    if (student.studentstatus_id != null) selectStuStatus.value = JSON.stringify(student.studentstatus_id);

    labelStuStatus.style.display = "block";
    divSelectStuStatus.style.display = "block";

    // Buttons control
    buttonSubmit.style.display = "none";  // submit button hide
    buttonUpdate.style.display = "block"; // update button show
    buttonClear.style.display = "none";  // clear button hide

    // --- Guardian Details ---

    if (student.guardian_id != null) {
        divGuardian.style.display = "block";

        // set guardian id for data binding
        student.guardianId = { id: student.guardian_id.id };

        // NIC filter input fill & disable
        textGuardianFilterNic.value = student.guardian_id.nic;
        textGuardianFilterNic.disabled = true;

        // fill guardian details
        textGuardianName.value = student.guardian_id.guardianname;
        textGuardianMobile.value = student.guardian_id.mobileno;
        textGuAddress.value = student.guardian_id.address;
        selectGuardianStatus.value = student.guardian_id.guardianstatus_id.name;

        // Guardian Type
        if (student.guardian_id.guardiantype_id.name === "Other") {
            selectGuardianType.value = student.guardian_id.otherguardian;
        } else {
            selectGuardianType.value = student.guardian_id.guardiantype_id.name;
        }
    } else {
        divGuardian.style.display = "none";
        textGuardianName.value = "";
        textGuardianMobile.value = "";
        textGuAddress.value = "";
        selectGuardianType.value = "";
        selectGuardianStatus.value = "";
    }
}

// define function to check student form updates
const checkStudentFormUpdate = () => {
    let updates = "";

    if (student != null && oldStudent != null) {

        // Guardian NIC change
        if (student.guardian_id.id != oldStudent.guardian_id.id) {
            updates = updates + "Guardian NIC is changed. " + oldStudent.guardian_id.id + " --> " + student.guardian_id.id + "\n";
        }

        // Fullname change
        if (student.fullname != oldStudent.fullname) {
            updates = updates + "Fullname is changed. " + oldStudent.fullname + " --> " + student.fullname + "\n";
        }

        // Calling Name change
        if (student.callingname != oldStudent.callingname) {
            updates = updates + "Calling Name is changed. " + oldStudent.callingname + " --> " + student.callingname + "\n";
        }

        // Date of Birth change
        if (student.dob != oldStudent.dob) {
            updates = updates + "Date of Birth is changed. " + oldStudent.dob + " --> " + student.dob + "\n";
        }

        // Gender change
        if (student.gender != oldStudent.gender) {
            updates = updates + "Gender is changed. " + oldStudent.gender + " --> " + student.gender + "\n";
        }

        // Mobile number change
        if (student.whatsapno != oldStudent.whatsapno) {
            updates = updates + "Mobile Number is changed. " + oldStudent.whatsapno + " --> " + student.whatsapno + "\n";
        }

        // Address change
        if (student.address != oldStudent.address) {
            updates = updates + "Address is changed. " + oldStudent.address + " --> " + student.address + "\n";
        }

        // School Name change
        if (student.schoolname != oldStudent.schoolname) {
            updates = updates + "School Name is changed. " + oldStudent.schoolname + " --> " + student.schoolname + "\n";
        }

        // Student Status change
        if (student.studentstatus_id.id != oldStudent.studentstatus_id.id) {
            updates = updates + "Student Status is changed. " + oldStudent.studentstatus_id.name + " --> " + student.studentstatus_id.name + "\n";
        }
        if (student.photo != oldStudent.photo) {
            updates += "Photo is changed.\n";
        }
    }

    return updates;
}

// define function for update student records
const buttonStudentUpdate = () => {
    // call common update function with error & update check
    updateWithConfirm(checkStudentFormError, checkStudentFormUpdate, student, "/student/update", () => {
        // success → reset form + reload table
        loadStudentForm();  // form eka clear karanawa
        loadStudentTable(); // table 
    });
}

//show student form tab
const showStudentFormTab = () => {

    new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabFormArea"]')).show();
    // tab eke button text set karanna
    tabFormButton.innerText = "Add Student";
    clearPhoto();
    loadStudentForm();

}

// student form refresh karana function
loadStudentForm = () => {
    // tab eke button text set karanna
    tabFormButton.innerText = "Add Student";

    // form eka reset karanna (input fields wala thibuna values okkoma clear wenawa)
    formStudent.reset();

    // aluth empty object hadanna → data binding walata use karanna
    student = new Object();
    // mokadda - valid value tika collect karala backend ekata pass karanna ona
    // ekka ekka pass karanawa wada object eka pass karanna lesi

    // Male select wela nam
    radioMale.addEventListener("change", () => {
        if (radioMale.checked) student.gender = "Male";
    });

    // Female select wela nam
    radioFemale.addEventListener("change", () => {
        if (radioFemale.checked) student.gender = "Female";
    });

    // student status dropdown load karanawa
    // DB eken okkoma studentstatuses ganna → dropdown ekata load karanna
    let studentstatuses = getDataAjaxGetRequest("/studentstatus/alldata");
    loadSelectOptions(selectStuStatus, studentstatuses, "Select Student Status...!", "name");
    selectStuStatus.value = ""; // auto selected value clear karanna

    textGuardianFilterNic.disabled = false;
    divGuardian.style.display = "none";

    // current date eka gannawa
    let today = new Date();

    // student ta maximum age eka 18 nisa
    // minimum DOB eka hadanawa
    let minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    // student ta minimum age eka 12 nisa
    // maximum DOB eka hadanawa
    let maxDate = new Date(today.getFullYear() - 11, today.getMonth(), today.getDate());

    // date format eka YYYY-MM-DD widihata convert karanawa
    let minDob = minDate.toISOString().split('T')[0];
    let maxDob = maxDate.toISOString().split('T')[0];

    // date input ekata limits set karanawa
    // 12–18 age students lata witharak date select karanna puluwan
    dateDob.min = minDob;
    dateDob.max = maxDob;

    // student status default set karanna
    student.studentstatus_id = { id: 1, name: "Active" };
    selectStuStatus.value = JSON.stringify(student.studentstatus_id);

    // Employee status label saha select hide karanna
    labelStuStatus.style.display = "none";
    divSelectStuStatus.style.display = "none";

    // userta ta insert privilege naththam form buttons hide karanawa
    if (!userPrivilege.privi_insert) {
        tabFormButton.style.display = "none";   // "Add New" button hide
        buttonSubmit.style.display = "none";    // "Save" button hide
    }
    // --- Buttons control karanna ---
    buttonUpdate.style.display = "none"; // update button hide karanna
    buttonSubmit.style.display = "block"; // submit button show karanna

    // form eke tiyena input, select, radio okkoma border colour / UI reset karanawa
    setUIColour([textGuardianFilterNic, textStuFullname, selectCallingName, textStuNic, dateDob, textStuAge, radioFemale, radioMale, textMobileWhatsApp, textStuLandno, textStuAddress, textStuSchool, selectStuStatus]);

    // table tab activate karanna, form tab hide karanna epa
    let tableTab = new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabTableArea"]'));
    tableTab.show();
}

//fullname validatation
const textFullnameValidator = () => {

    // input eke fullname value gannawa
    let fullname = textStuFullname.value;

    // regex pattern define karanawa
    let regPattern = new RegExp("^([A-Z][a-z]{2,20}(\\s)){1,20}([Dd]e\\s)?([A-Z][a-z]{2,20})$");
    // regex pattern:
    // ^ → string eka start wenna one
    // ([A-Z][a-z]{2,20}(\\s)){1,20} → first name(s) capital letter + simple letters, 1–20 words + space
    // ([Dd]e\\s)? → middle name "de" ekak thiyenawanam allow karanawa, optional
    // ([A-Z][a-z]{2,20}) → last name capital letter + simple letters
    // $ → string eka end wenna one

    // fullname valid nam
    if (regPattern.test(fullname)) {

        textStuFullname.style.border = '2px solid green';
        student.fullname = fullname; // data bind karanawa

        // calling name dropdown clear karanawa
        selectCallingName.innerHTML = "";

        // default option set karanawa
        let optionMsg = document.createElement("option");
        optionMsg.selected = "selected";
        optionMsg.disabled = "disabled";
        optionMsg.value = "";
        optionMsg.innerText = "Select Calling Name..!";
        selectCallingName.appendChild(optionMsg);

        // fullname split karala dropdown options hadanawa
        let nameParts = fullname.split(" ");

        nameParts.forEach(namePart => {
            let option = document.createElement("option");
            option.value = namePart;
            option.innerText = namePart;
            selectCallingName.appendChild(option);
        });

    } else {
        // invalid nam red border
        textStuFullname.style.border = '2px solid red';

    }
}

// calling name validator
const callingNameValidator = () => {

    // dropdown value gannawa
    const callingname = selectCallingName.value;

    if (callingname) {
        selectCallingName.style.border = '2px solid green';
        student.callingname = callingname;
    } else {

        selectCallingName.style.border = '2px solid red';
        student.callingname = null;

    }
}

//student nic validator
const textStuNicValidator = () => {

    // NIC input value gannawa
    let nic = textStuNic.value;

    // ONLY new NIC allow karanawa (12 digits)
    let regPattern = new RegExp("^[0-9]{12}$");

    // NIC empty naththnam + valid nam
    if (nic !== "" && regPattern.test(nic)) {

        // birth year calculate karanawa
        let birthYear = nic.substring(0, 4);

        // NIC eke day count eka gannawa
        let dayCount = nic.substring(4, 7);

        // age calculate karanawa
        let age = new Date().getFullYear() - parseInt(birthYear);

        // student age 12 – 18 between check karanawa
        if (age < 12 || age > 18) {

            alert("Student age must be between 12 and 18 years!");

            textStuNic.style.border = '2px solid red';
            textStuAge.style.border = '2px solid red';

            student.nic = null;
            student.age = null;
            student.dob = null;
            student.gender = null;

            return;
        }

        // NIC bind karanawa
        student.nic = nic;
        textStuNic.style.border = '2px solid green';

        // age field set karanawa
        textStuAge.value = age;
        textStuAge.style.border = '2px solid green';
        student.age = age;

        // manual fields disable karanawa
        dateDob.disabled = true;

        // day count convert karanawa
        let dayNumber = parseInt(dayCount);

        // gender calculate karanawa
        if (dayNumber > 500) {

            radioFemale.checked = true;
            radioMale.checked = false;

            student.gender = "Female";
            dayNumber -= 501;

        } else {

            radioMale.checked = true;
            radioFemale.checked = false;
            student.gender = "Male";

        }

        // DOB calculate karanawa
        let dob = new Date(birthYear, 0);
        dob.setDate(dayNumber);

        let formattedDOB =
            dob.getFullYear() + "-" +
            String(dob.getMonth() + 1).padStart(2, "0") + "-" +
            String(dob.getDate()).padStart(2, "0");

        dateDob.value = formattedDOB;
        dateDob.style.border = '2px solid green';

        student.dob = formattedDOB;

        return;
    }

    // NIC empty nam → manual fields enable karanawa
    if (nic === "") {

        student.nic = null;
        textStuNic.style.border = '1px solid #ccc';
        dateDob.disabled = false;
        return;
    }

    // NIC invalid nam
    textStuNic.style.border = '2px solid red';
    student.nic = null;
}

//dob validator
const dateDobValidator = () => {

    // NIC thiboth dob validation skip karanawa
    if (student.nic) return;

    let dob = dateDob.value;

    // DOB empty nam
    if (dob === "") {

        dateDob.style.border = '2px solid red';
        student.dob = null;
        return;
    }
    // birth year gannawa
    let birthYear = parseInt(dob.substring(0, 4));

    // age calculate karanawa
    let age = new Date().getFullYear() - birthYear;

    // student age 12 – 18 check karanawa
    if (age < 11 || age > 18) {

        alert("Student age must be between 11 and 18 years!");

        dateDob.style.border = '2px solid red';
        textStuAge.style.border = '2px solid red';

        student.age = null;

        return;
    }
    // valid DOB nam
    dateDob.style.border = '2px solid green';
    textStuAge.value = age;
    textStuAge.style.border = '2px solid green';

    student.dob = dob;
    student.age = age;
}

const printStudent = (dataOb) => {
    const student = dataOb;

    // Student details
    tdStudentNo.innerText = student.regno;
    tdFullName.innerText = student.fullname;
    tdCallingName.innerText = student.callingname;
    tdNic.innerText = student.nic;
    tdDob.innerText = student.dob;
    // tdAge.innerText = student.age;
    tdGender.innerText = student.gender;
    tdAddress.innerText = student.address;
    tdMobile.innerText = student.whatsapno;
    tdSchool.innerText = student.schoolname;
    tdStudentStatus.innerText = student.studentstatus_id.name;

    // Guardian details
    if (student.guardian_id) {
        tdGuardianName.innerText = student.guardian_id.guardianname;
        tdGuardianNic.innerText = student.guardian_id.nic;
        tdGuardianMobile.innerText = student.guardian_id.mobileno;
        tdGuardianAddress.innerText = student.guardian_id.address;
        // Guardian Type
        if (student.guardian_id.guardiantype_id.name === "Other") {
            tdGuardianType.innerText = student.guardian_id.otherguardian;
        } else {
            tdGuardianType.innerText = student.guardian_id.guardiantype_id.name;
        }
        tdGuardianStatus.innerText = student.guardian_id.guardianstatus_id.name;
    }
    // Show modal
    $("#modalStudentPrint").modal("show");
}

// Print button eka click karama call wenna function eka
const buttonPrint = () => {

    const newTab = window.open("", "", "width=900,height=700");

    newTab.document.writeln(`
        <html>
        <head>
            <title>Student Details Report</title>

            <link rel="stylesheet" href="bootstrap-5.2.3/css/bootstrap.min.css">

            <style>
                body{
                    margin:30px;
                    font-family:Arial, sans-serif;
                }

                .header{
                    text-align:center;
                    margin-bottom:20px;
                }

                .header h2{
                    margin:0;
                    font-weight:bold;
                }

                .header h5{
                    margin:5px 0;
                }

                .header p{
                    margin:2px;
                    font-size:14px;
                }

                hr{
                    border:1px solid #000;
                }

                table{
                    width:100%;
                    border-collapse:collapse;
                }

                table th,
                table td{
                    border:1px solid #000 !important;
                    padding:8px;
                }

                .footer{
                    margin-top:70px;
                    display:flex;
                    justify-content:space-between;
                }

                .footer div{
                    width:220px;
                    text-align:center;
                    border-top:1px solid #000;
                    padding-top:5px;
                }
            </style>

        </head>

        <body>

            <div class="header">
                <h2>Jithma Institute</h2>
                <h5>Student Details Report</h5>
                <p>No. 402/C/1, Dagonna, Negombo.</p>
            </div>

            <hr>

            ${tablePrintStudent.outerHTML}


        </body>
        </html>
    `);

    newTab.document.close();

    setTimeout(() => {
        newTab.print();
        newTab.close();
    }, 250);

    $("#modalStudentPrint").modal("hide");
}
// define method for student delete
const deleteStudent = (dataOb) => {

    // Data object eka assign karanawa local variable ekakata
    const student = dataOb;

    // Delete confirm message ekak hadanawa (details tika pennanna)
    const message =
        "<b>Student No :</b> " + student.regno + "<br>" +
        "<b>Student Name :</b> " + student.fullname;


    // common delete function eka call karanawa
    deleteWithConfirm(student, message, "/student/delete", () => {
        // success unama passe form eka reset + table reload
        loadStudentForm();  // Form eka clear karanawa
        loadStudentTable(); // Table eka refresh karanawa

    });
}
function clearPhoto() {
    // reset the image preview to default student icon
    document.getElementById("imgPhoto").src = "images/studenticon.jpg";

    // clear the file input value
    document.getElementById("filePhoto").value = "";

    // optional: clear the student object photo property if using JS object
    if (typeof student !== "undefined") {
        student.photo = null;
    }
}