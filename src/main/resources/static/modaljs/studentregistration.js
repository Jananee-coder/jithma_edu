//browser load event – page eka reload wenakota db eken registration data okkoma update wenawa.
//eka nisa registration table eka refresh wenna reusable function ekak hadala use karanawa.
//me function eka submission, update, delete awasthawal di call karanawa.
//advantage – code reusability ekak tiyenawa, code eka simple wenawa.

//browser load event
window.addEventListener("load", () => {

    // Logged-in user ta REGISTRATION module eka sambandha permissions ganna
    userPrivilege = getDataAjaxGetRequest("/userprivilegebymodule?modulename=REGISTRATION")

    // Add input event listener for Stu No
    //(type krna kota loadStudent function call wenawa)
    textStuNoFilter.addEventListener("input", loadStudent);
    selectGrade.addEventListener("change", loadRelevantBatches);

    //call table refresh function
    loadStudentRegistrationTable();
    //call form refresh function
    loadStudentRegistrationForm();
});

let selectGrade = document.querySelector("#selectGrade");
let selectSubject = document.querySelector("#selectSubject");
let selectTeacher = document.querySelector("#selectTeacher");
let textStuNoFilter = document.querySelector("#textStuNoFilter");
let selectBatch = document.querySelector("#selectBatch");
let selectRegType = document.querySelector("#selectRegType");
let textFee = document.querySelector("#textFee");
let selectRegStatus = document.querySelector("#selectRegStatus");
let tabFormButton = document.querySelector("#tabFormButton");
let regStatusLabel = document.querySelector("#regStatusLabel");
let regStatusSelect = document.querySelector("#regStatusSelect");
let divStudentPhoto = document.querySelector("#divStudentPhoto");
let divButtonView = document.querySelector("#divButtonView");
let pCallingName = document.querySelector("#pCallingName");

const students = getDataAjaxGetRequest("/student/alldata");

// Student No input ekata adala details load karana reusable function eka
const loadStudent = () => {
    // Input field eke value trim karala gannawa
    const regno = textStuNoFilter.value.trim();

    // RegNo hariyata 9 characters naththam, photo & name hide karanawa
    if (regno.length !== 9) {
        divStudentPhoto.style.display = "none";
        divButtonView.style.display = "none";
        btnViewStudent.style.display = "none";
        studentregistration.student_id = null;
        return;
    }

    // Student array eke regno ekata match karala student gannawa
    const studentData = students.find(s => s.regno === regno);


    // Student hamba wenne naththam
    if (!studentData) {
        divStudentPhoto.style.display = "none";
        divButtonView.style.display = "none";
        btnViewStudent.style.display = "none";
        studentregistration.student_id = null;
        return;
    }

    // Student hamba unoth calling name & photo display karanawa
    pCallingName.innerText = studentData.callingname;
    divButtonView.style.display = "block";
    if (studentData.photo != null) {
        imgPhoto.src = atob(studentData.photo);
    } else {
        // Default image
        imgPhoto.src = "images/studenticon.jpg";
    }

    // FIX: show as flex because photo + name same row
    divStudentPhoto.style.display = "flex";

    // Show the "View more" button
    btnViewStudent.style.display = "inline-block";

    // Backend submission ekata student id set karanawa
    studentregistration.student_id = studentData;

    // Student details modal fields load karanawa (modal not shown yet)
    tdStudentNo.innerText = studentregistration.student_id.regno;
    tdFullName.innerText = studentregistration.student_id.fullname;
    tdCallingName.innerText = studentregistration.student_id.callingname;
    tdNic.innerText = studentregistration.student_id.nic;
    tdDob.innerText = studentregistration.student_id.dob;
    tdGender.innerText = studentregistration.student_id.gender;
    tdAddress.innerText = studentregistration.student_id.address;
    tdMobile.innerText = studentregistration.student_id.whatsapno;
    tdSchool.innerText = studentregistration.student_id.schoolname;
    tdStudentStatus.innerText = studentregistration.student_id.studentstatus_id.name;

    // Guardian details
    if (studentregistration.student_id.guardian_id) {
        tdGuardianName.innerText = studentregistration.student_id.guardian_id.guardianname;
    }
    textStuNoFilter.style.border = "2px solid green";
}

// Button click event to show modal
btnViewStudent.onclick = () => {
    if (studentregistration.student_id) {
        $("#modalStudentDetail").modal("show");
    }
}

