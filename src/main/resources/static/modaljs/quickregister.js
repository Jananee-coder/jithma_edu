// browser load event
window.addEventListener("load", () => {

    // Logged-in user ta STUDENT module eka sambandha permissions ganna
    userPrivilege = getDataAjaxGetRequest("/userprivilegebymodule?modulename=QUICKREGISTER");

    // Add input event listener for Guardian NIC
    //(type karana kota loadGuardian function call wenawa)
    textGuardianFilterNic.addEventListener("input", loadGuardian);
    textStuNoFilter.addEventListener("input", loadStudent);

    // default step eka student step eka (step 1) set karanawa
    showStep(1);

    // call form refresh function
    loadQuickStudentForm();
});


// DOM elements
let textGuardianName = document.querySelector("#textGuardianName");
let textGuardianMobile = document.querySelector("#textGuardianMobile");
let selectGuardianType = document.querySelector("#selectGuardianType");
let textGuAddress = document.querySelector("#textGuAddress");
let selectGuardianStatus = document.querySelector("#selectGuardianStatus");
let divGuardian = document.querySelector("#divGuardian");

let labelStuStatus = document.querySelector("#labelStuStatus");
let divSelectStuStatus = document.querySelector("#divSelectStuStatus");

let textStuFullname = document.querySelector("#textStuFullname");
let selectCallingName = document.querySelector("#selectCallingName");
let textStuNic = document.querySelector("#textStuNic");
let dateDob = document.querySelector("#dateDob");
let textStuAge = document.querySelector("#textStuAge");
let radioMale = document.querySelector("#radioMale");
let radioFemale = document.querySelector("#radioFemale");
let textMobileWhatsApp = document.querySelector("#textMobileWhatsApp");
let selectStuStatus = document.querySelector("#selectStuStatus");
let formStudent = document.querySelector("#formStudent");
let btnAddStudent = document.querySelector("#btnAddStudent");
let divStudentBatches = document.getElementById("divStudentBatches");

let selectTeacher = document.getElementById("selectTeacher");
let selectSubject = document.getElementById("selectSubject");
let selectRegType = document.getElementById("selectRegType");

let selectPaymentMethod = document.getElementById("selectPaymentMethod");

// stepper eke current step track karanna variable ekak
let currentStep = 1;

// next button logic handle karanawa
const goNext = () => {
    // step 1 idan step 2 ta enakota
    if (currentStep == 1) {
        // step 2 data load karanawa
        loadStep2StudentData();
    }
    if (currentStep == 2) {
        loadStep3StudentData();
    }
    // max step count eka 3
    if (currentStep < 3) {
        // next step ekata yawanawa
        showStep(currentStep + 1);
    }
}

// back button logic handle karanawa
const goBack = () => {
    if (currentStep > 1) {
        showStep(currentStep - 1); // previous step ekata yanna
    }
}

// step indicator colors update karana function eka
const updateStepUI = () => {

    // okkoma step elements loop karanawa
    document.querySelectorAll(".step").forEach((stepEl, index) => {
        // step number calculate karanawa (1,2,3)
        let stepNo = index + 1;

        // old classes remove karanawa
        stepEl.classList.remove("active", "completed");

        // previous steps completed widiyata mark karanawa
        if (stepNo < currentStep) {
            stepEl.classList.add("completed");
        }

        // current step active widiyata mark karanawa
        if (stepNo === currentStep) {
            stepEl.classList.add("active");
        }
    });
}

// step change karana main function eka
const showStep = (step) => {

    currentStep = step; // current step update karanawa

    // okkoma step content hide karanawa
    document.querySelectorAll(".step-content").forEach(el => {
        el.classList.add("d-none");
    });

    // step 1 show karanawa
    document.querySelector("#step1Form").classList.toggle("d-none", step !== 1);

    // step 2 show karanawa
    document.querySelector("#step2Form").classList.toggle("d-none", step !== 2);

    // step 3 show karanawa
    document.querySelector("#step3Form").classList.toggle("d-none", step !== 3);

    // step UI colors update karanawa (active / completed)
    updateStepUI();
}

// student modal open karanna function eka
const openStudentModal = () => {

    // Show modal
    $("#studentModal").modal("show");
    $("#studentModal").on("shown.bs.modal", function () {
        loadQuickStudentForm();
    });
}



// student object (data binding walata)
student = {};

