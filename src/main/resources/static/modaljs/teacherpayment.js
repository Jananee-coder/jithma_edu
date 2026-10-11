//browser refresh event – page eka reload wenakota db eken teacher payment data okkoma update wenawa.
//eka nisa teacher payment table eka refresh wenna reusable function ekak hadala use karanawa.
//me function eka submission, update, delete awasthawal di call karanawa.
//advantage – code reusability ekak tiyenawa, code eka simple wenawa.

//browser load event
window.addEventListener("load", () => {

    // Logged-in user ta TEACHER PAYMENT module eka sambandha permissions ganna
    userPrivilege = getDataAjaxGetRequest("/userprivilegebymodule?modulename=TEACHERPAYMENT")

    //call table refresh function
    loadTeacherPaymentTable();
    //call form refresh function
    loadTeacherPaymentForm();
});

let selectTeacher = document.querySelector("#selectTeacher");
let selectEnrollmentMonth = document.querySelector("#selectEnrollmentMonth");
let tabFormButton = document.querySelector("#tabFormButton");
let totalBatchIncome = document.querySelector("#totalBatchIncome");
let totalServiceCharge = document.querySelector("#totalServiceCharge");
let totalAdditionalCharges = document.querySelector("#totalAdditionalCharges");
let netAmount = document.querySelector("#netAmount");
//let taxAmount = document.querySelector("#taxAmount");
let enrollmentAmount = document.querySelector("#enrollmentAmount");
let selectPaymentType = document.querySelector("#selectPaymentType");
//let textBalanceAmount = document.querySelector("#textBalanceAmount");
let textPaymentAmount = document.querySelector("#textPaymentAmount");
let textReferenceNo = document.querySelector("#textReferenceNo");


//define getTeacherName  function
const getTeacherName = (dataOb) => {
    return dataOb.teacher_id.fullname;
}
//define getEnrollmentMonth  function
const getEnrollmentMonth = (dataOb) => {
    return dataOb.enrollment_id.enrollmentmonth;
}
//define getTeacherPayMethod  function
const getTeacherPayMethod = (dataOb) => {
    return dataOb.teacherpaymethod_id.name;
}
// define techer payment status Function
const getTeacherPayStatus = (dataOb) => {
    const techerpaystatus = dataOb.teacherpaystatus_id.name;

    if (techerpaystatus === "Completed") {
        return `<span style="color: green; font-weight: bold;">${techerpaystatus}</span>`;
    }
    if (techerpaystatus === "Pending") {
        return `<span style="color: orange; font-weight: bold;">${techerpaystatus}</span>`;
    }
    // Unknown techerpayment status
    return `<span>${techerpaystatus}</span>`;
}

// teacher payment table refresh function
const loadTeacherPaymentTable = () => {
    //create sample  teacher payment array
    teacherpayments = new Array();

    // backend eken teacherpayments okkoma gannawa
    teacherpayments = getDataAjaxGetRequest("/teacherpayment/alldata");

    //string-string, numbers, date
    //function-object, array, boolean, image
    //create property array
    let displayColumns = [
        { property: getTeacherName, dataType: "function" },
        { property: getEnrollmentMonth, dataType: "function" },
        { property: "enrollmentamount", dataType: "string" },
        { property: getTeacherPayMethod, dataType: "function" },
        { property: getTeacherPayStatus, dataType: "function" }
    ];

    // Call reusable table data fill function
    loadTableData1(tableBodyTeacherPayment, teacherpayments, displayColumns, printTeacherPayment);

    // Initialize DataTable
    $('#tableTeacherPayment').dataTable();
};

