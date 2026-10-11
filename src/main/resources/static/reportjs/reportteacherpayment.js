// select2 dropdown eka initialize karanawa
$('.js-example-basic-single').select2({
    theme: "bootstrap-5",
    width: "100%"
});


// HTML elements tika select karagannawa
let selectTeacher = document.querySelector("#selectTeacher");
let inputStartDate = document.querySelector("#inputStartDate");
let inputEndDate = document.querySelector("#inputEndDate");
let selectReportType = document.querySelector("#selectReportType");

let tableTeacherPaymentReport = document.querySelector("#tableTeacherPaymentReport");
let tableBodyTeacherPaymentReport = document.querySelector("#tableBodyTeacherPaymentReport");


// Database eken teacher la okkoma gannawa
let teachers = getDataAjaxGetRequest("/teacher/alldata");

// Teacher dropdown ekata data load karanawa
loadSelectOptions(selectTeacher, teachers, "Select Teacher..!", "fullname");


// Form values clear karanawa
inputStartDate.value = "";
inputEndDate.value = "";
selectReportType.value = "";


// Teacher income report eka generate karana function eka
const generateTeacherPaymentReport = () => {


    // Required fields check karanawa
    if (
        selectTeacher.value == "" ||
        selectReportType.value == "" ||
        inputStartDate.value == ""
    ) {


        // Details adu nam warning message ekak pennanawa
        Swal.fire({
            title: "Missing Details",
            text: "Please select Teacher, Date and Report Type",
            icon: "warning"
        });

        return;
    }



    // Ada date eka gannawa
    let today = new Date();

    // Time eka remove karanawa
    today.setHours(0, 0, 0, 0);



    // User select karapu dates Date object walata convert karanawa
    let startDate = new Date(inputStartDate.value);

    let endDate = new Date(inputEndDate.value);



    // Future date ekak select karalada balanawa
    if (startDate > today) {


        Swal.fire({
            title: "Invalid Date",
            text: "Start Date cannot be a future date",
            icon: "warning"
        });


        // Start date clear karanawa
        inputStartDate.value = "";

        return;
    }




    // End date eka thiyenawanam validation karanawa
    if (inputEndDate.value != "") {



        // Future end date check karanawa
        if (endDate > today) {


            Swal.fire({
                title: "Invalid Date",
                text: "End Date cannot be a future date",
                icon: "warning"
            });


            inputEndDate.value = "";

            return;

        }




        // End date eka start date walata passe da balanawa
        if (endDate < startDate) {


            Swal.fire({
                title: "Invalid Date",
                text: "End Date must be after Start Date",
                icon: "warning"
            });


            inputEndDate.value = "";

            return;

        }

    }




    // Select karapu teacher object eka gannawa
    let teacher = JSON.parse(selectTeacher.value);



    // Report type eka gannawa
    let type = selectReportType.value;



    // Start date saha end date gannawa
    let sdate = inputStartDate.value;
    let edate = inputEndDate.value;




    // Daily report ekata eka date ekak witharai one
    if (type == "Daily") {

        sdate = inputStartDate.value;
        edate = inputStartDate.value;

    }




    // Weekly report ekata start date saha end date dekama one
    else if (type == "Weekly") {

        sdate = inputStartDate.value;
        edate = inputEndDate.value;

    }




    // Monthly report ekata year-month format ekata convert karanawa
    else if (type == "Monthly") {

        sdate = inputStartDate.value.substring(0, 7);
        edate = sdate;

    }




    // Annual report ekata year eka witharak gannawa
    else if (type == "Annual") {

        sdate = inputStartDate.value.substring(0, 4);
        edate = sdate;

    }




    // Backend API call karala report data gannawa
    let incomeList = getDataAjaxGetRequest(

        "/report/teacherincome?teacherid="
        + teacher.id
        + "&sdate=" + sdate
        + "&edate=" + edate
        + "&type=" + type

    );



    // Kalin table data clear karanawa
    tableBodyTeacherPaymentReport.innerHTML = "";




    // Table columns define karanawa
    let displayColumns = [


        {
            dataType: "string",
            property: "0"
        },


        {
            dataType: "string",
            property: "1"
        },


        {
            dataType: "string",
            property: "2"
        },


        {
            dataType: "string",
            property: "3"
        },


        {
            dataType: "string",
            property: "4"
        }


    ];




    // Report data table ekata load karanawa
    loadTableDataInner(
        tableBodyTeacherPaymentReport,
        incomeList,
        displayColumns
    );

};




// Report type change event eka
selectReportType.addEventListener("change", () => {


    // Select karapu report type eka gannawa
    let type = selectReportType.value;



    // Daily report ekata date input ekak pennanawa
    if (type == "Daily") {

        inputStartDate.type = "date";
        inputEndDate.type = "date";

    }



    // Weekly report ekata date range ekak pennanawa
    else if (type == "Weekly") {

        inputStartDate.type = "date";
        inputEndDate.type = "date";

    }



    // Monthly report ekata month select karanna puluwan widihata change karanna puluwan
    else if (type == "Monthly") {

        inputStartDate.type = "date";
        inputEndDate.type = "date";

    }



    // Annual report ekata year eka select karanna puluwan
    else if (type == "Annual") {

        inputStartDate.type = "date";
        inputEndDate.type = "date";

    }


});




// print teacher income report
const buttonPrint = () => {


    // report data check karanawa
    if (tableBodyTeacherPaymentReport.rows.length == 0) {

        Swal.fire({
            title: "No Report Data",
            text: "Please generate report before printing",
            icon: "warning"
        });

        return;

    }



    // selected teacher object eka gannawa
    let teacher = JSON.parse(selectTeacher.value);



    // new print window open karanawa
    let newTab = window.open();



    newTab.document.write(`

    <html>

    <head>

    <title>
        Jithma Institute - Teacher Income Report
    </title>


    <style>

    body{
        font-family:"Times New Roman";
        padding:20px;
    }


    .header{
        text-align:center;
    }


    .logo{
        width:80px;
        height:80px;
    }


    table{
        width:100%;
        border-collapse:collapse;
    }


    th,td{
        border:1px solid black;
        padding:6px;
        text-align:center;
    }


    th{
        background:#eeeeee;
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
            Negombo, Sri Lanka
        </p>


        <h3>
            Teacher Payment / Income Report
        </h3>

        <hr>

    </div>



    <table>


        <tr>

            <th>
                Teacher
            </th>

            <td>
                ${teacher.fullname}
            </td>


            <th>
                Report Type
            </th>

            <td>
                ${selectReportType.value}
            </td>

        </tr>


        <tr>

            <th>
                Date
            </th>

            <td colspan="3">
                ${inputStartDate.value}
            </td>

        </tr>


    </table>


    <br>


    <table>

        ${tableTeacherPaymentReport.innerHTML}

    </table>



    </body>

    </html>


    `);



    newTab.document.close();



    setTimeout(() => {

        newTab.print();

        newTab.close();

    }, 500);


};




// print button event
document.querySelector("#btnPrintReport")
    .addEventListener("click", buttonPrint);

