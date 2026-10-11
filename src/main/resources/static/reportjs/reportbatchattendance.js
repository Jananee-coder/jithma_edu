// initialize select2 dropdown
$('.js-example-basic-single').select2({
    theme: "bootstrap-5",
    width: "100%"
});


// get html elements
let selectTeacher = document.querySelector("#selectTeacher");
let selectBatch = document.querySelector("#selectBatch");
let selectAttendanceDate = document.querySelector("#selectAttendanceDate");

let tablePresentStudent = document.querySelector("#tablePresentStudent");
let tableBodyPresentStudent = document.querySelector("#tableBodyPresentStudent");


// load all teachers
let teachers = getDataAjaxGetRequest("/teacherforother/alldata");

// load teachers to dropdown
loadSelectOptions(selectTeacher, teachers, "Select Teacher..!", "fullname");


// teacher select change event
// selected teacher ta adala batches load karanawa
$('#selectTeacher').on('change', function () {

    // selected teacher object eka gannawa
    let teacher = JSON.parse($(this).val());

    // selected teacher ta adala batches database eken gannawa
    let batches = getDataAjaxGetRequest(
        "/batch/byteacher/" + teacher.id
    );

    // batch dropdown ekata load karanawa
    loadSelectOptions(selectBatch, batches, "Select Batch..!", "batchname");

});


// batch select change event
// selected batch ta adala attendance dates load karanawa
$('#selectBatch').on('change', function () {

    // selected batch object eka gannawa
    let batch = JSON.parse($(this).val());

    // attendance dates database eken gannawa
    let dates = getDataAjaxGetRequest(
        "/attendance/datesbybatch/" + batch.id
    );

    // date dropdown clear karanawa
    selectAttendanceDate.innerHTML = "<option value='' selected disabled>Select Date..!</option>";

    // dates dropdown ekata load karanawa
    dates.forEach(date => {

        let option = document.createElement("option");

        option.value = date;
        option.text = date;

        selectAttendanceDate.appendChild(option);

    });

});

// getStudentId display function
const getStudentId = (attendance) => {

    return attendance.student_id.regno;

}
// getStudentName display function
const getStudentName = (attendance) => {

    return attendance.student_id.fullname;

}


// generate batch attendance report function
const generateBatchAttendanceReport = () => {

    // validation check karanawa
    if (selectTeacher.value == "" ||
        selectBatch.value == "" ||
        selectAttendanceDate.value == "") {

        Swal.fire({
            title: "Missing Details",
            text: "Please select Teacher, Batch and Date",
            icon: "warning"
        });

        return;
    }


    // selected batch object eka gannawa
    let batch = JSON.parse(selectBatch.value);


    // attendance data database eken gannawa
    let attendanceList = getDataAjaxGetRequest(
        "/report/batchattendancereport/" +
        batch.id +
        "/" +
        selectAttendanceDate.value
    );


    // old table data clear karanawa
    tableBodyPresentStudent.innerHTML = "";


    // present students witharak filter karanawa
    let presentStudents = attendanceList.filter(
        attendance => attendance.attendancestatus == 1
    );

    // table columns define karanawa
    let displayColumns = [
        { dataType: "function", property: getStudentId},
        { dataType: "function", property: getStudentName }
    ];

    // table ekata data load karanawa
    loadTableDataInner(tableBodyPresentStudent,presentStudents,displayColumns);


    // datatable activate
    $('#tablePresentStudent').DataTable();

    // summary calculate karanawa
    let total = attendanceList.length;

    let present = presentStudents.length;

    let absent = total - present;

    // display summary
    document.querySelector("#totalStudents").innerText = total;

    document.querySelector("#presentCount").innerText = present;

    document.querySelector("#absentCount").innerText = absent;


};


// print report function
const buttonPrint = () => {
    // validation
    if (selectBatch.value == "" ||
        tableBodyPresentStudent.rows.length == 0) {

        Swal.fire({
            title: "No Report Data",
            text: "Please generate attendance report before printing",
            icon: "warning"
        });

        return;

    }

    // selected objects
    let teacher = JSON.parse(selectTeacher.value);
    let batch = JSON.parse(selectBatch.value);

    // new print window
    let newTab = window.open();
    newTab.document.write(`

        <html>

        <head>

        <title>
        Jithma Institute - Batch Attendance Report
        </title>


        <style>

        body{
        font-family:"Times New Roman";
        padding:15px;
        }

        .header{
        text-align:center;
        }

        .logo{
        width:70px;
        height:70px;
        object-fit:contain;
        }

        table{
        width:100%;
        border-collapse:collapse;
        }

        th,td{

        border:1px solid black;
        padding:5px;
        text-align:center;

        }

        th{
        background:#eeeeee;
        }

        .summary{
        margin-top:15px;
        }

        </style>

        </head>


        <body>


        <div class="header">

        <img src="images/jlogo.jpg" class="logo">

        <h2>Jithma Institute</h2>

        <p>402/C/1,Dagonna, Negombo</p>

        <h3>Batch Attendance Report</h3>

        <hr>

        </div>



        <table>

        <tr>

        <th>Teacher</th>

        <td>
        ${teacher.fullname}
        </td>


        <th>Batch</th>

        <td>
        ${batch.batchname}
        </td>


        </tr>


        <tr>

        <th>Date</th>

        <td colspan="3">
        ${selectAttendanceDate.value}
        </td>


        </tr>


        </table>



        <br>



        <table>

        ${tablePresentStudent.innerHTML}

        </table>



        <div class="summary">

        <table>

        <tr>

        <th>Total Students</th>

        <td>
        ${document.querySelector("#totalStudents").innerText}
        </td>


        <th>Present</th>

        <td>
        ${document.querySelector("#presentCount").innerText}
        </td>


        <th>Absent</th>

        <td>
        ${document.querySelector("#absentCount").innerText}
        </td>


        </tr>

        </table>


        </div>



        </body>

        </html>

        `);



    newTab.document.close();



    setTimeout(() => {

        newTab.print();

        newTab.close();

    }, 500);



};



// print button click event
document.querySelector("#btnPrintReport")
    .addEventListener("click", buttonPrint);