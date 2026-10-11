//browser refresh event – page eka reload wenakota db eken student payment data okkoma update wenawa.
//eka nisa student payment table eka refresh wenna reusable function ekak hadala use karanawa.
//me function eka submission, update, delete awasthawal di call karanawa.
//advantage – code reusability ekak tiyenawa, code eka simple wenawa.

//browser load event
window.addEventListener("load", () => {

    // Logged-in user ta STUDENT PAYMENT module eka sambandha permissions ganna
    userPrivilege = getDataAjaxGetRequest("/userprivilegebymodule?modulename=STUDENTPAYMENT")

    //(type krna kota loadStudent function call wenawa)
    textStuNoFilter.addEventListener("input", loadStudent);

    //call table refresh function
    loadStudentPaymentTable();
    //call form refresh function
    loadStudentPaymentForm();
});

let selectPaymentCategory = document.querySelector("#selectPaymentCategory");
let divPaymonth = document.querySelector("#divPaymonth");
let divRegBatch = document.querySelector("#divRegBatch");
let selectRegBatch = document.querySelector("#selectRegBatch");
let dateMonth = document.querySelector("#dateMonth");
let selectPaymentMethod = document.querySelector("#selectPaymentMethod");
let selectPaymentMode = document.querySelector("#selectPaymentMode");

let textTotalAmount = document.querySelector("#textTotalAmount");
let textPaidAmount = document.querySelector("#textPaidAmount");
let textBalanceAmount = document.querySelector("#textBalanceAmount");
let divStudent = document.querySelector("#divStudent");
let textStuNoFilter = document.querySelector("#textStuNoFilter");
let textStuFullname = document.querySelector("#textStuFullname");
let textStuCallingName = document.querySelector("#textStuCallingName");
let textStuMobile = document.querySelector("#textStuMobile");
let textStuAddress = document.querySelector("#textStuAddress");
let textStudentStatus = document.querySelector("#textStudentStatus");
let tabFormButton = document.querySelector("#tabFormButton");
let divReferenceNo = document.querySelector("#divReferenceNo");
let textReferenceNo = document.querySelector("#textReferenceNo");

const students = getDataAjaxGetRequest("/student/alldata");


// Student No input ekata adala details load karanawa
const loadStudent = () => {

    // Registration number eka gannawa
    const regno = textStuNoFilter.value.trim();

    // Student kenek hoyanawa
    const studentData = students.find(s => s.regno === regno);

    // Validation fail nam
    if (regno.length !== 9 || !studentData) {

        // Student details hide karanawa
        divStudentPhoto.style.display = "none";
        divButtonView.style.display = "none";
        btnViewStudent.style.display = "none";

        // Selected student reset karanawa
        studentpayment.student_id = null;

        // Border red karanawa
        textStuNoFilter.style.border = "2px solid red";

        return;
    }

    // Calling name display karanawa
    pCallingName.innerText = studentData.callingname;

    // View area show karanawa
    divButtonView.style.display = "block";
    divStudentPhoto.style.display = "flex";
    btnViewStudent.style.display = "inline-block";

    // Student photo load karanawa
    if (studentData.photo != null) {
        imgPhoto.src = atob(studentData.photo);
    } else {
        imgPhoto.src = "images/studenticon.jpg";
    }

    // Selected student set karanawa
    studentpayment.student_id = studentData;

    // Modal data load karanawa
    tdStudentNo.innerText = studentData.regno;
    tdFullName.innerText = studentData.fullname;
    tdCallingNameShow.innerText = studentData.callingname;
    tdNic.innerText = studentData.nic;
    tdDob.innerText = studentData.dob;
    tdGender.innerText = studentData.gender;
    tdAddress.innerText = studentData.address;
    tdMobile.innerText = studentData.whatsapno;
    tdSchool.innerText = studentData.schoolname;
    tdStudentStatus.innerText = studentData.studentstatus_id.name;

    // Guardian name display karanawa
    if (studentData.guardian_id) {
        tdGuardianName.innerText =
            studentData.guardian_id.guardianname;
    }

    // Validation eka success unama border eka green karanawa
    textStuNoFilter.style.border = "2px solid green";

    // Student ge batches tika load karanawa
    loadStudentBatches(studentData.id);

    studentRegNo = textStuNoFilter.value;

    // Student ge kalin payment thiyenawada kiyala check karanawa
    checkStudentPaymentCount = getDataAjaxGetRequestForString("/student/paymentcountbystudent/" + studentRegNo + "");

    console.log(checkStudentPaymentCount);

    // Payment category options tika array ekakata gannawa
    optionTags = new Array();

    optionTags = selectPaymentCategory.options;


    // Kalin payment ekak thiyenawanam admission fee option eka disable karanawa
    if (parseInt(checkStudentPaymentCount) > 0) {

        optionTags[1].disabled = true;
        optionTags[2].disabled = false;

        // optionTags[1].style.display = "none";
        // optionTags[2].style.display = "block";

    } else {

        // Payment ekak nathnam admission fee option eka enable karanawa
        optionTags[1].disabled = false;
        optionTags[2].disabled = true;

        // optionTags[1].style.display = "block";
        // optionTags[2].style.display = "none";

    }

}

