// html elements tika select karagannawa
let inputCollectionDate = document.querySelector("#inputCollectionDate");
let tableReceptionistCashCollection = document.querySelector("#tableCashCollection");
let tableBodyReceptionistCashCollection = document.querySelector("#tableBodyCashCollection");


// ---------------- Date validation section ----------------

// ada date eka gannawa
let today = new Date();

// YYYY-MM-DD format ekata convert karanawa
let todayDate = today.toISOString().split("T")[0];

// default widihata ada date eka set karanawa
inputCollectionDate.value = todayDate;

// future dates select karanna bari karanawa
inputCollectionDate.max = todayDate;

// last 7 days date eka calculate karanawa
let lastSevenDays = new Date();

lastSevenDays.setDate(today.getDate() - 7);

// days 7 kata wada parana dates disable karanawa
inputCollectionDate.min = lastSevenDays.toISOString().split("T")[0];

/*
 API response format eka

[
    [
        "ST2600001",
        "Kamal Perera",
        "Monthly Fee",
        "Cash",
        "2026-07-30",
        1000
    ]
]


payment[0] -> student regno
payment[1] -> student fullname
payment[2] -> payment category
payment[3] -> payment method
payment[4] -> payment date
payment[5] -> amount

*/


// student number display karanawa
const getStudentNo = (payment) => {
    return payment[0];
}

// student fullname display karanawa
const getStudentName = (payment) => {
    return payment[1];
}

// payment category display karanawa
const getPaymentCategory = (payment) => {
    return payment[2];
}

// payment method display karanawa
const getPaymentMethod = (payment) => {
    return payment[3];
}

// payment date format karala display karanawa
const getPaymentDate = (payment) => {

    let date = new Date(payment[4]);
    return date.toLocaleDateString();
}

// payment amount display karanawa
const getAmount = (payment) => {
    return Number(payment[5]).toFixed(2);
}


// daily cash collection report generate karana function eka
const generateDailyCashCollectionReport = () => {
    // date validation karanawa
    if (inputCollectionDate.value == "") {
        Swal.fire({

            title: "Missing Date",
            text: "Please select Collection Date",
            icon: "warning"

        });
        return;

    }


    // selected date eka check karanawa
    /* let selectedDate = new Date(inputCollectionDate.value);
    let minimumDate = new Date();
    minimumDate.setDate(minimumDate.getDate() - 7);


    // last 7 days walata adala nathnam stop karanawa
    if (selectedDate < minimumDate || selectedDate > today) {
        Swal.fire({
            title: "Invalid Date",
            text: "You can only view last 7 days cash collection",
            icon: "warning"
        });
        return;
    } */

    // logged user ge selected date payments gannawa

    let reportList = getDataAjaxGetRequest(
        "/rolewisecashcollection/"
        + inputCollectionDate.value

    );

    // summary calculate karanawa
    let totalTransactions = reportList.length;
    let totalCollection = 0;

    reportList.forEach(payment => {
        totalCollection += Number(payment[5]);
    });


    // old table data clear karanawa
    tableBodyReceptionistCashCollection.innerHTML = "";

    // table columns define karanawa

    let displayColumns = [
        {
            dataType: "function",
            property: getStudentNo
        },
        {
            dataType: "function",
            property: getStudentName
        },
        {
            dataType: "function",
            property: getPaymentCategory
        },
        {
            dataType: "function",
            property: getPaymentMethod
        },
        {
            dataType: "function",
            property: getPaymentDate
        },
        {
            dataType: "function",
            property: getAmount
        }
    ];
    // table ekata data load karanawa

    loadTableDataInner(tableBodyCashCollection, reportList, displayColumns);
    // datatable initialize karanawa
    $('#tableCashCollection').DataTable();

    // summary display karanawa
    document.querySelector("#totalTransactions").innerText = totalTransactions;
    document.querySelector("#totalCollection").innerText = totalCollection.toFixed(2);

}

// print report function eka
const buttonPrint = () => {
    // report data thiyenawada balnawa
    if (tableBodyCashCollection.rows.length == 0) {
        Swal.fire({
            title: "No Report Data",
            text: "Please generate report before printing",
            icon: "warning"
        });
        return;

    }
    // print window open karanawa
    let newTab = window.open();
    // print html create karanawa
    newTab.document.write(`


        <html>
        <head>
        <title>
        Jithma Institute - Daily Cash Collection Report
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
        text-align:center;
        margin-top:20px;
        font-size:12px;
        }
        </style>
        </head>
        <body>
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
        Daily Cash Collection Report
        </h3>
        </div>
        <br>
        <table>
        <tr>
        <th>
        Collection Date
        </th>
        <td>
        ${inputCollectionDate.value}
        </td>
        </tr>
        </table>
        <br>
        <table>
        <thead>
        <tr>
        <th>No</th>
        <th>Student No</th>
        <th>Student Name</th>
        <th>Payment Category</th>
        <th>Payment Method</th>
        <th>Payment Date</th>
        <th>Amount</th>
        </tr>
        </thead>
        <tbody>
        ${tableCashCollection.tBodies[0].innerHTML}
        </tbody>
        </table>
        <div class="summary">
        <table>
        <tr>
        <th>
        Total Transactions
        </th>
        <td>
        ${document.querySelector("#totalTransactions").innerText}
        </td>
        <th>
        Total Collection
        </th>
        <td>
        Rs. ${document.querySelector("#totalCollection").innerText}
        </td>
        </tr>
        </table>
        </div>
        </body>
        </html>
        `);
    // print document close karanawa
    newTab.document.close();

    // print execute karanawa
    setTimeout(() => {
        newTab.print();
        newTab.close();
    }, 500);
}

// print button event eka add karanawa

document.querySelector("#btnPrintReport").addEventListener("click", buttonPrint);