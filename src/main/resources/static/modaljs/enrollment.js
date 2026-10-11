//browser refresh event – page eka reload wenakota enrollment data update wenawa
//eka nisa enrollment table eka refresh wenna reusable function ekak hadala use karanawa
//me function eka submission, update, delete awasthawal di call karanawa
//advantage – code reusability ekak tiyenawa, code eka simple wenawa

//browser load event
window.addEventListener("load", () => {

    // Logged-in user ta ENROLLMENT module eka sambandha permissions ganna
    userPrivilege = getDataAjaxGetRequest("/userprivilegebymodule?modulename=ENROLLMENT")

    //call table refresh function
    loadEnrollmentTable();

    //call form refresh function
    loadEnrollmentForm();

});
// Decimal places 2 ta round karanna
const round2 = (value) => {
    return Number((parseFloat(value) || 0).toFixed(2));
}

let selectTeacher = document.querySelector("#selectTeacher");
let textEnrollmentMonth = document.querySelector("#textEnrollmentMonth");
let totalBatchIncome = document.querySelector("#totalBatchIncome");
let totalServiceCharge = document.querySelector("#totalServiceCharge");
let totalAdditionalCharges = document.querySelector("#totalAdditionalCharges");
let netAmount = document.querySelector("#netAmount");
// let taxAmount = document.querySelector("#taxAmount");
let tabFormButton = document.querySelector("#tabFormButton");
let batchDetailsBody = document.querySelector("#batchDetailsBody");
let finalAmount = document.querySelector("#finalAmount");

// define getTeacher function
const getTeacher = (dataOb) => {
    return dataOb.teacher_id.fullname;
}

// Define enrollment status Function
const getEnrollmentStatus = (dataOb) => {
    //status gannawa object ekata
    const enrollmentstatus = dataOb.enrollmentstatus_id.name;

    //Pending status => orange color
    if (enrollmentstatus === "Pending") {
        return `<span style="color: orange; font-weight: bold;">${enrollmentstatus}</span>`;
    }

    //Completed status => blue color
    if (enrollmentstatus === "Completed") {
        return `<span style="color: green; font-weight: bold;">${enrollmentstatus}</span>`;
    }

    return `<span>${enrollmentstatus}</span>`;
}

// enrollment table refresh function
const loadEnrollmentTable = () => {

    // create empty array for catch many objects 
    enrollments = new Array();

    // backend eken enrollments okkoma gannawa
    enrollments = getDataAjaxGetRequest("/enrollment/alldata");

    //string-string,numbers,date
    //function-object,array,boolean,image
    //create property array
    // table display karanna columns define karanawa
    let displayColumns = [
        { property: getTeacher, dataType: "function" },
        { property: "enrollmentmonth", dataType: "string" },
        { property: "finalamount", dataType: "string" },
        { property: getEnrollmentStatus, dataType: "function" }
    ];

    // Call reusable table data fill function
    loadTableData1(tableBodyEnrollment, enrollments, displayColumns, printEnrollment);

    // Initialize DataTable 
    $('#tableEnrollment').dataTable();
}


//define  function for enrollment form error check
const checkEnrollmentFormError = () => {
    let errors = ""; // errors collect karanna empty string ekak hadanawa

    // Teacher check
    if (enrollment.teacher_id == null) {
        errors += "Please Select Teacher. This is a required field.\n";
        selectTeacher.style.border = "1px solid red"; // input field red border
    }

    // Month check
    if (enrollment.enrollmentmonth == null) {
        errors += "Please enter enrollment month. This is a required field.\n";
        textEnrollmentMonth.style.border = "1px solid red";
    }

    return errors; // return all errors
}


// define function for enrollment form submission
const buttonEnrollmentSubmit = () => {

    // common insert function eka call karanawa
    submitWithConfirm(checkEnrollmentFormError, enrollment, "/enrollment/insert", () => {
        // success unama passe form eka reset + table reload
        loadEnrollmentForm();
        loadEnrollmentTable();
    });
}


