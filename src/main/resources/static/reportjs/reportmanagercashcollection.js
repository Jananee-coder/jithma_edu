// html elements tika select karagannawa
let inputFromDate = document.querySelector("#inputFromDate");
let inputToDate = document.querySelector("#inputToDate");

let tableManagerCashCollection = document.querySelector("#tableManagerCashCollection");
let tableBodyManagerCashCollection = document.querySelector("#tableBodyManagerCashCollection");

/* 
  [
    "manager",
    "2026-07-30",
    2,
    1500
  ] */

/* payment[0] → username
payment[1] → date
payment[2] → transaction count
payment[3] → total amount */

// collected user name display karanawa
const getCollectedBy = (payment) => {
    return payment[0];
}
// transaction count display karanawa
/* const getTransactionCount = (payment) => {
    return payment[2];
} */

// payment amount display karanawa
const getAmount = (payment) => {
    return Number(payment[3]).toFixed(2);
}
// payment date display karanawa
const getPaymentDate = (payment) => {
    let date = new Date(payment[1]);
    return date.toLocaleDateString();
}

// ada date eka gannawa
let today = new Date();


// today date eka YYYY-MM-DD format ekata convert karanawa
let todayDate =
    today.getFullYear()
    + "-"
    + String(today.getMonth() + 1).padStart(2, "0")
    + "-"
    + String(today.getDate()).padStart(2, "0");


// ada date eke idan masa 1k passe date eka gannawa
// meken user ta balanna puluwan minimum date eka set karanawa
let oneMonthAgo = new Date();

oneMonthAgo.setMonth(today.getMonth() - 1);


// minimum date eka YYYY-MM-DD format ekata convert karanawa
let minimumDate =
    oneMonthAgo.getFullYear()
    + "-"
    + String(oneMonthAgo.getMonth() + 1).padStart(2, "0")
    + "-"
    + String(oneMonthAgo.getDate()).padStart(2, "0");


// From Date field ekata date range limit karanawa
// masa 1kata wada parana dates disable karanawa
// future dates select karanna bari karanawa
inputFromDate.min = minimumDate;
inputFromDate.max = todayDate;


// To Date field ekatath same date range limit karanawa
// masa 1kata wada parana saha anagatha dates disable karanawa
inputToDate.min = minimumDate;
inputToDate.max = todayDate;


// report open weddi default widihata ada date eka set karanawa
inputFromDate.value = todayDate;
inputToDate.value = todayDate;

// report generate karana function eka
const generateManagerCashCollectionReport = () => {
    // required fields check karanawa
    if (inputFromDate.value == "" || inputToDate.value == "") {
        Swal.fire({
            title: "Missing Details",
            text: "Please select From Date and To Date",
            icon: "warning"

        });
        return;

    }
    // selected dates validate karanawa
    let fromDate = new Date(inputFromDate.value);
    let toDate = new Date(inputToDate.value);


    // From Date eka To Date ekata wada wadi nam stop karanawa
    if (fromDate > toDate) {

        Swal.fire({
            title: "Invalid Date Range",
            text: "From Date cannot be greater than To Date",
            icon: "warning"

        });
        return;

    }

    // get manager cash collection report data by selected date range
    let reportList = getDataAjaxGetRequest(

        "/managercashcollection/"
        + inputFromDate.value
        + "/"
        + inputToDate.value

    );

    // summary values calculate karanawa
    let totalTransactions = 0;
    let totalCollection = 0;


    reportList.forEach(payment => {

        // transaction count eka add karanawa
        totalTransactions += Number(payment[2]);

        // total collection eka add karanawa
        totalCollection += Number(payment[3]);

    });

    // kalin table data clear karanawa
    tableBodyManagerCashCollection.innerHTML = "";

    // table columns define karanawa

    let displayColumns = [
        // collected by column
        {
            dataType: "function",
            property: getCollectedBy
        },
        // amount column
        {
            dataType: "function",
            property: getAmount
        },
        // payment date column
        {
            dataType: "function",
            property: getPaymentDate
        }
    ];


    // table ekata data load karanawa

    loadTableDataInner(tableBodyManagerCashCollection, reportList, displayColumns);

    // datatable initialize karanawa

    $('#tableManagerCashCollection').DataTable();

    // summary values display karanawa
    document.querySelector("#totalTransactions").innerText = totalTransactions;
    document.querySelector("#totalCollection").innerText = totalCollection.toFixed(2);

}




// report print karana function eka

const buttonPrint = () => {

    // report data thiyenawada check karanawa
    if (tableBodyManagerCashCollection.rows.length == 0) {
        Swal.fire({
            title: "No Report Data",
            text: "Please generate report before printing",
            icon: "warning"
        });
        return;
    }

    // print karanna aluth window ekak open karanawa
    let newTab = window.open();

    // print page HTML create karanawa

    newTab.document.write(`

        <html>

        <head>
        <title>
        Jithma Institute - Manager Cash Collection Report
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
        margin:2px;
        font-size:22px;
        }
        .header p{
        margin:2px;
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
        margin-top:20px;
        text-align:center;
        font-size:12px;
        }
        </style>
        </head>
        <body>
        <!-- institute header section -->
        <div class="header">
        <img src="images/jlogo.jpg" class="logo">
        <h2>
        Jithma Institute
        </h2>
        <p>
        402/C/1,Dagonna, Negombo
        </p>
        <p>
        Student Management System
        </p>
        <hr>
        <h3>
        Manager Cash Collection Report
        </h3>
        </div>
        <br>
        <!-- report date details -->
        <table>
        <tr>
        <th>
        From Date
        </th>
        <td>${inputFromDate.value}</td>
        <th>To Date</th>
        <td>${inputToDate.value}</td>
        </tr>
        </tab
        <br>
        <!-- report table -->
        <table>
        <thead>
        <tr>
        <th>No</th>
        <th>Collected By</th>
        <th>Amount</th>
        <th>Payment Date</th>
        </tr>
        </thead>
        <tbody>
        ${tableManagerCashCollection.tBodies[0].innerHTML}
        </tbody>
        </table>
        <!-- summary section -->
        <div class="summary">
        <table>
        <tr>
        <th>Total Transactions</th>
        <td>${document.querySelector("#totalTransactions").innerText}</td>
        <th>Total Collection</th>
        <td>Rs. ${document.querySelector("#totalCollection").innerText}</td>
        </tr>
        </table>
        </div>
        </body>
        </html>
        `);

    // print document close karanawa
    newTab.document.close();

    // print window open karanawa
    setTimeout(() => {
        newTab.print();
        newTab.close();
    }, 500);
}

// print button click event eka add karanawa
document.querySelector("#btnPrintReport").addEventListener("click", buttonPrint);