// guardian list load karanawa
const guardians = getDataAjaxGetRequest("/guardian/alldata");


// Guardian NIC input ekata adala details load karana reusable function eka
const loadGuardian = () => {

    // Guardian NIC input field eke value eka trim karala gannawa
    const nic = textGuardianFilterNic.value.trim();

    // 1.NIC empty nam (user clear karoth)
    if (nic.length === 0) {

        // Guardian details div eka hide karanawa
        divGuardian.style.display = "none";

        // Guardian related input fields clear karanawa
        textGuardianName.value = "";
        textGuardianMobile.value = "";
        selectGuardianType.value = "";
        textGuAddress.value = "";
        selectGuardianStatus.value = "";

        // Student auto-filled address & mobile clear karanawa
        textStuAddress.value = "";
        textMobileWhatsApp.value = "";

        // Default border style reset karanawa
        textStuAddress.style.border = "1.5px solid rgb(164, 201, 232)";
        textMobileWhatsApp.style.border = "1.5px solid rgb(164, 201, 232)";

        // Student object eke guardian reference eka clear karanawa
        student.guardianId = null;

        // Function eka stop karanawa
        return;
    }

    // 2️.NIC length 10 ta wada adu nam function eka stop
    if (nic.length < 10) return;

    // 3️.Guardians array eke NIC eka match karala guardian hoyagannawa
    const guardianData = guardians.find(g => g.nic === nic);

    // 4️.Guardian hamba wenne naththam
    if (!guardianData) {

        // Guardian div eka hide karanawa
        divGuardian.style.display = "none";

        // Student guardian reference eka clear karanawa
        student.guardianId = null;

        // Function eka stop karanawa
        return;
    }
    // 5️.Guardian hamba unoth guardian div eka show karanawa
    divGuardian.style.display = "block";

    // Student object eke guardian foreign key eka set karanawa
    student.guardian_id = { id: guardianData.id };

    // 6️. Student Address auto-fill + bind
    if (guardianData.address) {

        // UI eke address fill karanawa
        textStuAddress.value = guardianData.address;

        // Student object ekata address bind karanawa
        student.address = guardianData.address;

        // Green border danna
        textStuAddress.style.border = "2px solid green";

    } else {

        // Address naththam UI eka clear karanawa
        textStuAddress.value = "";

        // Student object eka clear karanawa
        student.address = null;

        // Default border danna
        textStuAddress.style.border = "1.5px solid rgb(164, 201, 232)";
    }

    // User manual edit karoth student.address update wenna
    textStuAddress.oninput = () => {
        student.address = textStuAddress.value;
    }

    // 7️.Student Mobile (WhatsApp) auto-fill + bind
    if (guardianData.mobileno) {

        // UI eke mobile fill karanawa
        textMobileWhatsApp.value = guardianData.mobileno;

        // Student object ekata mobile bind karanawa
        student.whatsapno = guardianData.mobileno;

        // Green border danna
        textMobileWhatsApp.style.border = "2px solid green";

    } else {

        // Mobile naththam UI eka clear karanawa
        textMobileWhatsApp.value = "";

        // Student object clear karanawa
        student.whatsapno = null;

        // Default border danna
        textMobileWhatsApp.style.border = "1.5px solid rgb(164, 201, 232)";
    }

    // User manual edit karoth student.whatsapno update wenna
    textMobileWhatsApp.oninput = () => {
        student.whatsapno = textMobileWhatsApp.value;
    }

    // 8️.Guardian personal details fill karanawa (read-only)
    textGuardianName.value = guardianData.guardianname;
    textGuardianMobile.value = guardianData.mobileno;
    textGuAddress.value = guardianData.address;

    // 9️. Guardian Type handling (Other support)
    if (guardianData.guardiantype_id) {
        selectGuardianType.value =
            (guardianData.guardiantype_id.name === "Other" && guardianData.otherguardian)
                ? guardianData.otherguardian
                : guardianData.guardiantype_id.name;
    } else {
        selectGuardianType.value = "";
    }

    // 10. Guardian Status handling (Other support)
    if (guardianData.guardianstatus_id != null) {
        selectGuardianStatus.value = guardianData.guardianstatus_id.name;
    } else {
        selectGuardianStatus.value = "";
    }

}
const displayAddNewGuardain = () => {
    divNewGuardianForm.style.display = "block";
}