//define loadEnrollmentForm
const loadEnrollmentForm = () => {

    //change tab button name
    tabFormButton.innerText = "Add Enrollement";

    // form eka reset karanawa (input walata dapu values okkoma clear wenawa)
    formEnrollment.reset();

    // empty object ekak hadanawa → data binding walata use wenna
    enrollment = new Object();

    //inner tabelekata data fill wenne methnain
    enrollment.enrollmentHasBatchList = new Array();

    // inner table refresh karanawa
    loadInnerBatchDetailTable();

    // financial summary clear karanawa
    fillFinancialSummary({
        totalBatchIncome: 0,
        totalServiceCharge: 0,
        totalAdditionalCharges: 0,
        netAmount: 0,
        finalAmount: 0
    });

    // DB eken okkoma teacher ganna -> dropdown ekata load karanna
    let teachers = getDataAjaxGetRequest("/teacher/alldata");
    loadSelectOptions(selectTeacher, teachers, "Select Teacher...!", "fullname");

    enrollment.enrollmentstatus_id = { id: 1, name: "Pending" };

    // userta ta insert privilege naththam form buttons hide karanawa
    if (!userPrivilege.privi_insert) {
        tabFormButton.style.display = "none";   // "Add New" button hide
        buttonSubmit.style.display = "none";    // "Save" button hide
    }

    buttonSubmit.style.display = "block"; // submit button show

    // form eke tiyena input, select, radio okkoma border colour / UI reset karanawa
    setUIColour([selectTeacher, textEnrollmentMonth]);

    let tableTab = new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabTableArea"]'));
    tableTab.show(); // form tab hide karanna epa, table tab activate wenawa
}


const printEnrollment = (dataOb) => {

    enrollment = dataOb;

    // Enrollment details tika modal eke td walata set karanawa
    tdTeacher.innerText = enrollment.teacher_id.fullname;
    tdMonth.innerText = enrollment.enrollmentmonth;
    tdTotalBatchIncome.innerText = enrollment.totalbatchincome;
    tdServiceCharge.innerText = enrollment.totalservicecharge;
    tdAdditionalCharges.innerText = enrollment.totaladditionalcharge;
    tdNetAmount.innerText = enrollment.netamount;
    //tdTaxAmount.innerText = enrollment.taxamount;
    tdFinalAmount.innerText = enrollment.finalamount;
    tdStatus.innerText = enrollment.enrollmentstatus_id.name;


    // Batch summary calculate karanawa
    let totalBatches = enrollment.enrollmentHasBatchList.length;

    let totalRegisteredStudents = 0;
    let totalPaidStudents = 0;
    let totalFreeCards = 0;
    let totalRegisteredFreeCards = 0;
    let totalAvailableFreeCards = 0;


    enrollment.enrollmentHasBatchList.forEach(batch => {

        totalRegisteredStudents += Number(batch.registercount) || 0;
        totalPaidStudents += Number(batch.paidcount) || 0;

        totalFreeCards += Number(batch.totalfreecardcount) || 0;
        totalRegisteredFreeCards += Number(batch.registeredfreecardcount) || 0;
        totalAvailableFreeCards += Number(batch.availablefreecardcount) || 0;

    });


    // Batch summary details set karanawa
    tdTotalBatches.innerText = totalBatches;
    tdTotalRegisteredStudents.innerText = totalRegisteredStudents;
    tdTotalPaidStudents.innerText = totalPaidStudents;

    tdTotalFreeCardCount.innerText = totalFreeCards;
    tdRegisteredFreeCardCount.innerText = totalRegisteredFreeCards;
    tdAvailableFreeCardCount.innerText = totalAvailableFreeCards;


    // Bootstrap modal eka open karanawa
    $("#modalEnrollmentPrint").modal("show");
}


// Print button eka click karama call wenna function eka
const buttonPrint = () => {

    // Aluth tab ekak open karanawa
    const newTab = window.open();

    // Print page eka create karanawa
    newTab.document.writeln(
        "<html><head><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'><title>Print Enrollment Details</title></head>" +
        "<body>" +
        "<h2>Print Teacher Enrollment</h2>" +
        tablePrintEnrollment.outerHTML +
        "</body></html>"
    );

    // Document eka close karanawa
    newTab.document.close();

    // Print dialog eka open karanawa
    // interval ekak set kara mili second 250 kin - print eka click karama 250ms thiyala tab eka open wenawa.
    // eeta passe print page eka close karama mulu new tab ekama close wenawa.
    setTimeout(() => {
        newTab.print();
        newTab.close();
    }, 250);

    // Modal eka hide karanawa
    $("#modalEnrollmentPrint").modal("hide");
}


