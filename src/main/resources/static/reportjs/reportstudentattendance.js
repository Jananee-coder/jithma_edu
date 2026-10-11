// initialize select2 dropdown
$('.js-example-basic-single').select2({
    theme: "bootstrap-5",
    width: "100%"
});


// get html elements
let selectStudent = document.querySelector("#selectStudent");
let selectBatch = document.querySelector("#selectBatch");

let fromDate = document.querySelector("#fromDate");
let toDate = document.querySelector("#toDate");

let tableStudentAttendance = document.querySelector("#tableStudentAttendance");
let tableBodyStudentAttendance = document.querySelector("#tableBodyStudentAttendance");


// prevent future date selection
let today = new Date().toISOString().split("T")[0];

fromDate.max = today;
toDate.max = today;

// load all students
let students = getDataAjaxGetRequest("/studentforother/alldata");

// load students to dropdown
loadSelectOptions(selectStudent, students, "Select Student..!", "regno");


// student select change event
// selected student ta adala registered batches load karanawa
$('#selectStudent').on('change', function () {

    // selected student object eka gannawa
    let student = JSON.parse($(this).val());

    // selected student ta adala batches database eken gannawa
    let batches = getDataAjaxGetRequest(
        "/batch/registeredbatches?studentId=" + student.id
    );

    // batch dropdown ekata load karanawa
    loadSelectOptions(selectBatch, batches, "Select Batch..!", "batchname");

});


// attendance date display function
const getAttendanceDate = (attendance) => {

    // datetime eken date eka witharak gannawa
    return attendance.adddatetime.split("T")[0];

}

// attendance status display function
const getAttendanceStatus = (attendance) => {

    // status eka check karanawa
    if (attendance.attendancestatus == 1) {
        // Present green color walin display karanawa
        return "<span class='present-status'>Present</span>";

    } else {
        // Absent red color walin display karanawa
        return "<span class='absent-status'>Absent</span>";
    }
}

// generate student attendance report function
const generateStudentAttendanceReport = () => {

    // required field validation
    if (selectStudent.value == "" || selectBatch.value == "" || fromDate.value == "" || toDate.value == "") {
        Swal.fire({
            title: "Missing Details",
            text: "Please select Student, Batch and Date Range",
            icon: "warning"
        });
        return;
    }
    // check date range
    if (fromDate.value > toDate.value) {

        Swal.fire({
            title: "Invalid Date Range",
            text: "From Date cannot be greater than To Date",
            icon: "warning"
        });

        return;
    }

    // selected student object eka gannawa
    let student = JSON.parse(selectStudent.value);

    // selected batch object eka gannawa
    let batch = JSON.parse(selectBatch.value);

    // attendance data database eken gannawa
    currentAttendanceList = getDataAjaxGetRequest("/report/studentattendancereport/" + student.id + "/" + batch.id + "/" + fromDate.value + "/" + toDate.value);

    // old table data clear karanawa
    tableBodyStudentAttendance.innerHTML = "";

    // table columns define karanawa
    let displayColumns = [
        { dataType: "function", property: getAttendanceDate },
        { dataType: "function", property: getAttendanceStatus }
    ];

    // table ekata attendance data load karanawa
    loadTableDataInner(tableBodyStudentAttendance, currentAttendanceList, displayColumns);

    // datatable activate karanawa
    $('#tableStudentAttendance').DataTable();

    // summary calculate karanawa
    let total = currentAttendanceList.length;

    let present = currentAttendanceList.filter(attendance => attendance.attendancestatus == 1).length;

    let absent = total - present;

    let percentage = 0;

    if (total > 0) {
        percentage = ((present / total) * 100).toFixed(2);
    }


    // summary display karanawa
    document.querySelector("#totalClasses").innerText = total;
    document.querySelector("#presentCount").innerText = present;
    document.querySelector("#absentCount").innerText = absent;
    document.querySelector("#attendancePercentage").innerText = percentage + "%";
}

// print attendance report function
const buttonPrint = () => {

    // print karanna kalin validation check karanawa
    if (selectStudent.value == "" || selectBatch.value == "" || tableBodyStudentAttendance.rows.length == 0
    ) {
        Swal.fire({
            title: "No Report Data",
            text: "Please generate attendance report before printing",
            icon: "warning"
        });
        return;
    }

    // selected student saha batch objects gannawa
    let student = JSON.parse(selectStudent.value);

    let batch = JSON.parse(selectBatch.value);

    let total = currentAttendanceList.length;

    let present = currentAttendanceList.filter(
        attendance => attendance.attendancestatus == 1
    ).length;

    // absent count calculate karanawa
    let absent = total - present;

    // attendance percentage calculate karanawa
    let percentage = 0;

    if (total > 0) {
        percentage = ((present / total) * 100).toFixed(2);
    }

    // new print window open karanawa
    let newTab = window.open();

    newTab.document.write(`

        <html>
        <head>
        <title>
        Jithma Institute - Attendance Report
        </title>

        <style>
        body{
            font-family:"Times New Roman";
            padding:15px;
        }
        .header{
            text-align:center;
            line-height:1.2;
        }
        .logo{
            width:70px;
            height:70px;
            object-fit:contain;
        }
        .header h2{
            margin:2px 0;
            font-size:22px;
        }
        .header p{
            margin:1px 0;
            font-size:14px;
        }
        .header h3{
            margin:5px 0;
        }
        hr{
            margin:5px 0;
        }
        .info{
            margin:10px 0;
        }
        table{
            width:100%;
            border-collapse:collapse;
        }
        th,td{
            border:1px solid black;
            padding:5px;
            text-align:center;
            font-size:14px;
        }
        th{
            background:#eeeeee;
        }
        .present-status{
            color:green;
            font-weight:bold;
        }
        .absent-status{
            color:red;
            font-weight:bold;
        }
        .summary{
            margin-top:10px;
        }
        .footer{
            margin-top:15px;
            text-align:center;
            font-size:12px;
        }
        </style>
        </head>
        <body>

        <!-- institute header -->
        <div class="header">
        <img src="images/jlogo.jpg" class="logo">
        <h2>Jithma Institute</h2>
        <p> 402/C/1,Dagonna, Negombo </p>
        <p>Student Management System</p>
        <hr>
        <h3>Student Attendance Report</h3>
        </div>
        <!-- student filter details -->
        <br>
        <br>
        <div class="info">
        <table>
        <tr>
        <th>Student</th>
        <td>${student.regno}</td>
        <th>Batch</th>
        <td>${batch.batchname}</td>
        </tr>
        <tr>
        <th>From Date</th>
        <td>${fromDate.value}</td>
        <th>To Date</th>
        <td>${toDate.value}</td>
        </tr>
        </table>
        </div>

        <!-- attendance details -->
        <table>
        ${tableStudentAttendance.innerHTML}
        </table>

        <!-- summary -->
        <div class="summary">
        <table>
        <tr>

        <th>Total Classes</th>
        <td>${total}</td>
        <th>Present</th>
        <td class="present-status">${present}</td>
        <th>Absent</th>
        <td class="absent-status">${absent}</td>
        <th>Attendance %</th>
        <td>${percentage}%</td>

        </tr>
        </table>
        </div>

        </body>
        </html>

        `);


    // document close karanawa
    newTab.document.close();

    // print dialog open karanawa
    setTimeout(() => {
        newTab.print();
        newTab.close();
    }, 500);

}
// print button click event
document.querySelector("#btnPrintReport").addEventListener("click", buttonPrint);