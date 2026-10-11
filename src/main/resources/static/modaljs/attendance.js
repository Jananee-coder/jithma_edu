//browser refresh event – page eka reload wenakota db eken attendance data okkoma update wenawa.
//eka nisa attendance table eka refresh wenna reusable function ekak hadala use karanawa.
//me function eka submission, update, delete awasthawal di call karanawa.
//advantage – code reusability ekak tiyenawa, code eka simple wenawa.

//browser load event
window.addEventListener("load", () => {

    // Logged-in user ta ATTENDANCE module eka sambandha permissions ganna
    userPrivilege = getDataAjaxGetRequest("/userprivilegebymodule?modulename=ATTENDANCE")

    textStuNoFilter.addEventListener("input", loadStudent);

    //call table refresh function
    loadAttendanceTable();
    //call form refresh function
    loadAttendanceForm();

});

let textStuNoFilter = document.querySelector("#textStuNoFilter");
let divStudentPhoto = document.querySelector("#divStudentPhoto");
let pCallingName = document.querySelector("#pCallingName");
let timeCheckIn = document.querySelector("#timeCheckIn");
let timeCheckOut = document.querySelector("#timeCheckOut");
let selectBatch = document.querySelector("#selectBatch");
let radioPresent = document.querySelector("#radioPresent");
let radioAbsent = document.querySelector("#radioAbsent");
let tabFormButton = document.querySelector("#tabFormButton");
let rowPaidStatus = document.querySelector("#rowPaidStatus");
let pPaidStatus = document.querySelector("#pPaidStatus");

let regbatches = [];

let attendance = new Object();

const students = getDataAjaxGetRequest("/studentforother/alldata");
// Student No input ekata adala details load karana reusable function eka
const loadStudent = () => {
    // Input field eke value trim karala gannawa
    const regno = textStuNoFilter.value.trim();

    // RegNo hariyata 9 characters naththam, photo & name hide karanawa
    if (regno.length !== 9) {
        divStudentPhoto.style.display = "none";
        attendance.student_id = null;
        return;
    }
    // Student array eke regno ekata match karala student gannawa
    const studentData = students.find(s => s.regno === regno);


    // Student hamba wenne naththam
    if (!studentData) {
        divStudentPhoto.style.display = "none";
        attendance.student_id = null;
        return;
    }
    // Student hamba unoth calling name & photo display karanawa
    pCallingName.innerText = studentData.callingname;
    if (studentData.photo != null) {
        imgPhoto.src = atob(studentData.photo);
    } else {
        // Default image
        imgPhoto.src = "images/studenticon.jpg";
    }

    // show as flex because photo + name same row
    divStudentPhoto.style.display = "flex";

    // Backend submission ekata student id set karanawa
    attendance.student_id = studentData;
    textStuNoFilter.style.border = "2px solid green";

    loadStudentBatches(studentData.id);


}

//batch name set
const getBatchName = (dataOb) => {
    return dataOb.batch_id.batchname;
}

//get student no
const getStudentNo = (dataOb) => {
    return dataOb.student_id.regno;
}

//get date
const getAttendanceDate = (dataOb) => {
    return dataOb.adddatetime.split("T")[0];
}
//get getCheckIn
const getCheckinTime = (dataOb) => {
    return dataOb.checkin.substring(0,5);
}
//0 1 2 3 4 5 6 7
//0 7 : 2 4 : 0 0


const loadAttendanceTable = () => {
    //create sample attendance array
    attendances = new Array();

    // backend eken guardian okkoma gannawa
    attendances = getDataAjaxGetRequest("/attendance/alldata");

    // Create display columns
    let displayColumns = [
        { property: getStudentNo, dataType: "function" },
        { property: getBatchName, dataType: "function" },
        { property: getAttendanceDate, dataType: "function" },
        { property: getCheckinTime, dataType: "function" },
    ];
    // Call reusable table data fill function
    loadTableData2(tableBodyAttendance, attendances, displayColumns, printAttendance, deleteAttendance);

    for (const index in attendances) {
        // Update permission naththm – update button hide karanawa
       /*  if (!userPrivilege.privi_update) {
            tableBodyAttendance.children[index].children[3].children[1].style.display = "none";
        } */
        // Delete permission naththm – delete button hide karanawa
        if (!userPrivilege.privi_delete) {
            tableBodyAttendance.children[index].children[5].children[1].style.display = "none";
        }
    }

    // Initialize DataTable (Bootstrap / jQuery)
    $("#tableAttendance").dataTable();
}