//previous month set karanna + 3 months limit denna
const handleMonth = () => {
    // ada date eka gannawa
    let today = new Date();

    // ada month eken ekakata kalin month eka gannawa
    let lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);

    // kalin month eke year eka gannawa
    let year = lastMonth.getFullYear();

    // kalin month eke month eka gannawa (01, 02 wage format ekata)
    let month = String(lastMonth.getMonth() + 1).padStart(2, "0");

    // year + month join karanawa (ex: 2025-09)
    let finalMonth = `${year}-${month}`;

    // input field eke value eka denna (auto-fill previous month)
    textEnrollmentMonth.value = finalMonth;

    // ada month eken dekakata kalin month eka gannawa (3 month range start karanna)
    let threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2);

    // e month eke year eka gannawa
    let minYear = threeMonthsAgo.getFullYear();

    // e month eke month eka gannawa (format ekata hadanawa)
    let minMonth = String(threeMonthsAgo.getMonth() + 1).padStart(2, "0");

    // min value ekata year + month join karanawa
    let minValue = `${minYear}-${minMonth}`;

    // ada year eka gannawa (max range ekata)
    let maxYear = today.getFullYear();

    // ada month eka gannawa (format ekata hadanawa)
    let maxMonth = String(today.getMonth() + 1).padStart(2, "0");

    // max value ekata year + month join karanawa
    let maxValue = `${maxYear}-${maxMonth}`;

    // input eke min max range set karanawa (3 months range witharai select karanna puluwan)
    textEnrollmentMonth.min = minValue;
    textEnrollmentMonth.max = maxValue;

    textEnrollmentMonth.style.border = '2px solid green'
}