//define  function for student form error check
const checkQuickStudentFormError = () => {
    let errors = ""; // errors collect karanna empty string ekak hadanawa

    if (!student.guardian_id || !student.guardian_id.id) {
        errors += "Please enter valid Guardian NIC. This is a required field. <br>";
        textGuardianFilterNic.style.border = "1px solid red";
    }

    // Student Name check
    if (student.fullname == null) {
        errors += "Please enter valid Student Full name. This is a required field. <br>";
        textStuFullname.style.border = "1px solid red"; // input field red border
    }
    // Calling name check
    if (student.callingname == null) {
        errors += "Please enter Calling Name. This is a required field. <br>";
        selectCallingName.style.border = "1px solid red";
    }

    // Date of Birth check
    if (student.dob == null) {
        errors += "Please enter Date of Birth. This is a required field. <br>";
        dateDob.style.border = "1px solid red";
    }
    // Gender check
    if (student.gender == null) {
        errors += "Please select Gender. This is a required field. <br>";
    }

    // school name check
    if (student.schoolname == null) {
        errors += "Please enter valid School name. This is a required field. <br>";
        textStuSchool.style.border = "1px solid red";
    }
    return errors; // return all errors
}

// define method for student form submission
const buttonStudentSubmit = () => {
    console.log(student);
    //call common submit function
    submitWithConfirm(checkQuickStudentFormError, student, "/student/insert", () => {
        // success → reset form 
        loadQuickStudentForm();

        students = getDataAjaxGetRequest("/student/alldata");

        // step 1 ta yanna
        showStep(1);

        // modal eka close karanna
        $("#studentModal").modal("hide");

    });
}

// student form refresh karana function
const loadQuickStudentForm = () => {

    // form eka reset karanna (input fields wala thibuna values okkoma clear wenawa)
    formStudent.reset();

    // aluth empty object hadanna → data binding walata use karanna
    student = new Object();
    // mokadda - valid value tika collect karala backend ekata pass karanna ona
    // ekka ekka pass karanawa wada object eka pass karanna lesi

    // Male select wela nam
    radioMale.addEventListener("change", () => {
        if (radioMale.checked) student.gender = "Male";
    });

    // Female select wela nam
    radioFemale.addEventListener("change", () => {
        if (radioFemale.checked) student.gender = "Female";
    });


    textGuardianFilterNic.disabled = false;
    divGuardian.style.display = "none";

    // current date eka gannawa
    let today = new Date();

    // student ta maximum age eka 18 nisa
    // minimum DOB eka hadanawa
    let minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    // student ta minimum age eka 12 nisa
    // maximum DOB eka hadanawa
    let maxDate = new Date(today.getFullYear() - 12, today.getMonth(), today.getDate());

    // date format eka YYYY-MM-DD widihata convert karanawa
    let minDob = minDate.toISOString().split('T')[0];
    let maxDob = maxDate.toISOString().split('T')[0];

    // date input ekata limits set karanawa
    // 12–18 age students lata witharak date select karanna puluwan
    dateDob.min = minDob;
    dateDob.max = maxDob;


    // student status default set karanna
    student.studentstatus_id = { id: 1, name: "Active" };

    // form eke tiyena input, select, radio okkoma border colour / UI reset karanawa
    setUIColour([textGuardianFilterNic, textStuFullname, selectCallingName, textStuNic, dateDob, textStuAge, radioFemale, radioMale, textMobileWhatsApp, textStuLandno, textStuAddress, textStuSchool]);


}