//define loadTeacherPaymentForm function
const loadTeacherPaymentForm = () => {
    //change tab button name
    tabFormButton.innerText = "Add Teacher Payments";

    // form eka reset karanawa (input walata dapu values okkoma clear wenawa)
    formTeacherPayment.reset();

    // empty object ekak hadanawa → data binding walata use wenna
    teacherpayment = new Object();
    // why -Vaild value tika collect krala backend ekata pass krnna ona.
    // one by one pass krnawata wada object eka pass krna eka lesi.


    // DB eken okkoma teacher ganna -> dropdown ekata load karanna
    let teachers = getDataAjaxGetRequest("/teacher/alldata");
    loadSelectOptions(selectTeacher, teachers, "Select Teacher...!", "fullname");

    // DB eken okkoma teacherpaymethod ganna -> dropdown ekata load karanna
    let teacherpaymethods = getDataAjaxGetRequest("/teacherpaymethod/alldata");
    loadSelectOptions(selectPaymentType, teacherpaymethods, "Select Teacher Payment Methods...!", "name");

    teacherpayment.teacherpaystatus_id = { id: 2, name: "Completed" };

    // userta ta insert privilege naththam form buttons hide karanawa
    if (!userPrivilege.privi_insert) {
        tabFormButton.style.display = "none";   // "Add New" button hide
        buttonSubmit.style.display = "none";    // "Save" button hide
    }

    buttonSubmit.style.display = "block"; // submit button show

    // form eke tiyena input, select, radio okkoma border colour / UI reset karanawa
    setUIColour([selectTeacher, selectEnrollmentMonth, textPaymentAmount, textReferenceNo, selectPaymentType]);
    let tableTab = new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabTableArea"]'));
    tableTab.show(); // form tab hide karanna epa, table tab activate wenawa
}


//define getPendingEnrollmentsByTeacher function
const getPendingEnrollmentsByTeacher = (dataOb) => {

    // selected teacher object eka gannawa
    let selectedTeacher = JSON.parse(dataOb.value);
    // teacherpayment object ekata set karanawa
    teacherpayment.teacher_id = selectedTeacher;
    // border color change karanawa
    selectTeacher.style.border = "2px solid green";
    // backend eken pending enrollment months gannawa
    let pendingEnrollments = getDataAjaxGetRequest("/enrollment/getpendingbyteacher/" + selectedTeacher.id
    );
    // month select eka load karanawa
    loadSelectOptions(selectEnrollmentMonth, pendingEnrollments, "Select Month...!", "enrollmentmonth");
}

//define getEnrollmentData function
const getEnrollmentData = (dataOb) => {

    // selected enrollment object eka gannawa
    let selectedEnrollment = JSON.parse(dataOb.value);

    // enrollment object eka teacherpayment ekata bind karanawa
    teacherpayment.enrollment_id = selectedEnrollment;

    // display values
    totalBatchIncome.innerText = "Rs. " + selectedEnrollment.totalbatchincome;
    totalServiceCharge.innerText = "Rs. " + selectedEnrollment.totalservicecharge;
    totalAdditionalCharges.innerText = "Rs. " + selectedEnrollment.totaladditionalcharge;
    netAmount.innerText = "Rs. " + selectedEnrollment.netamount;
    //taxAmount.innerText = "Rs. " + selectedEnrollment.taxamount;
    enrollmentAmount.innerText = "Rs. " + selectedEnrollment.finalamount;
    // payment amount eka save karanawa

    // enrollment final amount eka teacher payment object ekata bind karanawa
    teacherpayment.enrollmentamount = selectedEnrollment.finalamount;


    // Enrollment amount eka payment amount field ekata auto set karanawa
    // User manually type karanna one naha
    textPaymentAmount.value = selectedEnrollment.finalamount;


    // Payment amount eka teacherpayment object ekata bind karanawa
    // Backend ekata save wenne me value eka
    teacherpayment.paidamount = selectedEnrollment.finalamount;


    // Payment amount valid kiyala green border pennanawa
    textPaymentAmount.style.border = "2px solid green";

    // Enrollment Month select eka valid kiyala green border pennanawa
    selectEnrollmentMonth.style.border = "2px solid green";

}