// Button click event to show modal
btnViewStudent.onclick = () => {
    if (studentpayment.student_id) {
        $("#modalStudentDetail").modal("show");
    }
}

const handleDivRegBatch = () => {
    if (studentpayment.paymentcategory_id != null &&
        studentpayment.paymentcategory_id.name === "Monthly Fee") {
        divPaymonth.hidden = false;
        divRegBatch.hidden = false;
        selectRegBatch.required = true;
        dateMonth.required = true;



        // Auto-set current month
        const today = new Date();
        const currentMonth = today.toISOString().slice(0, 7); // YYYY-MM format
        dateMonth.value = currentMonth; // default to current month

        // Optional: auto-validate border
        dateMonth.style.border = "2px solid green";
        studentpayment.paymonth = currentMonth;

        // total amount clear (batch select karama auto fill wenawa)
        textTotalAmount.value = "";
        studentpayment.totalamount = null;
        textTotalAmount.disabled = true;
        selectRegBatch.style.border = "";


    } else {
        divPaymonth.hidden = true;
        divRegBatch.hidden = true;        // batch div hide
        selectRegBatch.value = "";
        dateMonth.value = "";
        studentpayment.paymonth = null;
        studentpayment.studentregistration_id = null;

        // Admission Fee auto set 500
        textTotalAmount.value = 500;
        studentpayment.totalamount = 500;
        textTotalAmount.disabled = true;
        textTotalAmount.style.border = "2px solid green";

    }
}

// Make sure this is called whenever Payment Category changes
selectPaymentCategory.addEventListener("change", handleDivRegBatch);

// Payment Mode change weddi Payment Method filter karana function eka
// Physical -> Cash, Card
// Online -> Bank Transfer

const handlePaymentMode = () => {

    // Payment Mode select karala nathnam stop karanawa
    if (studentpayment.paymentmode_id == null) {
        return;
    }

    // Filtered payment methods store karanna array ekak
    let filteredMethods = new Array();

    // Physical Payment

    if (studentpayment.paymentmode_id.name === "Physical") {
        // Physical walata Cash saha Card allow karanawa
        filteredMethods = payamentmethods.filter(pm =>
            pm.name === "Cash" ||
            pm.name === "Card"
        );
    }
    // Online Payment
    else if (studentpayment.paymentmode_id.name === "Online") {
        // Online walata Bank Transfer witharai
        filteredMethods = payamentmethods.filter(pm =>
            pm.name === "Bank Transfer"
        );

    }

    // Payment Method dropdown eka update karanawa
    loadSelectOptions(selectPaymentMethod, filteredMethods, "Select Payment Method...!", "name");


    // Previous payment method eka clear karanawa
    studentpayment.paymentmethod_id = null;

    // Reference No hide karanawa
    divReferenceNo.hidden = true;

    // Reference value clear karanawa
    textReferenceNo.value = "";

    // Object eke value eka clear karanawa
    studentpayment.referenceNo = null;

}

// Payment Method change weddi Reference No show/hide karanawa
const handlePaymentMethod = () => {

    // Payment Method select karala nathnam hide karanawa
    if (studentpayment.paymentmethod_id == null) {
        divReferenceNo.hidden = true;
        return;
    }

    // Card payment nam Reference No show
    if (studentpayment.paymentmethod_id.name === "Card") {
        divReferenceNo.hidden = false;
    }

    // Bank Transfer nam Reference No show
    else if (studentpayment.paymentmethod_id.name === "Bank Transfer") {
        divReferenceNo.hidden = false;
    }

    // Cash nam Reference No hide
    else if (studentpayment.paymentmethod_id.name === "Cash") {
        divReferenceNo.hidden = true;
        textReferenceNo.value = "";
        studentpayment.referenceNo = null;
    }
}
selectPaymentMethod.addEventListener("change", () => {

    // selected payment method object eka set karanawa
    studentpayment.paymentmethod_id = JSON.parse(selectPaymentMethod.value);

    // reference no show/hide
    handlePaymentMethod();

});