// Student No input ekata adala details load karana reusable function eka
const loadStudent = () => {

    let students = getDataAjaxGetRequest("/student/alldata");

    // Input field eke value trim karala gannawa
    const regno = textStuNoFilter.value.trim();

    // Student view reset karana reusable function eka
    const resetView = () => {
        divStudentPhoto.style.display = "none";
        divButtonView.style.display = "none";
        btnViewStudent.style.display = "none";
        btnAddStudent.disabled = false;

        // selected student clear karanawa
        student = null;
    };

    // RegNo hariyata 9 characters naththam, photo & name hide karanawa
    if (regno.length !== 9) {
        resetView();
        return;
    }

    // Student array eke regno ekata match karala student gannawa
    const studentData = students.find(s => s.regno === regno);

    // Student hamba wenne naththam
    if (!studentData) {
        resetView();
        return;
    }

    // Student hamba unoth calling name & photo display karanawa
    pCallingName.innerText = studentData.callingname;
    divButtonView.style.display = "block";

    if (studentData.photo != null) {
        imgPhoto.src = atob(studentData.photo);
    } else {
        // Default image
        imgPhoto.src = "images/studenticon.jpg";
    }

    // FIX: show as flex because photo + name same row
    divStudentPhoto.style.display = "flex";

    // Show the "View more" button
    btnViewStudent.style.display = "inline-block";

    // Backend use ekata selected student set karanawa (DIRECT USE)
    student = studentData;

    // Student details modal fields load karanawa (modal not shown yet)
    tdStudentNo.innerText = student.regno;
    tdFullName.innerText = student.fullname;
    tdCallingName.innerText = student.callingname;
    tdNic.innerText = student.nic;
    tdDob.innerText = student.dob;
    tdGender.innerText = student.gender;
    tdAddress.innerText = student.address;
    tdMobile.innerText = student.whatsapno;
    tdSchool.innerText = student.schoolname;
    tdStudentStatus.innerText = student.studentstatus_id.name;

    // Guardian details
    if (student.guardian_id) {
        tdGuardianName.innerText = student.guardian_id.guardianname;
    }

    // success border show karanawa
    //textStuNoFilter.style.border = "2px solid green";
    btnAddStudent.disabled = true;


    loadRegisteredBatches(student.id);
}

// Button click event to show modal
btnViewStudent.onclick = () => {
    if (student) {
        $("#modalStudentDetail").modal("show");
    }
}

// student id ekata adala registered batches load karanawa
const loadRegisteredBatches = (studentId) => {

    // backend API call karala data gannawa
    const data = getDataAjaxGetRequest(`/batch/registeredbatches?studentId=${studentId}`);

    console.log("BATCH DATA:", data);

    // previous data clear karanawa
    divStudentBatches.innerHTML = "";

    // data thiyenawanam display karanawa
    if (data && data.length > 0) {

        data.forEach(batch => {


            // each batch ekata separate line create karanawa
            const div = document.createElement("div");

            // bold text set karanawa
            div.style.fontWeight = "bold";

            // batch name set karanawa
            div.innerText = batch.batchname;

            // UI ekata add karanawa
            divStudentBatches.appendChild(div);
        });

    } else {

        // no batches message
        divStudentBatches.innerHTML = "<span class='text-muted'>No Registered Batches</span>";
    }
}



/* ##################################################### */
/* #################  Stepper 2 start ################## */

let registration = {
    registrationHasBatchList: []
};

// step 2 student details & registered batches load karana function eka
const loadStep2StudentData = () => {

    // student object eka null / undefined nam function eka stop karanawa
    if (!student || !student.id) {
        console.log("Student not selected");
        return;
    }

    // selected student bind karanawa
    registration.student_id = student;

    // inner batch rows store karanna empty array ekak
    registration.registrationHasBatchList = [];

    // student full name display karanawa
    h4Step2StudentFullname.innerText = student.fullname;

    // student registration number display karanawa
    h6Step2StudentNo.innerText = "Student No : " + student.regno;

    // old registered batch data clear karanawa
    divStep2RegisteredBatches.innerHTML = "";

    // backend eke registered batches gannawa
    let batches = getDataAjaxGetRequest(`/batch/registeredbatches?studentId=${student.id}`
    );

    // registered batches naththam message ekak pennanawa
    if (!batches || batches.length === 0) {
        divStep2RegisteredBatches.innerHTML = `<div class="text-muted"> No Registered Classes </div>`;

    } else {
        // registered batches loop karanawa
        batches.forEach(batch => {
            // batch ekata div ekak hadanawa
            let div = document.createElement("div");

            // bootstrap styles add karanawa
            div.className = "border rounded p-2 mb-2";

            // batch name display karanawa
            div.innerHTML = ` <div class="fw-bold">${batch.batchname}</div>`;

            // UI ekata append karanawa
            divStep2RegisteredBatches.appendChild(div);

        });

    }

    loadRegInnerFormAndTable();

}