selectTeacher.addEventListener("change", () => {

    // teacher change unama month eka auto set karala valid range apply karanawa
    handleMonth();

    // selected month value eka enrollment object ekata bind karanawa
    enrollment.enrollmentmonth = textEnrollmentMonth.value;

    // select box value eka JSON object ekak widihata parse karanawa
    let selectedTeacher = JSON.parse(selectTeacher.value);

    // teacher id eka extract karanawa
    let teacherId = selectedTeacher.id;

    // backend eken teacher ta adala batch list eka gannawa
    let batchList = getDataAjaxGetRequest("/batch/byteacher/" + teacherId);

    // old data clear karala new batch list ekata ready karanawa
    enrollment.enrollmentHasBatchList = [];

    // total values initialize karanawa (මෙහිදී අගයන් 0 ලෙස ආරම්භ කරයි)
    let totalIncome = 0;
    let totalAdditionalCharges = 0;
    let totalServiceChargeSum = 0;

    // batch list eka loop karala calculations karanawa
    batchList.forEach(batch => {

        let enrollmentHasBatch = {};

        // Batch object
        enrollmentHasBatch.batch_id = batch;

        // Batch Fee
        let batchFee = parseFloat(batch.monthfee) || 0;
        enrollmentHasBatch.batchfee = batchFee;

        // Registered Student Count
        let registerCount = getDataAjaxGetRequest("/studentregistration/count/" + batch.id) || 0;
        enrollmentHasBatch.registercount = registerCount;

        // Paid Student Count (Selected Month)
        let paidCount = getDataAjaxGetRequest(
            "/studentpayment/paycountbybatchandmonth/" +
            batch.id + "/" + enrollment.enrollmentmonth) || 0;
        enrollmentHasBatch.paidcount = paidCount;

        // Free card use karapu student count eka gannawa
        let freecount = getDataAjaxGetRequest("/studentregistration/freecount/" + batch.id) || 0;

        // Batch eke total free card count eka
        let totalFreeCard = parseInt(batch.freecardp) || 0;


        // Batch eke thiyena total free cards
        enrollmentHasBatch.totalfreecardcount = totalFreeCard;


        // Use karapu free cards
        enrollmentHasBatch.registeredfreecardcount = freecount;


        // Thawa ithuru free cards
        let availableFreeCard = Math.max(totalFreeCard - freecount, 0);

        enrollmentHasBatch.availablefreecardcount = availableFreeCard;

        // Additional charge calculate karanawa
        let additionalcharges = 0;

        if (registerCount > 0) {
            additionalcharges = Math.max(
                freecount - totalFreeCard,
                0
            ) * (parseFloat(batch.servicecharge) || 0);
        }

        enrollmentHasBatch.additionalcharges = additionalcharges;

        // Total Income for this batch (Paid Count * Batch Fee)
        let batchIncome = paidCount * batchFee;
        enrollmentHasBatch.totalincome = batchIncome;

        // Service charge for this batch (Paid Count * Service Charge per student, හෝ අවශ්‍ය පරිදි)
        let serviceChargePerBatch = paidCount * (parseFloat(batch.servicecharge) || 0);

        // **මෙතැනදී මුළු එකතුවන්ට (Totals) අදාළ අගයන් එකතු කිරීම සිදු කරයි**
        totalIncome += batchIncome;
        totalServiceChargeSum += serviceChargePerBatch;
        totalAdditionalCharges += additionalcharges;

        // Enrollment has batch list ekata object eka push karanawa
        enrollment.enrollmentHasBatchList.push(enrollmentHasBatch);
    });

    // Net Amount calculate karanawa
    let net = totalIncome - (totalServiceChargeSum + totalAdditionalCharges);

    // negative values prevent karanawa
    net = Math.max(net, 0);

    // Final Amount = Net Amount
    let final = net;

    // round values
    net = round2(net);
    final = round2(final);
    totalIncome = round2(totalIncome);
    totalServiceChargeSum = round2(totalServiceChargeSum);
    totalAdditionalCharges = round2(totalAdditionalCharges);

    // inner batch table refresh
    loadInnerBatchDetailTable();

    // financial summary update
    fillFinancialSummary({
        totalBatchIncome: totalIncome || 0,
        totalServiceCharge: totalServiceChargeSum || 0,
        totalAdditionalCharges: totalAdditionalCharges || 0,
        netAmount: net,
        finalAmount: final
    });

});

// define inner batch detail table function
const loadInnerBatchDetailTable = () => {

    // inner table columns define
    let batchDisplayColumns = [
        { property: getInnerBatchName, dataType: "function" },
        { property: "batchfee", dataType: "string" },
        { property: "registercount", dataType: "string" },
        { property: "paidcount", dataType: "string" },
        { property: "totalincome", dataType: "string" },
        { property: "totalfreecardcount", dataType: "string" },
        { property: "registeredfreecardcount", dataType: "string" },
        { property: "availablefreecardcount", dataType: "string" },
        { property: "additionalcharges", dataType: "string" }
    ];

    // reusable function eken table data load karanawa
    loadTableDataInner(
        batchDetailsBody,
        enrollment.enrollmentHasBatchList,
        batchDisplayColumns
    );

    // DataTable use karanawanam meka uncomment karanna
    // $('#tabelInnerBatchDetails').dataTable();
}

//get batchnames
const getInnerBatchName = (dataOb) => {
    return dataOb.batch_id.batchname;
}



const fillFinancialSummary = (data) => {

    totalBatchIncome.innerText = round2(data.totalBatchIncome);
    enrollment.totalbatchincome = round2(data.totalBatchIncome);

    totalServiceCharge.innerText = round2(data.totalServiceCharge);
    enrollment.totalservicecharge = round2(data.totalServiceCharge);

    totalAdditionalCharges.innerText = round2(data.totalAdditionalCharges);
    enrollment.totaladditionalcharge = round2(data.totalAdditionalCharges);

    netAmount.innerText = round2(data.netAmount);
    enrollment.netamount = round2(data.netAmount);

    /*  taxAmount.innerText = round2(data.taxAmount);
     enrollment.taxamount = round2(data.taxAmount); */

    finalAmount.innerText = round2(data.finalAmount);
    enrollment.finalamount = round2(data.finalAmount);
}