//define load attendance form
const loadAttendanceForm = () => {
    // tab eke button text set karanna
    tabFormButton.innerText = "Add Attendance";

    // form eka reset karanna (input fields wala thibuna values okkoma clear wenawa)
    formAttendance.reset();

    // aluth empty object hadanna → data binding walata use karanna
    attendance = new Object();
    // mokadda - valid value tika collect karala backend ekata pass karanna ona
    // ekka ekka pass karanawa wada object eka pass karanna lesi


    // ===== Auto-generate date =====
    /*  const currentDateTime = new Date();
     const dateOnly = currentDateTime.toISOString().split("T")[0];
     dateAttendance.value = dateOnly;
     attendance.date = dateOnly;
     dateAttendance.disabled = true; */

    // userta ta insert privilege naththam form buttons hide karanawa
    if (!userPrivilege.privi_insert) {
        tabFormButton.style.display = "none";   // "Add New" button hide
        buttonSubmit.style.display = "none";    // "Save" button hide
    }

    // buttons control karanawa
    //buttonUpdate.style.display = "none"; // update button hide
    buttonSubmit.style.display = "block"; // submit button show

    // form eke tiyena input, select, radio okkoma border colour / UI reset karanawa
    setUIColour([textStuNoFilter, timeCheckIn, selectBatch]);

    let tableTab = new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabTableArea"]'));
    tableTab.show(); // form tab hide karanna epa, table tab activate wenawa
}

// form print karanna function eka
const printAttendance = (dataOb) => {
    attendance = dataOb;
    // print details table fill karanawa (modal eka assume karanawa)
    tdStundentNo.innerText = attendance.student_id.regno;
    tdStudentName.innerText = attendance.student_id.fullname;
    tdBatchName.innerText = attendance.batch_id.batchname;
    tdDate.innerText = attendance.adddatetime.split("T")[0];
    tdCheckIn.innerText = attendance.checkin;

    $("#modalAttendancePrint").modal("show");
}
// Print button eka click karama call wenna function eka
const buttonPrint = () => {
    // Aluth tab ekak open karanawa
    const newTab = window.open();
    // Print page eka create karanawa
    newTab.document.writeln(
        "<html><head><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'><title>Print Attendance Detail</title></head>" +
        "<body>" +
        "<h2>Print Attendance Details</h2>" +
        tablePrintAttendance.outerHTML +
        "</body></html>"
    );
    // Document eka close karanawa
    newTab.document.close();

    // interval ekak set kara mili second 250 kin - print eka click karama 250ms thiyala tab eka open wenawa.
    // eeta passe print page eka close karama mulu new tab ekama close wenawa.
    setTimeout(() => {
        newTab.print();
        newTab.close();
    }, 250);
    // Bootstrap modal eka hide karanawa
    $("#modalAttendancePrint").modal("hide");
}
const editAttendance = (dataOb) => {

    // open Attendance tab
    new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabFormArea"]')).show();

    tabFormButton.innerText = "Update Attendance";

    // deep copy of selected object
    attendance = JSON.parse(JSON.stringify(dataOb));
    oldAttendance = JSON.parse(JSON.stringify(dataOb));

    // --- Load student details ---
    if (attendance.student_id) {
        // Fill student no
        textStuNoFilter.value = attendance.student_id.regno;
        textStuNoFilter.disabled = true;

        // Fill calling name
        pCallingName.innerText = attendance.student_id.callingname;

        // Fill student photo
        if (attendance.student_id.photo != null) {
            imgPhoto.src = atob(attendance.student_id.photo);
        } else {
            imgPhoto.src = "images/studenticon.jpg";
        }

        // show photo area
        divStudentPhoto.style.display = "flex";

        textStuNoFilter.style.border = "";
    } else {
        // Clear inputs & hide photo if no student
        textStuNoFilter.value = "";
        pCallingName.innerText = "";
        imgPhoto.src = "images/studenticon.jpg";

        divStudentPhoto.style.display = "none";
    }

    regbatches = getDataAjaxGetRequest(`/batch/todayclasses?studentId=${attendance.student_id.id}`);
    loadSelectOptions(selectBatch, regbatches, "Select Registered Batch..!", "batchname", attendance.batch_id.id);


    // --- Load check-in ---
    timeCheckIn.value = attendance.checkin;
    timeCheckIn.disabled = true;

    // buttons control
    buttonSubmit.style.display = "none";
    buttonUpdate.style.display = "block";
    buttonClear.style.display = "none";  // clear button hide
}
//define  function for student attendance form error check
const checkAttendanceFormError = () => {
    let errors = "";

    // Student check
    if (attendance.student_id == null) {
        errors += "Please enter a Student No. This field is required..<br>";
        textStuNoFilter.style.border = "1px solid red"; // input field red border
    }
    // Batch check
    if (attendance.batch_id == null) {
        errors += "Please select a Batch. This field is required..<br>";
        selectBatch.style.border = "1px solid red";
    }
    // Checkin area check
    if (attendance.checkin == null) {
        errors += "Please select a Check-In Time. This field is required..<br>";
        timeCheckIn.style.border = "1px solid red";
    }

    return errors; // return all errors
}

//student attendance submission function
const buttonAttendanceSubmit = () => {

    submitWithConfirm(checkAttendanceFormError, attendance, "/attendance/insert", () => {
        // success → reset form + reload table
        loadAttendanceForm();
        loadAttendanceTable();

    });
}