const loadRegInnerFormAndTable = () => {
    //refersh batch registration form 
    registrationBatch = new Object;

    let currentBatchList = registration.registrationHasBatchList;

    // grade list load karanawa
    let grades = getDataAjaxGetRequest("/grade/alldata");
    loadSelectOptions(selectGrade, grades, "Select Grade...!", "name");

    selectGrade.addEventListener("change", () => {

        let grade = JSON.parse(selectGrade.value);
        // selected grade ekata adala subjects gannawa
        let subjectdetails = getDataAjaxGetRequest(`/subjectdetail/bygrade/${grade.id}`);

        // subject dropdown eka load karanawa
        loadSelectOptions(selectSubject, subjectdetails, "Select Subject...!", "name");
    });

    selectSubject.addEventListener("change", () => {

        let grade = JSON.parse(selectGrade.value);
        let subject = JSON.parse(selectSubject.value);
        // selected grade saha subject ekata adala teachers gannawa
        let teachers = getDataAjaxGetRequest(`/teacher/bygradesubject/${grade.id}/${subject.id}`);

        // teacher dropdown eka load karanawa
        loadSelectOptions(selectTeacher, teachers, "Select Teacher...!", "fullname");
    });


    // registration type list load karanawa
    let regtypes = getDataAjaxGetRequest("/regtype/alldata");
    loadSelectOptions(selectRegType, regtypes, "Select Reg-Type...!", "name");

    // form eke tiyena input, select, radio okkoma border colour / UI reset karanawa
    setUIColour([selectGrade, selectBatch, selectSubject, selectTeacher, selectRegType]);

    let displayInnerColumns = [
        { property: getInnerBatch, dataType: "function" },
        { property: getInnerRegType, dataType: "function" },
        { property: getInnerBatchFee, dataType: "function" },
    ];

    // Call reusable table data fill function
    loadTableDataInner1(tbodyRegistration, currentBatchList, displayInnerColumns, deleteRegistration);

    // total batch fee calculate
    let totalBatchFee = 0;

    registration.registrationHasBatchList.forEach(regbatch => {

        if (regbatch.regtype_id.name === "Free") {
            totalBatchFee += 0;
        } else {
            totalBatchFee += parseFloat(regbatch.batch_id.monthfee || 0);
        }

    });

    // textbox ekata value set karanawa
    textTotalBatchFee.value = totalBatchFee.toFixed(2);

    // student admission status eka gannawa
    let status = getDataAjaxGetRequest(`/studentpayment/checkadmissionstatus?studentId=${student.id}`);

    // admission fee set karanawa
    if (status > 0) {
        textAdmissionFee.value = "0.00";
    } else {
        textAdmissionFee.value = "500.00";
    }


    // grand total calculate karanawa
    textGrandTotal.value = (parseFloat(textTotalBatchFee.value) + parseFloat(textAdmissionFee.value)).toFixed(2);

    if (registration.registrationHasBatchList.length > 0) {
        textTotalBatchFee.style.border = "2px solid green";
        textAdmissionFee.style.border = "2px solid green";
        textGrandTotal.style.border = "2px solid green";
    } else {
        setUIColour([textTotalBatchFee, textAdmissionFee, textGrandTotal]);
    }
}

// teacher change unama
// selected grade + subject + teacher + student ekata adala batches gannawa
selectTeacher.addEventListener("change", () => {

    let regbatches = [];

    if (selectGrade.value != "" && selectSubject.value != "" && selectTeacher.value != "") {

        let grade = JSON.parse(selectGrade.value);
        let subject = JSON.parse(selectSubject.value);
        let teacher = JSON.parse(selectTeacher.value);

        // selected student already register wela nathi batches witharai gannawa
        regbatches = getDataAjaxGetRequest(
            `/batch/availablebatches?gradeId=${grade.id}&subjectId=${subject.id}&teacherId=${teacher.id}&studentId=${student.id}`
        );
    }
    // Stepper table ekata add karapu batches remove
    regbatches = regbatches.filter(batch =>
        !registration.registrationHasBatchList.some(reg =>
            reg.batch_id.id === batch.id
        )
    );

    // batch dropdown eka load karanawa
    loadSelectOptions(selectBatch, regbatches, "Select Batch...!", "batchname");

});
const genareteRegFree = () => {
    if (registrationBatch.regtype_id.name == "Free") {
        registrationBatch.regfee = 0;
    } else {
        registrationBatch.regfee = registrationBatch.batch_id.monthfee;
    }

}

const registrationBatchesSubmit = () => {


    //registrationBatch eka main registration object ekata danna
    registration.registrationHasBatchList.push(registrationBatch);
    console.log(registration);
    loadRegInnerFormAndTable();


}
//get batchnames
const getInnerBatch = (dataOb) => {
    return dataOb.batch_id.batchname;
}