// define function for auto generate balance amount
/* const generateBalanceAmount = () => {

    // enrollment amount eka gannawa
    // parseFloat use karanne string value eka number ekakata convert karanna
    let enrollmentAmount = parseFloat(teacherpayment.enrollmentamount);

    // user enter karapu paid amount eka gannawa
    // input field value eka string nisa parseFloat use karanawa
    let paidAmount = parseFloat(textPaymentAmount.value);

    // balance amount calculate karanawa
    // formula = enrollment amount - paid amount
    //let balanceAmount = enrollmentAmount - paidAmount;

    // calculated balance amount eka textbox ekata set karanawa
    textBalanceAmount.value = balanceAmount;

    // balance amount eka teacherpayment object ekata bind karanawa
    // backend ekata pass wenne me object eka
    teacherpayment.balanceamount = balanceAmount;

    // valid balance nam green border pennanawa
    textBalanceAmount.style.border = "2px solid green";
}
 */

//define checkTeacherPaymentFormError function
const checkTeacherPaymentFormError = () => {

    let errors = "";

    // Teacher check
    if (teacherpayment.teacher_id == null) {
        errors += "Please Select Teacher. This is a required field..<br>";
        selectTeacher.style.border = "1px solid red";
    }
    // Enrollment Month / Enrollment check
    if (teacherpayment.enrollment_id == null) {
        errors += "Please Select Enrollment Month. This is a required field..<br>";
        selectEnrollmentMonth.style.border = "1px solid red";
    }
    // Payment Amount check
    if (teacherpayment.paidamount == null) {
        errors += "Please Enter Payment Amount. This is a required field..<br>";
        textPaymentAmount.style.border = "1px solid red";
    }
    /* // Balance Amount check
    if (teacherpayment.balanceamount == null) {
        errors += "Please Enter Balance Amount. This is a required field..<br>";
        textBalanceAmount.style.border = "1px solid red";
    } */
    // Payment Type check
    if (teacherpayment.teacherpaymethod_id == null) {
        errors += "Please Select Payment Type. This is a required field..<br>";
        selectPaymentType.style.border = "1px solid red";

    }

    // Reference No validation
    if (teacherpayment.teacherpaymethod_id != null) {
        if (teacherpayment.teacherpaymethod_id.name === "Bank Transfer") {
            if (
                teacherpayment.referenceno == null ||
                teacherpayment.referenceno.trim() === ""
            ) {
                errors += "Please enter Reference No. This field is required.<br>";
                textReferenceNo.style.border = "1px solid red";
            }
        }
    }
    return errors;
}

