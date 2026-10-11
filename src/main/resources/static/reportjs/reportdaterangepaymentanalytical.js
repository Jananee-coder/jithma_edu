// initialize select2 dropdown
$('.js-example-basic-single').select2({
    theme: "bootstrap-5",
    width: "100%"
});


// get html elements
let selectTeacher = document.querySelector("#selectTeacher");
let fromDate = document.querySelector("#fromDate");
let toDate = document.querySelector("#toDate");

let tableDateRangeAnalytical = document.querySelector("#tableDateRangeAnalytical");
let tableBodyDateRangeAnalytical = document.querySelector("#tableBodyDateRangeAnalytical");


// get today date
let today = new Date().toISOString().split("T")[0];

// prevent future date selection
fromDate.max = today;
toDate.max = today;

// load all teachers
let teachers = getDataAjaxGetRequest("/teacher/alldata");
// load teachers to dropdown
loadSelectOptions(selectTeacher, teachers, "Select Teacher..!", "fullname");

// display batch name
const getBatchName = (payment) => {
    return payment.batchname;
}

// display total batch income
const getBatchIncome = (payment) => {
    return payment.income.toFixed(2);
}

// display institute payment
const getInstitutePayment = (payment) => {
    return payment.institutePayment.toFixed(2);
}

// display teacher payment
const getTeacherPayment = (payment) => {
    return payment.teacherPayment.toFixed(2);
}

// generate date range analytical report function
const generateDateRangeAnalyticalReport = () => {

    // required field validation
    if (selectTeacher.value == "" || fromDate.value == "" || toDate.value == "") {

        Swal.fire({
            title: "Missing Details",
            text: "Please select Teacher and Date Range",
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

    // selected teacher object
    let teacher = JSON.parse(selectTeacher.value);


    // get batches related to teacher
    let batchList = getDataAjaxGetRequest(
        "/batch/byteacher/" + teacher.id
    );

    // report array
    let reportList = [];

    // summary variables
    let totalBatchIncome = 0;
    let totalInstitutePayment = 0;
    let totalTeacherPayment = 0;

    // batch wise calculation
    batchList.forEach(batch => {


        // get batch income by date range
        let income = Number(getDataAjaxGetRequest(
            "/report/batchdaterangeincome/"
            + batch.id + "/"
            + fromDate.value + "/"
            + toDate.value
        ));

        // get payment count by date range
        let paymentCount = Number(getDataAjaxGetRequest(
            "/report/batchdaterangepaymentcount/"
            + batch.id + "/"
            + fromDate.value + "/"
            + toDate.value
        ));

        // calculate institute payment
        let institutePayment = Number(batch.servicecharge) * paymentCount;

        // calculate teacher payment
        let teacherPayment = income - institutePayment;


        // push report data
        reportList.push({
            batchname: batch.batchname,
            income: income,
            institutePayment: institutePayment,
            teacherPayment: teacherPayment
        });

        // summary calculation
        totalBatchIncome += income;
        totalInstitutePayment += institutePayment;
        totalTeacherPayment += teacherPayment;
    });

    // old table data clear
    tableBodyDateRangeAnalytical.innerHTML = "";


    // table columns define
    let displayColumns = [

        { dataType: "function", property: getBatchName },
        { dataType: "function", property: getBatchIncome },
        { dataType: "function", property: getInstitutePayment },
        { dataType: "function", property: getTeacherPayment }
    ];

    // load table data
    loadTableDataInner(tableBodyDateRangeAnalytical, reportList, displayColumns);

    // datatable activate
    $('#tableDateRangeAnalytical').DataTable();

    // summary display
    document.querySelector("#totalBatchIncome").innerText = totalBatchIncome.toFixed(2);
    document.querySelector("#totalInstitutePayment").innerText = totalInstitutePayment.toFixed(2);
    document.querySelector("#totalTeacherPayment").innerText = totalTeacherPayment.toFixed(2);
}



// print daily analytical report function
const buttonPrint = () => {
    // validation
    if (selectTeacher.value == "" || tableBodyDateRangeAnalytical.rows.length == 0) {

        Swal.fire({
            title: "No Report Data",
            text: "Please generate payment report before printing",
            icon: "warning"
        });

        return;

    }
    // selected teacher object
    let teacher = JSON.parse(selectTeacher.value);
    // open print window
    let newTab = window.open();
    newTab.document.write(`


        <html>
        <head>
        <title>
        Jithma Institute - Date Range Payment Report
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

        table{
        width:100%;
        border-collapse:collapse;
        }
        th,td{
        border:1px solid black;
        padding:6px;
        text-align:center;
        font-size:14px;
        }
        th{
        background:#eeeeee;
        }

        .summary{
        margin-top:15px;
        }

        .footer{
        margin-top:15px;
        text-align:center;
        font-size:12px;
        }

        </style>
        </head>
        <body>
        <div class="header">
        <img src="images/jlogo.jpg" class="logo">
        <h2>Jithma Institute</h2>
        <p> 402/C/1,Dagonna, Negombo </p>
        <p>Student Management System</p>
        <hr>

        <h3>Date Range Payment Analytical Report - Teacher</h3>
        </div>
        <br>
        <table>
        <tr>
        <th>Teacher</th>
        <td>${teacher.fullname}</td>
        <th>From Date</th>
        <td>${fromDate.value}</td>
        <th>To Date</th>
        <td>${toDate.value}</td>
        </tr>

        </table>
        <br>
        <table>

        <tbody>
        ${tableDateRangeAnalytical.innerHTML}
        </tbody>
        </table>
        <div class="summary">
        <table>
        <tr>
        <th>Total Batch Income</th>
        <td>${document.querySelector("#totalBatchIncome").innerText}</td>
        <th>Total Institute Payment</th>
        <td>${document.querySelector("#totalInstitutePayment").innerText}</td>
        <th>Total Teacher Payment</th>
        <td>${document.querySelector("#totalTeacherPayment").innerText}</td>
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



}

// print button click event
document.querySelector("#btnPrintReport").addEventListener("click", buttonPrint);