// batch list eka grade, teacher, subject select karala relevant batches filter karala load karanna
const loadRelevantBatches = () => {

    // get current selected values
    const gradeId = selectGrade.value ? JSON.parse(selectGrade.value).id : null;
    const subjectId = selectSubject.value ? JSON.parse(selectSubject.value).id : null;
    const teacherId = selectTeacher.value ? JSON.parse(selectTeacher.value).id : null;

    // DB eken okkoma batches ganna
    let allBatches = getDataAjaxGetRequest("/batch/alldata");

    // relevant batches filter karanawa
    let relevantBatches = allBatches.filter(batch => {
        return (
            (!gradeId || batch.classdetail_id.grade_id.id == gradeId) &&
            (!teacherId || batch.classdetail_id.teacher_id.id == teacherId) &&
            (!subjectId || batch.classdetail_id.subjectdetail_id.id == subjectId)
        );
    });

    // filtered list dropdown ekata load karanawa
    loadSelectOptions(selectBatch, relevantBatches, "Select Batch...!", "batchname");
}
selectBatch.addEventListener("change", function () {

    if (selectBatch.value != "") {
        studentregistration.batch_id = JSON.parse(selectBatch.value);

        // batch month fee -> registration fee
        textFee.value = studentregistration.batch_id.monthfee;
        studentregistration.regfee = textFee.value;

        selectBatch.style.border = "2px solid green";
        textFee.style.border = "2px solid green";
    } else {
        studentregistration.batch_id = null;
        textFee.value = "";
        studentregistration.regfee = null;
    }
});
// handle reg type change
selectRegType.addEventListener("change", () => {
    // parse selected option (object from value)
    const selected = JSON.parse(selectRegType.value);
    studentregistration.regtype_id = selected;
    selectRegType.style.border = "2px solid green";

    // if type is Free → set fee 0
    if (selected.name.toLowerCase() === "free") {
        textFee.value = 0;
        studentregistration.regfee = 0;
        textFee.style.border = "2px solid green";
    } else {
        // if not Free → clear fee (user can enter)
        textFee.value = "";
        studentregistration.regfee = null;
        textFee.style.border = "";
    }
});


const getStudentNo = (dataOb) => {
    return dataOb.student_id.regno;
}
const getBatch = (dataOb) => {
    return dataOb.batch_id.batchname;
}
/* const getRegFee = (dataOb) => {
    // regfee value eka number ekakata convert karanawa
    const fee = parseFloat(dataOb.regfee);

    // integer value nam .00 remove karanawa
    if (Number.isInteger(fee)) {
        return fee;
    }

    // decimal thiyanawanam original value eka display karanawa
    return fee;
} */

// ch status eka color ekakin display karanna function eka
const getRegStatus = (dataOb) => {
    const regstatus = dataOb.studentregstatus_id.name;

    if (regstatus === "Active") {
        return `<span style="color: green; font-weight: bold;">${regstatus}</span>`;
    }
    if (regstatus === "In-Active") {
        return `<span style="color: orange; font-weight: bold;">${regstatus}</span>`;
    }
    return `<span>${regstatus}</span>`;
}


const loadStudentRegistrationTable = () => {

    // create empty array for catch many objects 
    studentregistrations = new Array();
    // backend eken student registrationS okkoma gannawa
    studentregistrations = getDataAjaxGetRequest("/studentregistration/alldata");

    studentregistrations.reverse();//decending kra

    //string-string, numbers, date
    //function-object, array, boolean, image
    //create property array
    let displayColumns = [
        { property: getStudentNo, dataType: "function" },
        { property: getBatch, dataType: "function" },
        // { property: getRegFee, dataType: "function" },
        { property: getRegStatus, dataType: "function" }
    ];

    // Call reusable table data fill function
    loadTableData(tableBodyRegistration, studentregistrations, displayColumns, printRegistration, editRegistration, deleteRegistration);

    // initialize datatable plugin
    $('#tableStudentRegistration').dataTable();
    /*   for (const index in studentregistrations) {
          // Update permission naththm – update button hide karanawa
          if (!userPrivilege.privi_update) {
              tableBodyRegistration.children[index].children[4].children[1].style.display = "none";
          }
          // Delete permission naththm – delete button hide karanawa
          if (!userPrivilege.privi_delete) {
              tableBodyRegistration.children[index].children[4].children[2].style.display = "none";
          }
      } */
    // Check karanawa table body element eka available da kiyala
    if (tableBodyRegistration) {

        // Student registration records okkoma loop karanawa
        for (const index in studentregistrations) {

            // Current row eka gannawa
            let row = tableBodyRegistration.children[index];

            // Row eka thiyenawada kiyala check karanawa
            if (row) {

                // Action column eka gannawa
                let actionColumn = row.children[4];

                // Action column eka thiyenawada kiyala check karanawa
                if (actionColumn) {


                    // Update permission naththam update button hide karanawa
                    if (!userPrivilege.privi_update && actionColumn.children[1]) {

                        actionColumn.children[1].style.display = "none";

                    }


                    // Delete permission naththam delete button hide karanawa
                    if (!userPrivilege.privi_delete && actionColumn.children[2]) {

                        actionColumn.children[2].style.display = "none";

                    }

                }
            }
        }
    }
}