//get reg tpe
const getInnerRegType = (dataOb) => {
    return dataOb.regtype_id.name;
}

//get batchnames
const getInnerBatchFee = (dataOb) => {
    return dataOb.batch_id.monthfee;
}

const deleteRegistration = (dataOb, rowIndex) => {
    // table eke athi data registrationHasBatchList eken remove
    registration.registrationHasBatchList.splice(rowIndex, 1);
    // table refresh
    loadRegInnerFormAndTable();
}

/* // define function for registration form validation
const checkRegistrationFormError = () => {
    let errors = "";
    if (registration.registrationHasBatchList.length == 0) {
        errors = errors + "Please add at least one batch registration.<br>";
    }
    return errors;
} */

// define function for registration submission
const buttonRegistrationSubmit = () => {

    // save karana registrations store karanna array ekak hadanawa
    let registrationList = [];

    // registrationHasBatchList eke athi batch tika loop karanawa
    registration.registrationHasBatchList.forEach(regBatch => {

        // student registration object eka hadanawa
        let studentregistration = new Object();

        // selected student assign karanawa
        studentregistration.student_id = registration.student_id;

        // selected batch assign karanawa
        studentregistration.batch_id = regBatch.batch_id;

        // selected registration type assign karanawa
        studentregistration.regtype_id = regBatch.regtype_id;

        // registration fee assign karanawa
        studentregistration.regfee = regBatch.regfee;

        // default registration status assign karanawa
        studentregistration.studentregstatus_id = { id: 1 };

        // object eka array ekata add karanawa
        registrationList.push(studentregistration);
    });
    console.log(registrationList);

    // registration list eka save karanawa
    submitWithConfirm(() => "", registrationList, "/studentregistration/insert", () => {
        // success unoth 
        // step 2 eka refresh karanawa
        loadStep2StudentData();
        // next step ekata yanawa
        goNext();

    }
    );

}
/* #################  Stepper 2 end   ################## */
/* ##################################################### */



/* ##################################################### */
/* #################  Stepper 3 start ################## */

// global object for payment data binding
studentpayment = {};


const loadStep3StudentData = () => {

    // if no student selected → stop function
    if (!student) return;

    // set student name in UI
    document.getElementById("h4Step3StudentFullname").innerText = student.fullname;

    // set student registration number in UI
    document.getElementById("h6Step3StudentNo").innerText =
        "Student No : " + student.regno;

    // set student photo (base64 or default image)
    const img = document.getElementById("imgStep3StudentPhoto");

    if (student.photo) {
        // base64 image fix (DO NOT use atob)
        img.src = "data:image/jpeg;base64," + student.photo;
    } else {
        // default image
        img.src = "images/studenticon.jpg";
    }

    // reset payment object before loading table
    studentpayment = {};

    // load payment table data
    loadPaymentTable();

    // get payment methods from backend (safe fallback array)
    let payamentmethods =
        getDataAjaxGetRequest("/paymentmethod/alldata") ?? [];

    // fill payment method dropdown
    loadSelectOptions(
        selectPaymentMethod,
        payamentmethods,
        "Select Payment Method...!",
        "name"
    );
}

const getBatch = (dataOb) => {
    return dataOb?.batch_id?.batchname ?? "Admission";
}

const getBatchFee = (dataOb) => {
    return dataOb.regfee;
}
// get status
const getStatus = (dataOb) => {
    return dataOb.isPaid ? `<span class="text-success">Paid</span>` : `<span class="text-danger">Unpaid</span>`;
}

//define getCheckbox function
const getCheckbox = (dataOb) => {
    let fee = dataOb.regfee;
    return `<input type="checkbox" class="payment-checkbox custom-checkbox"  value="${fee}" onchange="calculateTotal()">`;
}

// balance amount eka calculate karana function eka
const calculateQuickBalanceAmount = () => {

    // total fee value eka gannawa
    let totalamount = parseFloat(textTotalFee.value) || 0;

    // paid amount value eka gannawa
    let paidamount = parseFloat(textPaidAmount.value) || 0;

    // balance amount eka calculate karanawa
    let balanceAmount = totalamount - paidamount;

    // balance amount field ekata set karanawa
    textBalance.value = balanceAmount.toFixed(2);

    // balance amounfield eka green border ekak dānawa
    textBalance.style.border = "2px solid green";

    // bind to object
    studentpayment.balanceamount = balanceAmount;

}