// define function for teacher payment form submission
const buttonTeacherPaySubmit = () => {

    // common insert function eka call karanawa
    submitWithConfirm(checkTeacherPaymentFormError, teacherpayment, "/teacherpayment/insert", () => {// success unama passe form eka reset + table reload
        loadTeacherPaymentForm();
        loadTeacherPaymentTable();

    });
}
// define print teacher payment function
const printTeacherPayment = (dataOb) => {

    // object assign karanawa
    let teacherpayment = dataOb;

    // teacher details
    tdTeacherName.innerText = teacherpayment.teacher_id.fullname;
    tdEnrollmentMonth.innerText = teacherpayment.enrollment_id.enrollmentmonth;
    tdPaymentMethod.innerText = teacherpayment.teacherpaymethod_id.name;
    tdPaymentStatus.innerHTML = `<span class="badge bg-success"> ${teacherpayment.teacherpaystatus_id.name}</span>`;

    // payment details
    tdPaidAmount.innerText = "Rs. " + teacherpayment.paidamount;
    //tdBalanceAmount.innerText = "Rs. " + teacherpayment.balanceamount;
    tdEnrollmentAmount.innerText = "Rs. " + teacherpayment.enrollmentamount;
    tdBillNo.innerText = teacherpayment.billno;


    if (teacherpayment.enrollment_id && teacherpayment.enrollment_id.enrollmentHasBatchList) {

        let batchDisplayColumns = [
            // get batch name
            { property: (ob) => ob.batch_id.batchname, dataType: "function" },
            // Map properties directly to EnrollmentHasBatch model fields
            { property: "registercount", dataType: "string" },
            { property: "batchfee", dataType: "string" },
            { property: "totalincome", dataType: "string" },
            {
                property: (ob) => ob.batch_id.freecardp,
                dataType: "function"
            },
            { property: "additionalcharges", dataType: "string" }
        ];
        loadTableDataInner(tbodyPrintBatchDetails, teacherpayment.enrollment_id.enrollmentHasBatchList, batchDisplayColumns);
    }

    // financial summary
    tdTotalBatchIncome.innerText = "Rs. " + teacherpayment.enrollment_id.totalbatchincome;
    tdTotalServiceCharge.innerText = "Rs. " + teacherpayment.enrollment_id.totalservicecharge;
    tdTotalAdditionalCharges.innerText = "Rs. " + teacherpayment.enrollment_id.totaladditionalcharge;
    tdNetAmount.innerText = "Rs. " + teacherpayment.enrollment_id.netamount;
    //tdTaxAmount.innerText = "Rs. " + teacherpayment.enrollment_id.taxamount;
    tdFinalAmount.innerText = "Rs. " + teacherpayment.enrollment_id.finalamount;


    // modal open karanawa
    $("#modalTeacherPaymentPrint").modal("show");
}
// Print function
const buttonTeacherPaymentPrint = () => {
    // Open a new tab for printing
    const newTab = window.open();

    // Write HTML content for the print page
    newTab.document.writeln(
        "<html>" +
        "<head>" +
        "<title>Teacher Payment Receipt</title>" +
        "<link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'>" +
        "<style>" +
        "body { padding: 30px; font-family: Arial, sans-serif; }" +
        "h2, h4 { text-align: center; }" +
        "table { width: 100%; margin-top: 20px; }" +
        "</style>" +
        "</head>" +
        "<body>" +
        printTeacherPaymentArea.outerHTML + // insert the modal content
        "</body></html>"
    );

    // interval ekak set kara mili second 500 kin - print eka click karama 250ms thiyala tab eka open wenawa.
    // eeta passe print page eka close karama mulu new tab ekama close wenawa.
    setTimeout(() => {
        newTab.print();
        newTab.close();
    }, 500);
    // Bootstrap modal eka hide karanawa
    $("#modalTeacherPaymentPrint").modal("hide");
}

// define changePaymentType function
// Payment Type change unama payment method eka bind karala
// Bank Transfer nam Reference No field eka show karanawa
// Cash / other payment method nam Reference No hide karanawa
const changePaymentType = (dataOb) => {

    // DB eken ena selected payment method JSON object eka gannawa
    // Example : {id:2, name:"Bank Transfer"}
    let selectedPaymentType = JSON.parse(dataOb.value);


    // selected payment method eka teacherpayment object ekata bind karanawa
    // backend ekata save wenne me object eka
    teacherpayment.teacherpaymethod_id = selectedPaymentType;


    // payment type select box eka valid kiyala green border pennanawa
    dataOb.style.border = "2px solid green";


    // Payment method eka Bank Transfer nam
    // Reference No field eka display karanawa
    if (selectedPaymentType.name === "Bank Transfer") {


        // hidden attribute eka remove karanawa
        // eken Reference No input row eka pennanawa
        divReferenceNo.hidden = false;


    } else {


        // Cash / other payment method nam
        // Reference No field eka hide karanawa
        divReferenceNo.hidden = true;


        // kalin enter karapu Reference No value eka clear karanawa
        textReferenceNo.value = "";


        // teacherpayment object eke reference no value eka remove karanawa
        // backend ekata null value ekak yawanawa
        teacherpayment.referenceno = null;

    }

}