// User Reference No type karana welawata
// studentpayment object update karanawa
textReferenceNo.addEventListener("input", () => {
    studentpayment.referenceNo = textReferenceNo.value;
});


// Get student registration number
const getStudentNo = (dataOb) => {
    return dataOb.studentregistration_id?.student_id?.regno
        || dataOb.student_id?.regno; // fallback if both missing
}

// Get student calling name
const getStudentCallingName = (dataOb) => {
    return dataOb.studentregistration_id?.student_id?.callingname
        || dataOb.student_id?.callingname;
}

// Get batch name
const getBatch = (dataOb) => {
    if (dataOb.studentregistration_id != null) {
        return dataOb.studentregistration_id?.batch_id?.batchname;
    } else {
        return "-";
    }

}

// Get payment category name
const getPaymentCategory = (dataOb) => {
    return dataOb.paymentcategory_id?.name;
}


//student payment table refresh function
loadStudentPaymentTable = () => {

    // create empty array for catch many objects 
    studentpayments = new Array();
    // backend eken student registrationS okkoma gannawa
    studentpayments = getDataAjaxGetRequest("/studentpayment/alldata");
    studentpayments.reverse();//decending kra

    //string-string, numbers, date
    //function-object, array, boolean, image
    //create property array
    let displayColumns = [
        { property: getStudentNo, dataType: "function" },
        { property: getStudentCallingName, dataType: "function" },
        { property: getBatch, dataType: "function" },
        { property: getPaymentCategory, dataType: "function" },

    ];

    // Call reusable table data fill function
    loadTableData1(tableBodyStudentPayment, studentpayments, displayColumns, printStudentPayment);

    // initialize datatable plugin
    $('#tableStudentPayment').dataTable();

}

//studentpayment form refresh function
loadStudentPaymentForm = () => {
    // tab eke button text set karanna
    tabFormButton.innerText = "Add Payment";

    // form eka reset karanna (input fields wala thibuna values okkoma clear wenawa)
    formStudentPayment.reset();

    // aluth empty object hadanna → data binding walata use karanna
    studentpayment = new Object();
    // mokadda - valid value tika collect karala backend ekata pass karanna ona
    // ekka ekka pass karanawa wada object eka pass karanna lesi

    // payament category list 
    payamentcategories = getDataAjaxGetRequest("/paymentcategory/alldata");
    loadSelectOptions(selectPaymentCategory, payamentcategories, "Select Payment Category...!", "name");

    // payament mode list 
    payamentmodes = getDataAjaxGetRequest("/paymentmode/alldata");
    loadSelectOptions(selectPaymentMode, payamentmodes, "Select Payment Mode...!", "name");

    // payment method list load karanawa
    payamentmethods = getDataAjaxGetRequest("/paymentmethod/alldata");

    // Student related UI hide karanawa
    divStudentPhoto.style.display = "none";
    divButtonView.style.display = "none";
    btnViewStudent.style.display = "none";

    divPaymonth.hidden = true;

    // Reference No field eka mulin hide karanawa
    // Payment Method eka Card ho Bank Transfer unoth witharai show wenne
    divReferenceNo.hidden = true;

    // Previous Reference No value eka clear karanawa
    textReferenceNo.value = "";
    divRegBatch.hidden = true;


    // form eke tiyena input, select, radio okkoma border colour / UI reset karanawa
    setUIColour([textStuNoFilter, selectPaymentCategory, dateMonth, selectRegBatch, selectPaymentMode, selectPaymentMethod, textReferenceNo, textTotalAmount, textPaidAmount, textBalanceAmount]);

    let tableTab = new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabTableArea"]'));
    tableTab.show(); // form tab hide karanna epa, table tab activate wenawa
}