// student form refresh karana function
const loadStudentRegistrationForm = () => {
    // tab eke button text set karanna
    tabFormButton.innerText = "Add Registration";

    // form eka reset karanna (input fields wala thibuna values okkoma clear wenawa)
    formStudentRegistration.reset();

    // aluth empty object hadanna → data binding walata use karanna
    studentregistration = new Object();
    // mokadda - valid value tika collect karala backend ekata pass karanna ona
    // ekka ekka pass karanawa wada object eka pass karanna lesi

    // today date eka registration date field ekata set karanawa
    // new Date() → api enne today date & current time
    // .toISOString() → date eka string format ekata convert karanawa (YYYY-MM-DDTHH:MM:SS.sssZ)
    // .split('T')[0] → T walin split karala date eka gannawa, time eka remove karanawa
    //const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    //dateRegistration.value = today;                       // set input
    //studentregistration.regdate = today;                  // set object property

    // regtype list 
    // DB eken okkoma regtypes ganna -> dropdown ekata load karanna
    regtypes = getDataAjaxGetRequest("/regtype/alldata");
    loadSelectOptions(selectRegType, regtypes, "Select Registration Type...!", "name");

    // auto select "Normal"
    // find "Normal"
    const normal = regtypes.find(r => r.name === "Normal");
    if (normal) {
        // set dropdown value
        selectRegType.value = JSON.stringify(normal);

        // bind object
        studentregistration.regtype_id = normal;

    }
    // grade list 
    // DB eken okkoma grades ganna -> dropdown ekata load karanna
    grades = getDataAjaxGetRequest("/grade/alldata");
    loadSelectOptions(selectGrade, grades, "Select Grade...!", "name");

    regStatuses = getDataAjaxGetRequest("/studentregstatus/alldata");
    loadSelectOptions(selectRegStatus, regStatuses, "Select Status...!", "name");

    //db ekata active widihata status eka pass krnawa
    studentregistration.studentregstatus_id = { id: 1, name: "Active" };
    selectRegStatus.value = JSON.stringify(studentregistration.studentregstatus_id);

    // Hide registration status detail Status label and select
    regStatusLabel.style.display = "none";
    regStatusSelect.style.display = "none";


    // userta ta insert privilege naththam form buttons hide karanawa
    if (!userPrivilege.privi_insert) {
        tabFormButton.style.display = "none";   // "Add New" button hide
        buttonSubmit.style.display = "none";    // "Save" button hide
    }

    // buttons control karanawa
    buttonUpdate.style.display = "none"; // update button hide
    buttonSubmit.style.display = "block"; // submit button show

    // form eke tiyena input, select, radio okkoma border colour / UI reset karanawa
    setUIColour([selectGrade, selectSubject, selectTeacher, selectBatch, selectRegType, textFee, selectRegStatus, textStuNoFilter]);
    // now set green border
    selectRegType.style.border = "2px solid green";
    let tableTab = new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabTableArea"]'));
    tableTab.show(); // form tab hide karanna epa, table tab activate wenawa
}

//grade select change event
selectGrade.addEventListener("change", () => {

    // Selected grade object eka studentregistration object ekata bind krnawa
    studentregistration.grade_id = JSON.parse(selectGrade.value);

    // Selected grade ekata adala subjects load krnawa
    loadRelevantSubjects();

});


// Selected Grade ekata adala subjects load krana function eka
const loadRelevantSubjects = () => {

    // Selected grade id eka gnnawa
    let gradeId = studentregistration.grade_id.id;
    //backend eken grade ekata adala subject eka gannawa
    let subjects = getDataAjaxGetRequest(`/subjectdetail/bygrade/${gradeId}`);

    // Subject dropdown ekata subjects load krnawa
    loadSelectOptions(selectSubject, subjects, "Select Subject...!", "name");

}

//subject select change event
selectSubject.addEventListener("change", () => {

    // Selected subject object eka studentregistration object ekata bind krnawa
    studentregistration.subjectdetail_id = JSON.parse(selectSubject.value);


    // Selected grade + subject walata adala teachers load krnawa
    loadRelevantTeachers();

});