// define calculateTotal
const calculateTotal = () => {

    // total amount eka store karaganna variable ekak hadanawa
    let total = 0;

    // tick karapu payment check box okkogema value gannawa
    document.querySelectorAll('.payment-checkbox:checked').forEach(checkbox => {
        // checkbox value eka total ekata ekathu karanawa
        total += parseFloat(checkbox.value) || 0;
    });
    // total fee text field eka thiyenawanam
    if (textTotalFee) {
        // total amount eka decimal places 2k ekka display karanawa
        textTotalFee.value = total.toFixed(2);
        // total fee field eka green border ekak dānawa
        textTotalFee.style.border = "2px solid green";

        // bind to object
        studentpayment.totalamount = total;

    }
}

const loadPaymentTable = () => {

    // get only selected student payment details
    let registrations = getDataAjaxGetRequest("/studentregistration/bystudent?studentId=" + student.id);

    // define columns for reusable table function
    let displayColumns = [
        { property: getBatch, dataType: "function" },
        { property: getBatchFee, dataType: "function" },
        { property: getStatus, dataType: "function" },
        { property: getCheckbox, dataType: "function" }
    ];

    // call reusable table builder function
    loadTableDataInner(tbodyPayment, registrations, displayColumns);
}

// define function for payment submission
const buttonPaymentsSubmit = () => {

    // save karana payments store karanna array ekak hadanawa
    let paymentList = [];

    // tick karapu checkbox walin registrations gannawa
    document.querySelectorAll('.payment-checkbox:checked').forEach(checkbox => {

        // row eka gannawa (table row context eka)
        let row = checkbox.closest("tr");

        // single student payment object eka hadanawa
        let studentpayment = new Object();

        // selected student assign karanawa
        studentpayment.student_id = student;

        // registration id eka row eken gannawa (data-id danna ona table eke)
        studentpayment.studentregistration_id = row.dataset.id;

        // selected payment method assign karanawa
        studentpayment.paymentmethod_id = JSON.parse(selectPaymentMethod.value);

        // fee eka checkbox value eken gannawa
        let fee = parseFloat(checkbox.value) || 0;

        // total / paid / balance set karanawa
        studentpayment.totalamount = fee;
        studentpayment.paidamount = fee;
        studentpayment.balanceamount = 0;

        studentpayment.paymentcategory_id = { id: 2 }; // Monthly Fee
        studentpayment.paymentmode_id = { id: 2 };     // Physical


        // object eka list ekata add karanawa
        paymentList.push(studentpayment);
    });

    console.log(paymentList);


    // payment list eka backend ekata save karanawa
    submitWithConfirm(() => "", paymentList, "/studentpayment/insert", () => {
        // success unoth step refresh karanawa
        loadStep3StudentData();
        // next step ekata yanawa
        goNext();
    }
    );
}
/* #################  Stepper 3 end   ################## */
/* ##################################################### */



// ##################################################
// ################## validation   ##################
// ##################################################