// Student Payment print karanna hadapu function eka define karanawa
const printStudentPayment = (dataOb) => {
    const studentpayment = dataOb;

    // Student payment details tika modal eke thiyena td walata danna
    tdStuNo.innerText = studentpayment.studentregistration_id?.student_id?.regno
        || studentpayment.student_id?.regno;

    tdCallingName.innerText = studentpayment.studentregistration_id?.student_id?.callingname
        || studentpayment.student_id?.callingname;

    tdRegBatch.innerText = studentpayment.studentregistration_id?.batch_id?.batchname
        || "-";
    tdPaymentNo.innerText = studentpayment.paymentno;
    tdPaymentCategory.innerText = studentpayment.paymentcategory_id.name;
    tdPaymentMode.innerText = studentpayment.paymentmode_id.name;
    tdPaymentMethod.innerText = studentpayment.paymentmethod_id.name;
    tdPayMonth.innerText = studentpayment.paymonth;
    tdTamount.innerText = studentpayment.totalamount;
    tdPamount.innerText = studentpayment.paidamount;
    tdBamount.innerText = studentpayment.balanceamount;


    // Bootstrap modal eka open karanawa
    $("#modalStudantPayPrint").modal("show");
}

// Print button eka click karama call wenna function eka
const buttonPrint = () => {

    // Aluth tab ekak open karanawa
    const newTab = window.open();

    // Print page eka create karanawa
    newTab.document.writeln(
        "<html><head><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'><title>Print Student Payment</title></head>" +
        "<body>" +
        "<h2>Print Print Student Payment</h2>" +
        tablePrintStudentPay.outerHTML +
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
    $("#modalStudantPayPrint").modal("hide");
}

//define function for student payment form error check
const checkStudentPayError = () => {
    let errors = "";

    // Payment Category check
    if (studentpayment.paymentcategory_id == null) {
        errors += "Please select a Payment Category. This field is required..<br>";
        selectPaymentCategory.style.border = "1px solid red";
    } else {

        // =========================
        // Monthly Fee validations
        // =========================
        if (studentpayment.paymentcategory_id.name == "Monthly Fee") {

            // Registered Batch check
            if (studentpayment.studentregistration_id == null) {
                errors += "Please select Registered Batch. This field is required..<br>";
                selectRegBatch.style.border = "1px solid red";
            }
            // Pay Month check
            if (studentpayment.paymonth == null) {
                errors += "Please select Pay Month. This field is required..<br>";
                dateMonth.style.border = "1px solid red";
            }
            // Payment Mode check
            if (studentpayment.paymentmode_id == null) {
                errors += "Please select Payment Mode. This field is required..<br>";
                selectPaymentMode.style.border = "1px solid red";
            }

            // Payment Method check
            if (studentpayment.paymentmethod_id == null) {
                errors += "Please select Payment Method. This field is required..<br>";
                selectPaymentMethod.style.border = "1px solid red";
            }

            // Reference No validation
            if (studentpayment.paymentmethod_id != null) {

                if (
                    studentpayment.paymentmethod_id.name === "Card" ||
                    studentpayment.paymentmethod_id.name === "Bank Transfer"
                ) {

                    if (studentpayment.referenceNo == null ||
                        studentpayment.referenceNo.trim() === "") {


                        errors += "Please enter Reference No. This field is required.<br>";

                        textReferenceNo.style.border = "1px solid red";

                    }

                }

            }
            // Total Amount check
            if (studentpayment.totalamount == null) {
                errors += "Please enter Total Amount. This field is required..<br>";
                textTotalAmount.style.border = "1px solid red";
            }
            // Paid Amount check
            if (studentpayment.paidamount == null) {
                errors += "Please enter Paid Amount. This field is required..<br>";
                textPaidAmount.style.border = "1px solid red";
            }
            // Balance Amount check
            if (studentpayment.balanceamount == null) {
                errors += "Please enter Balance Amount. This field is required..<br>";
                textBalanceAmount.style.border = "1px solid red";
            }
        } else {
            // =========================
            // Admission Fee validations
            // =========================

            // clear monthly fee only fields
            selectRegBatch.style.border = "";
            dateMonth.style.border = "";

            // Payment Mode check
            if (studentpayment.paymentmode_id == null) {
                errors += "Please select Payment Mode. This field is required..<br>";
                selectPaymentMode.style.border = "1px solid red";
            }

            // Payment Method check
            if (studentpayment.paymentmethod_id == null) {
                errors += "Please select Payment Method. This field is required..<br>";
                selectPaymentMethod.style.border = "1px solid red";
            }
            // Reference No validation
            if (studentpayment.paymentmethod_id != null) {

                if (
                    studentpayment.paymentmethod_id.name === "Card" ||
                    studentpayment.paymentmethod_id.name === "Bank Transfer"
                ) {

                    if (studentpayment.referenceNo == null ||
                        studentpayment.referenceNo.trim() === "") {


                        errors += "Please enter Reference No. This field is required.<br>";

                        textReferenceNo.style.border = "1px solid red";

                    }

                }

            }
            // Total Amount check
            if (studentpayment.totalamount == null) {
                errors += "Please enter Total Amount. This field is required..<br>";
                textTotalAmount.style.border = "1px solid red";
            }
            // Paid Amount check
            if (studentpayment.paidamount == null) {
                errors += "Please enter Paid Amount. This field is required..<br>";
                textPaidAmount.style.border = "1px solid red";
            }
            // Balance Amount check
            if (studentpayment.balanceamount == null) {
                errors += "Please enter Balance Amount. This field is required..<br>";
                textBalanceAmount.style.border = "1px solid red";
            }
        }
    }

    return errors; // return all errors
}

//student payment submission function
const buttonStudenPaySubmit = () => {

    submitWithConfirm(checkStudentPayError, studentpayment, "/studentpayment/insert", () => {
        // success → reset form + reload table
        loadStudentPaymentForm();
        loadStudentPaymentTable();

    });
}

//calculat balnce amount
const calculateBalanceAmount = () => {
    // Get the total amount entered by the user
    let total = parseFloat(textTotalAmount.value);

    // Get the paid amount entered by the user
    let paid = parseFloat(textPaidAmount.value);


    // Prevent negative balance values
    /* if (balance < 0) {
        balance = 0;
    } */

    if (parseFloat(textTotalAmount.value) <= parseFloat(textPaidAmount.value)) {


        // Calculate the balance amount
        let balance = paid - total;

        // Update the Balance Amount input field in the form
        textBalanceAmount.value = balance;

        // Update the balance amount in the studentpayment object
        studentpayment.balanceamount = balance;

        textBalanceAmount.style.border = "2px solid green";

        textPaidAmount.style.border = "2px solid green";

    } else {

        textBalanceAmount.value = 0;

        studentpayment.paidamount = null;

        studentpayment.balanceamount = null;

        textBalanceAmount.style.border = "2px solid red";

        textPaidAmount.style.border = "2px solid red";

    }


}
const loadStudentBatches = (studentId) => {
    if (!studentId) return;
    const regbatches = getDataAjaxGetRequest(`/batch/registeredbatches?studentId=${studentId}`);
    loadSelectOptions(selectRegBatch, regbatches, "Select Registered Batch..!", "batchname");
}

const loadBatchFee = () => {

    // Batch select karala thiyenawada saha student select wela thiyenawada check karanawa
    if (selectRegBatch.value != "" && studentpayment.student_id != null) {

        // studentpayment object eken student id eka gannawa
        const studentId = studentpayment.student_id.id;

        // selected batch object eken batch id eka gannawa
        const batchId = JSON.parse(selectRegBatch.value).id;

        // backend eken studentId saha batchId anuwa StudentRegistration object eka gannawa
        const stureg = getDataAjaxGetRequest(`/stureg/bystubatch?studentId=${studentId}&batchId=${batchId}`);

        // studentpayment object eke studentregistration foreign key eka set karanawa
        studentpayment.studentregistration_id = stureg;

        // StudentRegistration eke regfee eka Total Amount field ekata auto fill karanawa
        textTotalAmount.value = parseFloat(stureg.regfee);

        // total amount value eka studentpayment object ekata set karanawa
        studentpayment.totalamount = parseFloat(stureg.regfee);

        // Total Amount field eka auto-fill nisa edit karanna ba
        textTotalAmount.disabled = true;

        // valid nisa green border set karanawa
        textTotalAmount.style.border = "2px solid green";
        selectRegBatch.style.border = "2px solid green";

    } else {
        // batch select naththam studentregistration eka null karanawa
        studentpayment.studentregistration_id = null;

        // total amount field clear karanawa
        textTotalAmount.value = "";

        // object eke total amount eka null karanawa
        studentpayment.totalamount = null;
    }
} 