//select krpu grade and subject walata adalawa teachersla load wenwa
const loadRelevantTeachers = () => {

    // Grade or Subject select krla naththm
    // teacher list clear krnawa
    if (studentregistration.grade_id == null || studentregistration.subjectdetail_id == null
    ) {
        loadSelectOptions(selectTeacher, [], "Select Teacher...!", "fullname");
        return;
    }

    // Selected grade id eka gnnawa
    let gradeId = studentregistration.grade_id.id;

    // Selected subject id eka gnnawa
    let subjectId = studentregistration.subjectdetail_id.id;

    // Backend eken Grade + Subject walata adala teachers gannawa
    let teachers = getDataAjaxGetRequest(`/teacher/bygradesubject/${gradeId}/${subjectId}`);

    // Teacher dropdown ekata data load krnawa
    loadSelectOptions(selectTeacher, teachers, "Select Teacher...!", "fullname");
}

// teacher select event
selectTeacher.addEventListener("change", () => {

    // Selected teacher object eka bind  krnawa
    studentregistration.teacher_id = JSON.parse(selectTeacher.value);

    loadRelevantBatches();

});


// define function to edit student registration records
const editRegistration = (dataOb) => {
    // Make a deep copy of the object to avoid reference issues.
    // Direct assignment (studentregistration = dataOb) would link both variables to the same object,
    // so changes in one would affect the other. JSON.stringify + JSON.parse creates a separate copy.

    // open Student Registration tab
    new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabFormArea"]')).show();

    tabFormButton.innerText = "Update Registration";

    // deep copy of selected object
    studentregistration = JSON.parse(JSON.stringify(dataOb));
    oldStudentRegistration = JSON.parse(JSON.stringify(dataOb));


    // Grade
    studentregistration.grade_id = studentregistration.batch_id.classdetail_id.grade_id;
    selectGrade.value = JSON.stringify(studentregistration.grade_id);
    selectGrade.disabled = true;

    // Load subjects first
    loadRelevantSubjects();

    // Subject
    studentregistration.subjectdetail_id = studentregistration.batch_id.classdetail_id.subjectdetail_id;
    selectSubject.value = JSON.stringify(studentregistration.subjectdetail_id);
    selectSubject.disabled = true;

    // Load teachers
    loadRelevantTeachers();

    // Teacher
    studentregistration.teacher_id = studentregistration.batch_id.classdetail_id.teacher_id;
    selectTeacher.value = JSON.stringify(studentregistration.teacher_id);
    selectTeacher.disabled = true;

    // Load batches
    loadRelevantBatches();

    // Batch
    selectBatch.value = JSON.stringify(studentregistration.batch_id);
    selectBatch.disabled = true;

    selectRegType.value = JSON.stringify(studentregistration.regtype_id);
    selectRegType.style.border = "";
    selectBatch.disabled = true;
    textFee.value = studentregistration.regfee;

    studentregistration.grade_id = studentregistration.batch_id.classdetail_id.grade_id;
    studentregistration.subjectdetail_id = studentregistration.batch_id.classdetail_id.subjectdetail_id;
    studentregistration.teacher_id = studentregistration.batch_id.classdetail_id.teacher_id;

    selectRegStatus.value = JSON.stringify(studentregistration.studentregstatus_id);
    regStatusLabel.style.display = "block";
    regStatusSelect.style.display = "block"

    // Buttons control
    buttonSubmit.style.display = "none";  // submit button hide
    buttonUpdate.style.display = "block"; // update button show
    buttonClear.style.display = "none";  // clear button hide

    // --- Load student details ---
    if (studentregistration.student_id) {
        // Fill inputs
        textStuNoFilter.value = studentregistration.student_id.regno;
        textStuNoFilter.disabled = true;
        loadStudent();
        textStuNoFilter.style.border = "";
    } else {
        // Clear inputs & hide photo if no student
        textStuNoFilter.value = "";
        textStuFullname.value = "";
        textStuCallingName.value = "";
        textStuMobile.value = "";
        textStuAddress.value = "";
        textStudentStatus.value = "";

        divStudentPhoto.style.display = "none";
        divButtonView.style.display = "none";
        btnViewStudent.style.display = "none";
    }
}

const printRegistration = (dataOb) => {
    const studentregistration = dataOb;
    // Student details
    tdStundentNo.innerText = studentregistration.student_id.regno;
    tdStudentName.innerText = studentregistration.student_id.fullname;
    tdBatchName.innerText = studentregistration.batch_id.batchname;
    tdRegType.innerText = studentregistration.regtype;
    tdFee.innerText = studentregistration.regfee;

    tdRegistrationStatus.innerText = studentregistration.studentregstatus_id.name;

    // Show modal
    $("#modalRegistrationPrint").modal("show");
}