//fullname validatation
const textFullnameValidator = () => {

    // input eke fullname value gannawa
    let fullname = textStuFullname.value;

    // regex pattern define karanawa
    let regPattern = new RegExp("^([A-Z][a-z]{2,20}(\\s)){1,20}([Dd]e\\s)?([A-Z][a-z]{2,20})$");
    // regex pattern:
    // ^ → string eka start wenna one
    // ([A-Z][a-z]{2,20}(\\s)){1,20} → first name(s) capital letter + simple letters, 1–20 words + space
    // ([Dd]e\\s)? → middle name "de" ekak thiyenawanam allow karanawa, optional
    // ([A-Z][a-z]{2,20}) → last name capital letter + simple letters
    // $ → string eka end wenna one

    // fullname valid nam
    if (regPattern.test(fullname)) {

        textStuFullname.style.border = '2px solid green';
        student.fullname = fullname; // data bind karanawa

        // calling name dropdown clear karanawa
        selectCallingName.innerHTML = "";

        // default option set karanawa
        let optionMsg = document.createElement("option");
        optionMsg.selected = "selected";
        optionMsg.disabled = "disabled";
        optionMsg.value = "";
        optionMsg.innerText = "Select Calling Name..!";
        selectCallingName.appendChild(optionMsg);

        // fullname split karala dropdown options hadanawa
        let nameParts = fullname.split(" ");

        nameParts.forEach(namePart => {
            let option = document.createElement("option");
            option.value = namePart;
            option.innerText = namePart;
            selectCallingName.appendChild(option);
        });
    } else {
        // invalid nam red border
        textStuFullname.style.border = '2px solid red';
    }
}
// calling name validator
const callingNameValidator = () => {

    // dropdown value gannawa
    const callingname = selectCallingName.value;

    if (callingname) {
        selectCallingName.style.border = '2px solid green';
        student.callingname = callingname;
    } else {
        selectCallingName.style.border = '2px solid red';
        student.callingname = null;
    }
}
//student nic validator
const textStuNicValidator = () => {

    // NIC input value gannawa
    let nic = textStuNic.value;

    // ONLY new NIC allow karanawa (12 digits)
    let regPattern = new RegExp("^[0-9]{12}$");

    // NIC empty naththnam + valid nam
    if (nic !== "" && regPattern.test(nic)) {

        // birth year calculate karanawa
        let birthYear = nic.substring(0, 4);

        // NIC eke day count eka gannawa
        let dayCount = nic.substring(4, 7);

        // age calculate karanawa
        let age = new Date().getFullYear() - parseInt(birthYear);

        // student age 12 – 18 between check karanawa
        if (age < 12 || age > 18) {

            alert("Student age must be between 12 and 18 years!");

            textStuNic.style.border = '2px solid red';
            textStuAge.style.border = '2px solid red';

            student.nic = null;
            student.age = null;
            student.dob = null;
            student.gender = null;
            return;
        }
        // NIC bind karanawa
        student.nic = nic;
        textStuNic.style.border = '2px solid green';

        // age field set karanawa
        textStuAge.value = age;
        textStuAge.style.border = '2px solid green';
        student.age = age;

        // manual fields disable karanawa
        dateDob.disabled = true;

        // day count convert karanawa
        let dayNumber = parseInt(dayCount);

        // gender calculate karanawa
        if (dayNumber > 500) {

            radioFemale.checked = true;
            radioMale.checked = false;

            student.gender = "Female";
            dayNumber -= 501;
        } else {
            radioMale.checked = true;
            radioFemale.checked = false;
            student.gender = "Male";
        }

        // DOB calculate karanawa
        let dob = new Date(birthYear, 0);
        dob.setDate(dayNumber);

        let formattedDOB =
            dob.getFullYear() + "-" +
            String(dob.getMonth() + 1).padStart(2, "0") + "-" +
            String(dob.getDate()).padStart(2, "0");

        dateDob.value = formattedDOB;
        dateDob.style.border = '2px solid green';

        student.dob = formattedDOB;
        return;
    }

    // NIC empty nam → manual fields enable karanawa
    if (nic === "") {

        student.nic = null;
        textStuNic.style.border = '1px solid #ccc';
        dateDob.disabled = false;
        return;
    }
    // NIC invalid nam
    textStuNic.style.border = '2px solid red';
    student.nic = null;
}
//dob validator
const dateDobValidator = () => {

    // NIC thiboth dob validation skip karanawa
    if (student.nic) return;
    let dob = dateDob.value;

    // DOB empty nam
    if (dob === "") {

        dateDob.style.border = '2px solid red';
        student.dob = null;
        return;
    }
    // birth year gannawa
    let birthYear = parseInt(dob.substring(0, 4));

    // age calculate karanawa
    let age = new Date().getFullYear() - birthYear;

    // student age 12 – 18 check karanawa
    if (age < 12 || age > 18) {

        alert("Student age must be between 12 and 18 years!");

        dateDob.style.border = '2px solid red';
        textStuAge.style.border = '2px solid red';

        student.age = null;

        return;
    }
    // valid DOB nam
    dateDob.style.border = '2px solid green';
    textStuAge.value = age;
    textStuAge.style.border = '2px solid green';

    student.dob = dob;
    student.age = age;
}
function clearPhoto() {
    // reset the image preview to default student icon
    document.getElementById("imgPhoto").src = "images/studenticon.jpg";

    // clear the file input value
    document.getElementById("filePhoto").value = "";

    // optional: clear the student object photo property if using JS object
    if (typeof student !== "undefined") {
        student.photo = null;
    }
}