// define function to get changes in Attendance form
// const checkAttendanceFormUpdate = () => {
//     let updates = "";

//     // check attendance objects exist
//     if (attendance != null && oldAttendance != null) {

//         // batch name change
//         /* if (attendance.batch_id.batchname !== oldAttendance.batch_id.batchname) {
//             updates += "Batch changed: " + oldAttendance.batch_id.batchname + " --> " + attendance.batch_id.batchname + "\n";
//         } */

//         // date change
//         /*  if (attendance.date !== oldAttendance.date) {
//              updates += "Date changed: " + oldAttendance.date + " --> " + attendance.date + "\n";
//          } */

//         // check in time change
//         if (attendance.checkin !== oldAttendance.checkin) {
//             updates += "Check-In Time changed: " + oldAttendance.checkin + " --> " + attendance.checkin + "\n";
//         }

//     }

//     // return updates
//     return updates;
// }
// attendance update submission function
/* const buttonAttendanceUpdate = () => {

    // common update function call
    updateWithConfirm(checkAttendanceFormError, checkAttendanceFormUpdate, attendance, "/attendance/update", () => {

        // success unama form reset + table reload
        loadAttendanceForm();
        loadAttendanceTable();
    });
} */

//define delete function
const deleteAttendance = (dataOb) => {
    // data object eka local variable ekakata assign karanawa
    const attendance = dataOb;
    // SweetAlert eke pennanna one message eka hadanawa
    const message =

        "<b>Sudent Id :</b> " + attendance.student_id.regno + "<br>" +
        "<b>Sudent Name :</b> " + attendance.student_id.callingname + "<br>" +
        "<b>Batch :</b> " + attendance.batch_id.batchname;

    // common delete function eka call karanawa
    deleteWithConfirm(attendance, message, "/attendance/delete", () => {
        // success unama passe form eka reset + table reload
        loadAttendanceForm();
        loadAttendanceTable();

    });
}

const loadStudentBatches = (studentId) => {
    if (!studentId) return;

    regbatches = getDataAjaxGetRequest(`/batchforcardchecker/todayclasses?studentId=${studentId}`);
    // no classes today
    if (regbatches.length == 0) {
        selectBatch.innerHTML = "";
        Swal.fire({
            icon: "info",
            title: "No Class Today",
            text: "No classes scheduled for this student today.",
            confirmButtonColor: "#3085d6"
        });

        return;
    }
    // load batches
    loadSelectOptions(selectBatch, regbatches, "Select Registered Batch..!", "batchname");

}

// student payment status check karana reusable function eka
const checkPaymentStatus = () => {

    // ada month eka gannawa (format = YYYY-MM)
    const currentMonth = new Date().toISOString().slice(0, 7);

    // selected student + batch + month ekata adala payment eka backend eken gannawa
    const payment = getDataAjaxGetRequest(
        `/studentpayment/getbystudentbatchandmonth?studentid=${attendance.student_id.id}&batchid=${attendance.batch_id.id}&month=${currentMonth}`
    );



    // payment record ekak thiyanawada nadda check karanawa
    let paymentExists = payment.id != null; // payment done

    // ada dawase date eka gannawa
    const today = new Date();

    // ada mase dawasa gannawa
    const day = today.getDate();

    // ada mase keeweni week ekada kiyala calculate karanawa
    const weekNumber = Math.floor((day - 1) / 7) + 1;

    // payment thiyanawanam
    if (paymentExists) {

        // payment status row eka display karanawa
        rowPaidStatus.style.display = "flex";

        // status message eka set karanawa
        pPaidStatus.innerText = "Payment Completed";

        // status color eka green karanawa
        pPaidStatus.style.color = "green";

        // submit button eka show karanawa
        buttonSubmit.style.display = "flex";

    } else {

        // payment naththam status row eka show karanawa
        rowPaidStatus.style.display = "flex";

        // 1st week
        if (weekNumber === 1) {

            pPaidStatus.innerText = "1st Week - Student can attend class";
            pPaidStatus.style.color = "green";

            buttonSubmit.style.display = "flex";

            // 2nd week
        } else if (weekNumber === 2) {

            pPaidStatus.innerText = "Warning 1 - Payment not completed";
            pPaidStatus.style.color = "orange";

            buttonSubmit.style.display = "flex";

            // 3rd week
        } else if (weekNumber === 3) {

            pPaidStatus.innerText = "Warning 2 - Manager approval required";
            pPaidStatus.style.color = "darkorange";

            buttonSubmit.style.display = "flex";

            // 4th week or above
        } else {

            pPaidStatus.innerText = "Access Denied - Payment required";
            pPaidStatus.style.color = "red";

            // submit button eka hide karanawa
            buttonSubmit.style.display = "flex";
        }
    }

    // Auto-generate check-in time
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const timeString = `${hours}:${minutes}`;  // HH:MM format

    timeCheckIn.value = timeString;       // update input field
    attendance.checkin = timeString;      // bind to attendance object
    timeCheckIn.style.border = "2px solid green";
}