// Print button eka click karama call wenna function eka
const buttonPrint = () => {

    // Aluth tab ekak open karanawa
    const newTab = window.open();

    // Print page eka create karanawa
    newTab.document.writeln(
        "<html><head><link rel='stylesheet' href='/bootstrap-5.2.3/css/bootstrap.min.css'><title>Print Student Registration</title></head>" +
        "<body>" +
        "<h2>Print Student Registration</h2>" +
        tablePrintRegistration.outerHTML +
        "</body></html>"

    );

    // Document eka close karanawa (render wenna)
    newTab.document.close();

    // interval ekak set kara 250ms – print eka click karama tab open wenawa
    // eeta passe print page eka close karama tab eka close wenawa
    setTimeout(() => {
        newTab.print();
        newTab.close();
    }, 250);

    // Bootstrap modal eka hide karanawa
    $("#modalRegistrationPrint").modal("hide");
}

//define  function for student registration form error check
const checkStudentRegistrationFormError = () => {
    let errors = "";

    // Grade check
    if (studentregistration.grade_id == null) {
        errors += "Please select a Grade. This field is required..<br>";
        selectGrade.style.border = "1px solid red";
    }
    // Subject check
    if (studentregistration.subjectdetail_id == null) {
        errors += "Please select a Subject. This field is required..<br>";
        selectSubject.style.border = "1px solid red";
    }
    // Teacher check
    if (studentregistration.teacher_id == null) {
        errors += "Please select a Teacher. This field is required..<br>";
        selectTeacher.style.border = "1px solid red";
    }
    // Student check
    if (studentregistration.student_id == null) {
        errors += "Please enter a Student No. This field is required..<br>";
        textStuNoFilter.style.border = "1px solid red"; // input field red border
    }
    // Batch check
    if (studentregistration.batch_id == null) {
        errors += "Please select a Batch. This field is required..<br>";
        selectBatch.style.border = "1px solid red";
    }
    // Registration Type check
    if (studentregistration.regtype_id == null) {
        errors += "Please select a Registration Type. This field is required..<br>";
        selectRegType.style.border = "1px solid red";
    }
    // Registration Fee check
    if (studentregistration.regfee == null) {
        errors += "Please enter Registration Fee. This field is required..<br>";
        textFee.style.border = "1px solid red";
    }
    return errors; // return all errors
}

//student registration submission function
const buttonStudentRegistrationSubmit = () => {

    submitWithConfirm(checkStudentRegistrationFormError, studentregistration, "/studentregistration/insert", () => {
        // success → reset form + reload table
        loadStudentRegistrationForm();
        loadStudentRegistrationTable();

    });
}

//define fuction chek updates
const checkStudentRegistrationUpdate = () => {
    let updates = "";

    if (studentregistration != null && oldStudentRegistration != null) {

        if (studentregistration.regtype_id.name != oldStudentRegistration.regtype_id.name) {
            updates += "Registration Type changed: " + oldStudentRegistration.regtype_id.name + " --> " + studentregistration.regtype_id.name + "\n";
        }

        if (studentregistration.regfee != oldStudentRegistration.regfee) {
            updates += "Registration Fee changed: " + oldStudentRegistration.regfee + " --> " + studentregistration.regfee + "\n";
        }

        if (studentregistration.studentregstatus_id.name != oldStudentRegistration.studentregstatus_id.name) {
            updates += "Registration Status changed: " + oldStudentRegistration.studentregstatus_id.name + " --> " + studentregistration.studentregstatus_id.name + "\n";
        }

    }

    return updates; // return all update messages
}

//define update function
const buttonStudentRegistrationUpdate = () => {
    // call common update function with error & update check
    updateWithConfirm(checkStudentRegistrationFormError, checkStudentRegistrationUpdate, studentregistration, "/studentregistration/update", () => {
        // success → reset form + reload table
        loadStudentRegistrationForm();
        loadStudentRegistrationTable();
    });
}

// studentregistration delete karanna function eka
const deleteRegistration = (dataOb) => {
    // data object eka local variable ekakata assign karanawa
    const studentregistration = dataOb;
    // SweetAlert eke pennanna one message eka hadanawa
    const message =
        "<b>Student No :</b> " + studentregistration.student_id.regno + "<br>" +
        "<b>Batch Name :</b> " + studentregistration.batch_id.batchname;

    // common delete function eka call karanawa
    deleteWithConfirm(studentregistration, message, "/studentregistration/delete", () => {
        // success unama passe form eka reset + table reload
        loadStudentRegistrationForm();
        loadStudentRegistrationTable();

    });
}



