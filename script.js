function getNSCScore(mark) {
    if (!Number.isFinite(mark) || mark < 0 || mark > 100) {
        return null;
    }

    const level = mark >= 80 ? 7 :
        mark >= 70 ? 6 :
        mark >= 60 ? 5 :
        mark >= 50 ? 4 :
        mark >= 40 ? 3 :
        mark >= 30 ? 2 : 1;

    return { level: level, points: level };
}

const screen1 = document.getElementById("screen1");
const screen2 = document.getElementById("screen2");
const startButton = document.getElementById("startButton");

startButton.addEventListener("click", function () {
    screen1.classList.add("screen-hidden");
    screen2.classList.remove("screen-hidden");
});

const screen3 = document.getElementById("screen3");
const highSchoolButton = document.getElementById("highSchoolButton");

highSchoolButton.addEventListener("click", function () {
    screen2.classList.add("screen-hidden");
    screen3.classList.remove("screen-hidden");
});

const exploreButton = document.getElementById("exploreButton");
if (exploreButton) exploreButton.addEventListener("click", function () {
    const opts = Array.from(document.querySelectorAll(".career-option"));
    const saved = opts.map(o => o.checked);
    const other = document.getElementById("otherCareerOption");
    const input = document.getElementById("otherCareerInput");
    if (opts.some(o => o.checked) || (other && other.checked) || (input && input.value.trim())) {
        document.getElementById("results").innerHTML = "<p>Career selected. Remove your selected career to use Explore, or press Check My Options to view courses for your chosen career.</p>";
        return;
    }
    opts.forEach(o => { o.checked = o.value !== "__other__"; });
    document.getElementById("screen3").style.display = "none";
    document.getElementById("universityScreen").style.display = "block";
    compareStudyOptions();
    opts.forEach((o,i) => { o.checked = saved[i]; });
});
const checkOptionsButton = document.getElementById("checkOptionsButton");

checkOptionsButton.addEventListener("click", function () {

const grade = document.getElementById("grade").value;

if (!grade) {
    alert("Grade is compulsory. Please select your grade.");
    return;
}

const subject1 = document.getElementById("subject1").value;

const subject2 = document.getElementById("subject2").value;

const subject3 = document.getElementById("subject3").value;

const subject4 = document.getElementById("subject4").value;

const subject5 = document.getElementById("subject5").value;

const subject6 = document.getElementById("subject6").value;

const subject7 = document.getElementById("subject7").value;

const subject8 = document.getElementById("subject8").value;

const mark1 = Number(document.getElementById("mark1").value);

const mark2 = Number(document.getElementById("mark2").value);

const mark3 = Number(document.getElementById("mark3").value);

const mark4 = Number(document.getElementById("mark4").value);

const mark5 = Number(document.getElementById("mark5").value);

const mark6 = Number(document.getElementById("mark6").value);

const mark7 = Number(document.getElementById("mark7").value);

const mark8 = Number(document.getElementById("mark8").value);

const career = Array.from(document.querySelectorAll(".career-option:checked"))
    .filter(option => option.value !== "__other__")
    .map(option => option.value)
    .concat(otherCareers, document.getElementById("otherCareerInput").value.trim())
    .filter(Boolean)
    .join(", ");

if (!career) {
    alert("Please select a career.");
    return;
}

const allSubjects = [];

for (let i = 1; i <= 8; i++) {
    const subject = document.getElementById("subject" + i).value;
    const markInput = document.getElementById("mark" + i);

    if (subject) {
        allSubjects.push({
            name: subject,
            mark: Number(markInput.value),
            markEntered: markInput.value !== ""
        });
    }
}

document.querySelectorAll(".extra-subject-row").forEach(function (row) {
    const subject = row.querySelector(".extra-subject-select").value;
    const markInput = row.querySelector(".extra-subject-mark");

    if (subject) {
        allSubjects.push({
            name: subject,
            mark: Number(markInput.value),
            markEntered: markInput.value !== ""
        });
    }
});

let result = `Grade: ${grade}<br>Career interest: ${career}<br>` +
    '<table class="subject-results-table" style="width:100%;border-collapse:collapse;margin-top:12px;">' +
    '<thead><tr>' +
    '<th style="border:1px solid #888;padding:8px;text-align:left;">Subject</th>' +
    '<th style="border:1px solid #888;padding:8px;">Mark</th>' +
    '<th style="border:1px solid #888;padding:8px;">NSC Level</th>' +
    '<th style="border:1px solid #888;padding:8px;">Points</th>' +
    '</tr></thead><tbody>';

let profilePoints = 0;

allSubjects.forEach(function (item) {
    const score = item.markEntered ? getNSCScore(item.mark) : null;
    if (score) profilePoints += score.points;

    result += '<tr>' +
        '<td style="border:1px solid #888;padding:8px;">' + item.name + '</td>' +
        '<td style="border:1px solid #888;padding:8px;text-align:center;">' +
        (!item.markEntered ? 'Not entered' : item.mark + '%') + '</td>' +
        '<td style="border:1px solid #888;padding:8px;text-align:center;">' +
        (score ? score.level : (item.markEntered ? 'Invalid mark' : '—')) + '</td>' +
        '<td style="border:1px solid #888;padding:8px;text-align:center;">' +
        (score ? score.points : '—') + '</td></tr>';
});

result += '<tr><th colspan="3" style="border:1px solid #888;padding:8px;text-align:right;">Total subject points</th>' +
    '<th style="border:1px solid #888;padding:8px;text-align:center;">' +
    profilePoints + '</th></tr></tbody></table>';

let bestSixSubjects = allSubjects.filter(function (item) {
    const name = item.name.trim().toLowerCase();
    return item.markEntered &&
        name !== "life orientation" &&
        getNSCScore(item.mark) !== null;
}).sort(function (a, b) {
    return getNSCScore(b.mark).points - getNSCScore(a.mark).points;
}).slice(0, 6);

let bestSixPoints = bestSixSubjects.reduce(function (total, item) {
    return total + getNSCScore(item.mark).points;
}, 0);

result += "<p><strong>Best-six subject points (excluding Life Orientation):</strong> " +
    bestSixPoints + "</p>";

let low = [];

allSubjects.forEach(function (item) {
    if (!item.markEntered) return;

    const subject = item.name;
    const mark = item.mark;

    if (mark < 50) {
        const needed = 50 - mark;
        low.push(subject + ": " + mark +
            "% - needs " + needed +
            "% improvement to reach 50% (4 points)");
    }
});



if (low.length) {
    result += "<br>Subjects needing improvement:<br>" + low.join("<br>");
}

document.getElementById("results").innerHTML = result;

document.getElementById("screen3").style.display = "none";
document.getElementById("universityScreen").style.display = "block";

document.getElementById("institutionResults").innerHTML =
    "<h3>Your Study Pathways</h3>" +
    "<p>Grade: " + grade + "</p>" +
    "<p>Preferred career: " + career + "</p>" +

    (low.length
        ? "<h4>Subjects to Improve</h4><p>" + low.join("<br>") + "</p>"
        : "<p>Your profile has no subjects below 50%. Course-specific requirements still need to be checked.</p>") +
    "<p>University and TVET College options will be compared here.</p>";

compareStudyOptions();

});

function compareStudyOptions() {
    const results = document.getElementById("institutionResults");
    const careers = [];
    const chosenCareers = Array.from(
        document.querySelectorAll(".career-option:checked")
    );
    const otherSelected = document.getElementById("otherCareerOption").checked;

    chosenCareers.forEach(function (option) {
        if (option.value !== "__other__") {
            careers.push(option.value);
        }
    });

    if (otherSelected) {
        const pending = document.getElementById("otherCareerInput").value.trim();

        if (pending) {
            if ([...careers, ...otherCareers].some(c => c.trim().toLowerCase() === pending.toLowerCase())) {
                results.innerHTML = "<p>That career is already selected. Please choose a different career.</p>";
                return;
            }
            if (careers.length + otherCareers.length >= 5) {
                results.innerHTML = "<p>Maximum of five careers selected. Press Enter to save careers before searching.</p>";
                return;
            }
            otherCareers.push(pending);
            document.getElementById("otherCareerInput").value = "";
            renderOtherCareers();
        }

        if (otherCareers.length === 0) {
            results.innerHTML = "<p>Please type a career under Other.</p>";
            return;
        }

        careers.push(...otherCareers);
    }

    if (new Set(careers.map(function (career) {
        return career.toLowerCase();
    })).size !== careers.length) {
        results.innerHTML = "<p>You have selected the same career more than once. Please remove the duplicate.</p>";
        return;
    }

    const subjects = [];

    for (let i = 1; i <= 8; i++) {
        const subjectEl = document.getElementById("subject" + i);
        const markEl = document.getElementById("mark" + i);

        if (subjectEl && markEl && subjectEl.value.trim() &&
            markEl.value !== "") {
            subjects.push({
                name: subjectEl.value.trim(),
                mark: Number(markEl.value)
            });
        }
    }

    document.querySelectorAll(".extra-subject-row")
        .forEach(function (row) {
            const subjectEl = row.querySelector(".extra-subject-select");
            const markEl = row.querySelector(".extra-subject-mark");

            if (subjectEl && markEl && subjectEl.value.trim() &&
                markEl.value !== "") {
                subjects.push({
                    name: subjectEl.value.trim(),
                    mark: Number(markEl.value)
                });
            }
        });

    let subjectsHTML = "";

    subjects.forEach(function (item) {
        const score = getNSCScore(item.mark);

        if (!score) {
            subjectsHTML += "<li>" + item.name +
                ": Invalid mark. Enter a value from 0 to 100.</li>";
            return;
        }

        subjectsHTML += "<li>" + item.name + ": " +
            item.mark + "% — NSC Level " + score.level +
            " — " + score.points + " point(s)</li>";
    });

    if (!subjectsHTML) {
        subjectsHTML = "<li>No subjects or marks entered.</li>";
    }

    const courses = [
        {
            career: "Information Technology",
            name: "Diploma in Information Technology (Standard)",
            type: "University",
            institution: "Mangosuthu University of Technology (MUT)",
            requirements: [
                "English Home Language Level 3 OR English First Additional Language Level 3.",
                "Mathematics Level 3 OR Mathematical Literacy Level 5.",
                "Minimum 24 points from the best six subjects, excluding Life Orientation and including English and Mathematics/Mathematical Literacy.",
                "Selection and ranking may apply; meeting minimum requirements does not guarantee admission."
            ],
            assessmentMode: "configured",
            eligibilityRules: [
                { label: "English", options: [
                    { subject: "English Home Language", minimum: 40 },
                    { subject: "English First Additional Language", minimum: 40 }
                ]},
                { label: "Mathematics or Mathematical Literacy", options: [
                    { subject: "Mathematics", minimum: 40 },
                    { subject: "Mathematical Literacy", minimum: 60 }
                ]}
            ],
            additionalChecks: [
                "At least 24 points from the best six subjects, excluding Life Orientation. The app does not yet calculate MUT's official points."
            ],
            duration: "3 years, full-time.",
            fees: "2026 MUT module-price estimate (ZAR). Software Development: Year 1 ISYS100 R8,420 + DSOF100 R7,570 + TPRO100 R6,450 + SSOF100 R6,820 = R29,260. Year 2 ISYS200 R6,820 + ITSL200 R7,620 + DSOF200 R6,820 + TPRO200 R6,440 = R27,700. Year 3 ISYS300 R7,470 + DSOF300 R6,440 + ITNP300 R6,440 + IDSE300 R4,080 = R24,430. Estimated 3-year total: R81,390. Communication Networks: Year 1 R29,260; Year 2 CNET200 R6,820 + IMTS200 R7,620 + DTRS200 R6,820 + ITCS200 R6,820 = R28,080; Year 3 CNET300 R6,820 + DTRS300 R6,820 + ITCS300 R6,820 + IEXP300 R4,080 = R24,540. Estimated 3-year total: R81,880. These are our calculations from MUT's published 2026 module prices, not official programme totals. Other charges, repeated modules and future price changes may affect the final cost. Please verify with MUT.",
            feeSource: "https://www.mut.ac.za/wp-content/uploads/2026/01/2026-FEES-PER-MODULE.pdf",
            source: "https://www.mut.ac.za/faculty-of-applied-and-health-sciences/department-of-information-and-communication-technology/"
        },
        {
            career: "Information Technology",
            name: "Diploma in Information Technology (Extended Curriculum Programme)",
            type: "University",
            institution: "Mangosuthu University of Technology (MUT)",
            requirements: [
                "English Home Language Level 3 OR English First Additional Language Level 3.",
                "Mathematics Level 2 OR Mathematical Literacy Level 3.",
                "Minimum 23 points from the best six subjects, excluding Life Orientation and including English and Mathematics/Mathematical Literacy.",
                "Selection and ranking may apply; meeting minimum requirements does not guarantee admission."
            ],
            assessmentMode: "configured",
            eligibilityRules: [
                { label: "English", options: [
                    { subject: "English Home Language", minimum: 40 },
                    { subject: "English First Additional Language", minimum: 40 }
                ]},
                { label: "Mathematics or Mathematical Literacy", options: [
                    { subject: "Mathematics", minimum: 30 },
                    { subject: "Mathematical Literacy", minimum: 40 }
                ]}
            ],
            additionalChecks: [
                "At least 23 points from the best six subjects, excluding Life Orientation. The app does not yet calculate MUT's official points."
            ],
            duration: "4 years, full-time.",
            fees: "2026 MUT module-price estimate (ZAR). Preparatory year: COFU000 R1,830 + IPSP000 R1,990 + COMA000 R1,990 + ENLS000 R1,990 = R7,800. Year 2: IFSY100 R8,800 + DVSF100 R7,570 + TLPR100 R6,440 + SYST100 R6,820 = R29,630. Software Development Year 3: IFSY200 R6,820 + IFTS200 R7,620 + DVSF200 R6,820 + TLPR200 R6,440 = R27,700. Year 4: IFSY300 R7,470 + DVSF300 R6,440 + ITPR300 R6,440 + INXP300 R4,080 = R24,430. Estimated 4-year total: R89,560. Communication Networks: preparatory year R7,800; Year 2 R29,630; Year 3 CONE200 R6,820 + ITSK200 R7,620 + DTRS200 R6,820 + ITCS200 R6,820 = R28,080; Year 4 CNET300 R6,820 + DTRS300 R6,820 + ITCS300 R6,820 + IEXP300 R4,080 = R24,540. Estimated 4-year total: R90,050. These are our calculations from MUT's published 2026 module prices, not official programme totals. Other charges, repeated modules and future price changes may affect the final cost. Please verify with MUT.",
            feeSource: "https://www.mut.ac.za/wp-content/uploads/2026/01/2026-FEES-PER-MODULE.pdf",
            source: "https://www.mut.ac.za/faculty-of-applied-and-health-sciences/department-of-information-and-communication-technology/"
        },
        {
            career: "Information Technology",
            name: "NC(V) Information Technology & Computers",
            type: "TVET College",
            institution: "Elangeni TVET College",
            requirements: ["Grade 9 pass."],
            assessmentMode: "unverified",
            eligibilityRules: [],
            additionalChecks: [
                "Confirm current programme entry conditions directly with Elangeni TVET College."
            ],
            duration: "3 years.",
            fees: "The official course page does not publish a verified annual tuition amount or overall course total. Confirm current fees with the college.",
            source: "https://www.elangeni.edu.za/learning_programmes/ncv-information-technology-computers/"
        },
        {
            career: "Engineering",
            name: "Bachelor of Engineering in Mechanical Engineering",
            type: "University",
            institution: "University of Zululand (UniZulu)",
            requirements: [
                "Minimum 30 NSC points and an NSC pass allowing degree study.",
                "Mathematics: at least 65% (Level 5).",
                "Physical Sciences: at least 60% (Level 5).",
                "English Home Language or First Additional Language: at least 50% (Level 4).",
                "Programme code: 5MEDG1. Four-year degree."
            ],
            assessmentMode: "configured",
            eligibilityRules: [
                { label: "English", options: [
                    { subject: "English Home Language", minimum: 50 },
                    { subject: "English First Additional Language", minimum: 50 }
                ]},
                { label: "Mathematics", options: [
                    { subject: "Mathematics", minimum: 65 }
                ]},
                { label: "Physical Sciences", options: [
                    { subject: "Physical Sciences", minimum: 60 }
                ]}
            ],
            additionalChecks: [
                "At least 30 NSC points and an NSC pass allowing degree study. The app does not yet calculate UniZulu's official points."
            ],
            duration: "Duration depends on the specific engineering qualification; confirm with UniZulu.",
            fees: "Historical reference only: UNIZULU's 2021 annual report includes a faculty-level comparison showing engineering tuition at approximately R60,000. This is an approximate historical figure, not a verified fee for this specific qualification and not a current price. Fees may have changed. Contact UNIZULU to confirm the current programme cost.",
            feeSource: "https://www.unizulu.ac.za/wp-content/uploads/2022/10/UNIZULU-2021-Annual-Report-for-Web.pdf",
            source: "https://www.science.unizulu.ac.za/engineering/requirements/"
        },
        {
            career: "Engineering",
            name: "BEng Mechanical Engineering (5-year programme)",
            type: "University",
            institution: "University of Pretoria (UP)",
            requirements: [
                "APS: at least 33; Life Orientation is excluded.",
                "English Home Language or First Additional Language: Level 5.",
                "Mathematics: at least 65%.",
                "Physical Sciences: at least 65%.",
                "Meeting minimum requirements does not guarantee admission."
            ],
            assessmentMode: "configured",
            eligibilityRules: [
                { label: "English", options: [
                    { subject: "English Home Language", minimum: 60 },
                    { subject: "English First Additional Language", minimum: 60 }
                ]},
                { label: "Mathematics", options: [
                    { subject: "Mathematics", minimum: 65 }
                ]},
                { label: "Physical Sciences", options: [
                    { subject: "Physical Sciences", minimum: 65 }
                ]}
            ],
            additionalChecks: [
                "APS of at least 33, excluding Life Orientation. The app does not yet calculate UP's official APS."
            ],
            duration: "5 years, full-time.",
            fees: "2025 estimated tuition (ZAR) from UP's archived official fee table: Year 1 R59,000–R64,000; Year 2 R64,000–R72,000; Year 3 R76,000–R84,000; Year 4 R64,000–R71,000. The table does not provide a fifth-year estimate for this five-year programme, so a full five-year total cannot be calculated from this source. These are 2025 estimates; fees may have changed or may remain similar. Please verify current costs with UP before budgeting.",
            feeSource: "https://www.up.ac.za/student-fees/undergraduate-tuition-fees-faculty-2025-archive",
            source: "https://www.up.ac.za/programmes/undergraduate/beng-mechanical-engineering-5-year-programme/2026"
        },

        {
            career: "Health Sciences",
            name: "Bachelor of Nursing",
            type: "University",
            institution: "University of KwaZulu-Natal (UKZN)",
            requirements: [
                "NSC degree pass.",
                "English Home Language or First Additional Language: Level 4.",
                "Life Orientation: Level 4.",
                "Mathematics or Mathematical Literacy: Level 3.",
                "Life Sciences: Level 4.",
                "At least 30 NSC points excluding Life Orientation; selection applies."
            ],
            assessmentMode: "configured",
            eligibilityRules: [
                { label: "English", options: [
                    { subject: "English Home Language", minimum: 50 },
                    { subject: "English First Additional Language", minimum: 50 }
                ]},
                { label: "Mathematics or Mathematical Literacy", options: [
                    { subject: "Mathematics", minimum: 40 },
                    { subject: "Mathematical Literacy", minimum: 40 }
                ]},
                { label: "Life Sciences", options: [
                    { subject: "Life Sciences", minimum: 50 }
                ]},
                { label: "Life Orientation", options: [
                    { subject: "Life Orientation", minimum: 50 }
                ]}
            ],
            additionalChecks: [
                "A degree pass and at least 30 NSC points excluding Life Orientation are required. The app does not yet calculate UKZN's official admission score."
            ],
            duration: "4 years, full-time.",
            fees: "Current programme tuition total not confirmed here. Check UKZN's official student fee information before budgeting.",
            source: "https://health-sciences.ukzn.ac.za/degrees/bachelor-of-nursing/"
        },
        {
            career: "Education",
            name: "Bachelor of Education: Foundation Phase (Grade R–3)",
            type: "University",
            institution: "University of KwaZulu-Natal (UKZN)",
            requirements: [
                "NSC degree pass.",
                "English Home Language or First Additional Language: Level 4.",
                "Another official South African language at Home or First Additional Language Level 4.",
                "Mathematics Level 3 OR Mathematical Literacy Level 4.",
                "Selection and available places may affect admission."
            ],
            assessmentMode: "configured",
            eligibilityRules: [
                { label: "English", options: [
                    { subject: "English Home Language", minimum: 50 },
                    { subject: "English First Additional Language", minimum: 50 }
                ]},
                { label: "Mathematics or Mathematical Literacy", options: [
                    { subject: "Mathematics", minimum: 40 },
                    { subject: "Mathematical Literacy", minimum: 50 }
                ]}
            ],
            additionalChecks: [
                "A degree pass and the required second official South African language must also be confirmed."
            ],
            duration: "4 years, full-time.",
            fees: "Current programme tuition total not confirmed here. Check UKZN's official student fee information before budgeting.",
            source: "https://education.ukzn.ac.za/information-for-high-school-learners/"
        },
        {
            career: "Education",
            name: "NC(V) Education and Development",
            type: "TVET College",
            institution: "Coastal KZN TVET College",
            requirements: [
                "Level 2: Grade 9 or equivalent qualification.",
                "Progression to Level 3 requires Level 2; progression to Level 4 requires Level 3."
            ],
            assessmentMode: "unverified",
            eligibilityRules: [],
            additionalChecks: [
                "This vocational pathway focuses on education and development, including early childhood development; it is not a university teaching degree."
            ],
            duration: "3 years: one full-time year at each of Levels 2, 3 and 4.",
            fees: "Current programme tuition not published on the course page. Confirm costs directly with the college.",
            source: "https://www.coastalkzn.co.za/ncv_education.html"
        },
        {
            career: "Education",
            name: "NATED Educare N4–N6",
            type: "TVET College",
            institution: "Coastal KZN TVET College",
            requirements: [
                "NC(V) Education and Development Level 4 or an equivalent qualification."
            ],
            assessmentMode: "unverified",
            eligibilityRules: [],
            additionalChecks: [
                "The N6 certificate requires relevant workplace experience for conversion to a diploma."
            ],
            duration: "6 months per level for N4, N5 and N6; workplace experience is additional.",
            fees: "Current programme tuition not published on the course page. Confirm costs directly with the college.",
            source: "https://www.coastalkzn.co.za/nated_educare.html"
        },
        {
            career: "Business",
            name: "Bachelor of Commerce – General",
            type: "University",
            institution: "University of KwaZulu-Natal (UKZN)",
            requirements: [
                "NSC degree pass and at least 30 NSC points excluding Life Orientation.",
                "Mathematics: Level 4.",
                "English Home Language or First Additional Language: Level 4.",
                "Life Orientation: Level 4 or equivalent."
            ],
            assessmentMode: "configured",
            eligibilityRules: [
                { label: "Mathematics", options: [
                    { subject: "Mathematics", minimum: 50 }
                ]},
                { label: "English", options: [
                    { subject: "English Home Language", minimum: 50 },
                    { subject: "English First Additional Language", minimum: 50 }
                ]},
                { label: "Life Orientation", options: [
                    { subject: "Life Orientation", minimum: 50 }
                ]}
            ],
            additionalChecks: [
                "At least 30 NSC points excluding Life Orientation and an NSC degree pass must be confirmed; the app does not yet calculate UKZN's official points."
            ],
            duration: "3 years.",
            fees: "Current programme tuition total not confirmed here. Check UKZN's official student fee information before budgeting.",
            source: "https://commerce.ukzn.ac.za/undergraduate/bachelor-of-commerce-general-bcom/"
        },
        {
            career: "Business",
            name: "NC(V) Finance, Economics and Accounting",
            type: "TVET College",
            institution: "Coastal KZN TVET College",
            requirements: [
                "Level 2: Grade 9 or equivalent qualification.",
                "Progression to Level 3 requires Level 2; progression to Level 4 requires Level 3."
            ],
            assessmentMode: "unverified",
            eligibilityRules: [],
            additionalChecks: [
                "The vocational subjects include applied accounting, financial management, economic environment and new venture creation."
            ],
            duration: "3 years: one full-time year at each of Levels 2, 3 and 4.",
            fees: "Current programme tuition not published on the course page. Confirm costs directly with the college.",
            source: "https://www.coastalkzn.co.za/ncv_finance.html"
        },
        {
            career: "Law",
            name: "Bachelor of Laws (LLB)",
            type: "University",
            institution: "University of KwaZulu-Natal (UKZN)",
            requirements: [
                "NSC degree pass.",
                "English Home Language: Level 5 OR English First Additional Language: Level 6.",
                "Mathematical Literacy: Level 5 OR Mathematics: Level 3.",
                "Life Orientation: Level 4.",
                "At least 32 APS points excluding Life Orientation."
            ],
            assessmentMode: "configured",
            eligibilityRules: [
                { label: "English", options: [
                    { subject: "English Home Language", minimum: 60 },
                    { subject: "English First Additional Language", minimum: 70 }
                ]},
                { label: "Mathematics or Mathematical Literacy", options: [
                    { subject: "Mathematics", minimum: 40 },
                    { subject: "Mathematical Literacy", minimum: 60 }
                ]},
                { label: "Life Orientation", options: [
                    { subject: "Life Orientation", minimum: 50 }
                ]}
            ],
            additionalChecks: [
                "A degree pass and APS of at least 32 excluding Life Orientation must be confirmed. The app does not yet calculate UKZN's official APS."
            ],
            duration: "4 years, full-time.",
            fees: "Current programme tuition total not confirmed here. Check UKZN's official student fee information before budgeting.",
            source: "https://law.ukzn.ac.za/undergraduates/bachelor-of-laws-full-time-llb/"
        },
        {
            career: "Law",
            name: "NC(V) Office Administration (related administrative pathway)",
            type: "TVET College",
            institution: "Coastal KZN TVET College",
            requirements: [
                "Level 2: Grade 9 or equivalent qualification.",
                "Progression to Levels 3 and 4 requires successful completion of the previous level."
            ],
            assessmentMode: "unverified",
            eligibilityRules: [],
            additionalChecks: [
                "This is an office administration qualification, not a law degree. The college lists legal secretarial services among related career opportunities."
            ],
            duration: "3 years: one full-time year at each of Levels 2, 3 and 4.",
            fees: "Current programme tuition not published on the course page. Confirm costs directly with the college.",
            source: "https://www.coastalkzn.co.za/ncv_office.html"
        },
        {
            career: "Science",
            name: "BSc Environmental Science",
            type: "University",
            institution: "University of KwaZulu-Natal (UKZN)",
            requirements: [
                "NSC degree pass.",
                "English and Life Orientation: Level 4.",
                "Mathematics: Level 4.",
                "At least Level 4 in Agricultural Sciences OR Life Sciences OR Physical Sciences."
            ],
            assessmentMode: "configured",
            eligibilityRules: [
                { label: "English", options: [
                    { subject: "English Home Language", minimum: 50 },
                    { subject: "English First Additional Language", minimum: 50 }
                ]},
                { label: "Mathematics", options: [
                    { subject: "Mathematics", minimum: 50 }
                ]},
                { label: "Life Orientation", options: [
                    { subject: "Life Orientation", minimum: 50 }
                ]},
                { label: "At least one science subject", options: [
                    { subject: "Agricultural Sciences", minimum: 50 },
                    { subject: "Life Sciences", minimum: 50 },
                    { subject: "Physical Sciences", minimum: 50 }
                ]}
            ],
            additionalChecks: [
                "An NSC degree pass is required. Confirm the current programme-specific selection score with UKZN."
            ],
            duration: "3 years.",
            fees: "Current programme tuition total not confirmed here. Check UKZN's official student fee information before budgeting.",
            source: "https://ww2.chs.ukzn.ac.za/wp-content/uploads/2026/04/2026-Undergraduate-prospectus-min.pdf"
        },
        {
            career: "Arts and Design",
            name: "Diploma in Fine Art",
            type: "University of Technology",
            institution: "Durban University of Technology (DUT)",
            requirements: [
                "Admission is subject to DUT's current undergraduate entry rules and programme selection process.",
                "Confirm current subject, portfolio and selection requirements directly with DUT before applying."
            ],
            assessmentMode: "unverified",
            eligibilityRules: [],
            additionalChecks: [
                "This programme focuses on studio art, drawing, painting, sculpture, printmaking and ceramics."
            ],
            duration: "3 years full-time; an extended curriculum option takes 4 years.",
            fees: "DUT publishes a 2026 student fees booklet. Module costs vary; check the official booklet and confirm the full programme total with DUT.",
            feeSource: "https://www.dut.ac.za/wp-content/uploads/2026/01/2026-STUDENT-FEES-BOOKLET.pdf",
            source: "https://www.dut.ac.za/wp-content/uploads/career_leaflets/FAD%20Fine%20Art.pdf"
        },
        {
            career: "Agriculture",
            name: "Diploma in Agriculture: Crop Production",
            type: "University",
            institution: "Mangosuthu University of Technology (MUT)",
            requirements: [
                "English: NSC Level 4.",
                "Agricultural Sciences OR Life Sciences: Level 4.",
                "Mathematics: Level 3 OR Mathematical Literacy: Level 4.",
                "Physical Sciences: Level 3."
            ],
            assessmentMode: "configured",
            eligibilityRules: [
                { label: "English", options: [
                    { subject: "English Home Language", minimum: 50 },
                    { subject: "English First Additional Language", minimum: 50 }
                ]},
                { label: "Agriculture or Life Sciences", options: [
                    { subject: "Agricultural Sciences", minimum: 50 },
                    { subject: "Life Sciences", minimum: 50 }
                ]},
                { label: "Mathematics or Mathematical Literacy", options: [
                    { subject: "Mathematics", minimum: 40 },
                    { subject: "Mathematical Literacy", minimum: 50 }
                ]},
                { label: "Physical Sciences", options: [
                    { subject: "Physical Sciences", minimum: 40 }
                ]}
            ],
            additionalChecks: ["Confirm all current admission and selection conditions with MUT."],
            duration: "Minimum 3 years; extended curriculum may take 4 years.",
            fees: "Total programme fees not confirmed. Check the current fee schedule with MUT.",
            feeSource: "https://www.mut.ac.za/wp-content/uploads/2026/01/2026-FEES-PER-MODULE.pdf",
            source: "https://www.mut.ac.za/faculty-of-applied-and-health-sciences/department-of-agriculture/"
        },
        {
            career: "Agriculture",
            name: "NC(V) Primary Agriculture",
            type: "TVET College",
            institution: "Coastal KZN TVET College",
            requirements: [
                "Level 2 entry: Grade 9 or equivalent.",
                "Progression to Levels 3 and 4 requires passing the previous level."
            ],
            assessmentMode: "unverified",
            eligibilityRules: [],
            additionalChecks: ["Confirm entry, fees and funding directly with the college."],
            duration: "3 years: one full-time year per level.",
            fees: "Current total not confirmed; contact the college.",
            source: "https://www.coastalkzn.co.za/ncv_agriculture.html"
        },
        {
            career: "Chartered Accountant",
            name: "BCom in Accounting (CA pathway)",
            type: "University",
            institution: "University of KwaZulu-Natal (UKZN)",
            requirements: [
                "NSC degree pass.",
                "Mathematics: Level 5.",
                "English and Life Orientation: Level 4.",
                "At least 32 NSC points."
            ],
            assessmentMode: "configured",
            eligibilityRules: [
                { label: "English", options: [
                    { subject: "English Home Language", minimum: 50 },
                    { subject: "English First Additional Language", minimum: 50 }
                ]},
                { label: "Mathematics", options: [
                    { subject: "Mathematics", minimum: 60 }
                ]},
                { label: "Life Orientation", options: [
                    { subject: "Life Orientation", minimum: 50 }
                ]}
            ],
            additionalChecks: [
                "Confirm the degree pass and points requirements with UKZN.",
                "The degree alone does not qualify you as a CA(SA). SAICA's further study, professional training and assessments are required."
            ],
            duration: "3-year degree, followed by additional professional requirements.",
            fees: "Current programme total not confirmed; check UKZN's fee information.",
            source: "https://commerce.ukzn.ac.za/undergraduate/bachelor-of-commerce-in-accounting/"
        },
        {
            career: "Chartered Accountant",
            name: "BCom in Accounting Extended Curriculum",
            type: "University",
            institution: "University of KwaZulu-Natal (UKZN)",
            requirements: [
                "NSC Bachelor's pass.",
                "At least 28 points, excluding Life Orientation.",
                "English and Life Orientation: Level 4.",
                "Mathematics: Level 4."
            ],
            assessmentMode: "configured",
            eligibilityRules: [
                { label: "English", options: [
                    { subject: "English Home Language", minimum: 50 },
                    { subject: "English First Additional Language", minimum: 50 }
                ]},
                { label: "Mathematics", options: [
                    { subject: "Mathematics", minimum: 50 }
                ]},
                { label: "Life Orientation", options: [
                    { subject: "Life Orientation", minimum: 50 }
                ]}
            ],
            additionalChecks: [
                "Confirm current entry requirements with UKZN.",
                "UKZN restricts admission to applicants who have not already completed a full semester at a tertiary institution.",
                "This is a possible CA(SA) pathway, not the complete professional qualification."
            ],
            duration: "4 years, followed by additional professional requirements.",
            fees: "Current programme total not confirmed; check UKZN's fee information.",
            source: "https://commerce.ukzn.ac.za/undergraduate/bachelor-of-commerce-in-accounting-extended-curriculum/"
        },
        {
            career: "Chartered Accountant",
            name: "NC(V) Finance, Economics and Accounting",
            type: "TVET College",
            institution: "Coastal KZN TVET College",
            requirements: [
                "Level 2 entry: Grade 9 or equivalent.",
                "Progression to Levels 3 and 4 requires passing the previous level."
            ],
            assessmentMode: "unverified",
            eligibilityRules: [],
            additionalChecks: ["This is a related foundation qualification, not a direct CA(SA) qualification. Further approved study and professional requirements remain necessary."],
            duration: "3 years: one full-time year per level.",
            fees: "Current total not confirmed; contact the college.",
            source: "https://www.coastalkzn.co.za/ncv_finance.html"
        },
        {
            career: "Welding",
            name: "Occupational Certificate: Welder",
            type: "TVET College",
            institution: "Coastal KZN TVET College",
            requirements: [
                "NQF Level 1, Grade 9 or equivalent.",
                "Confirm current entry and recognition-of-prior-learning requirements with the college.",
                "Physical fitness and hand-eye coordination are important."
            ],
            assessmentMode: "unverified",
            eligibilityRules: [],
            additionalChecks: ["Confirm enrolment, trade-test requirements and available funding with the college."],
            duration: "3 years; the course page lists 373 credits.",
            fees: "Current total not confirmed; contact the college.",
            source: "https://www.coastalkzn.co.za/occ_welder.html"
        },

    ];

    let careerResultsHTML = "";

    if (careers.length === 0) {
        careerResultsHTML =
            "<p>Please select at least one career to see your study pathways.</p>";
    }

    let hasEligibleStudyOption = false;

    careers.forEach(function (career) {
        const careerText = career.toLowerCase();

        const matchesIT =
            careerText.includes("information technology") ||
            careerText === "it" ||
            careerText.includes("software") ||
            careerText.includes("computer");

        const matchesEngineering = careerText.includes("engineering");
        const matchesAgriculture = careerText.includes("agri");
        const matchesCharteredAccountant =
            (careerText.includes("charter") && careerText.includes("account")) ||
            careerText.includes("accountant");
        const matchesWelding = careerText.includes("weld");

        const careerCategory =
            matchesIT ? "Information Technology" :
            matchesEngineering ? "Engineering" :
            matchesAgriculture ? "Agriculture" :
            matchesCharteredAccountant ? "Chartered Accountant" :
            matchesWelding ? "Welding" :
            careerText.includes("health") || careerText.includes("nurs") ? "Health Sciences" :
            careerText.includes("education") || careerText.includes("teach") ? "Education" :
            careerText.includes("business") || careerText.includes("commerce") ? "Business" :
            careerText.includes("law") ? "Law" :
            careerText.includes("science") ? "Science" :
            careerText.includes("art") || careerText.includes("design") ? "Arts and Design" :
            null;

        let optionsHTML = "";

        if (careerCategory) {
            const relevantCourses = courses.filter(function (item) {
                return item.career === careerCategory;
            });

            relevantCourses.forEach(function (item) {
                const institutionDomain =
                    item.institution.includes("Mangosuthu") ? "mut.ac.za" :
                    item.institution.includes("Elangeni") ? "elangeni.edu.za" :
                    item.institution.includes("University of Zululand") ? null :
                    item.institution.includes("University of Pretoria") ? null :
                    item.institution.includes("University of KwaZulu-Natal") ? "ukzn.ac.za" :
                    item.institution.includes("Coastal KZN") ? "coastalkzn.co.za" :
                    item.institution.includes("Durban University of Technology") ? "dut.ac.za" :
                    null;

                optionsHTML +=
                    "<div class='institution-card'>" +
                    "<h4>" + (item.type === "TVET College" ? item.type + ": " + item.name : item.name) + "</h4>" +
                    "<div class='institution-heading'>" +
                    (institutionDomain
                        ? "<img class='institution-logo' src='https://www.google.com/s2/favicons?domain=" +
                          institutionDomain + "&sz=128' alt='" + item.institution +
                          " website icon' loading='lazy'>" : "") +
                    "<p class='institution-name'>" + item.institution + "</p>" +
                    "</div>" +
                    "<h5>Requirements to check</h5><ul>";

                item.requirements.forEach(function (req) {
                    optionsHTML += "<li>" + req + "</li>";
                });

                let eligibilityHTML = "";

                if (item.assessmentMode !== "configured" ||
                    !Array.isArray(item.eligibilityRules) ||
                    item.eligibilityRules.length === 0) {
                    eligibilityHTML =
                        "<p><strong>Eligibility assessment unavailable.</strong> " +
                        "The current official entry requirements must be verified " +
                        "before your marks can be assessed.</p>";
                } else {
                    const missing = [];
                    const below = [];

                    item.eligibilityRules.forEach(function (group) {
                        const results = group.options.map(function (option) {
                            const found = subjects.find(function (subject) {
                                return subject.name.trim().toLowerCase() ===
                                    option.subject.toLowerCase();
                            });

                            return {
                                option: option,
                                found: found
                            };
                        });

                        const passing = results.find(function (result) {
                            return result.found &&
                                Number(result.found.mark) >= result.option.minimum;
                        });

                        if (passing) {
                            return;
                        }

                        const entered = results.filter(function (result) {
                            return Boolean(result.found);
                        });

                        const notEntered = results.filter(function (result) {
                            return !result.found;
                        });

                        if (entered.length === 0) {
                            missing.push(
                                group.label + " (" +
                                group.options.map(function (option) {
                                    return option.subject;
                                }).join(" or ") + ")"
                            );
                        } else {
                            let detail = entered.map(function (result) {
                                return result.option.subject + ": " +
                                    result.found.mark + "% (minimum " +
                                    result.option.minimum + "%)";
                            }).join("; ");

                            if (notEntered.length > 0) {
                                detail += "; alternatively, enter " +
                                    notEntered.map(function (result) {
                                        return result.option.subject;
                                    }).join(" or ") + " and check its requirement";
                            }

                            below.push(detail);
                        }
                    });

                    const validForBestSix = subjects.filter(function (subject) {
                        const name = subject.name.trim().toLowerCase();
                        return subject.markEntered &&
                            name !== "life orientation" &&
                            getNSCScore(Number(subject.mark)) !== null;
                    });

                    const requiredSubjectNames = [];
                    item.eligibilityRules.forEach(function (group) {
                        const enteredOptions = group.options.map(function (option) {
                            const found = validForBestSix.find(function (subject) {
                                return subject.name.trim().toLowerCase() ===
                                    option.subject.toLowerCase();
                            });
                            return found ? { option: option, subject: found } : null;
                        }).filter(Boolean);

                        enteredOptions.sort(function (a, b) {
                            return getNSCScore(Number(b.subject.mark)).points -
                                getNSCScore(Number(a.subject.mark)).points;
                        });

                        if (enteredOptions.length > 0) {
                            const name = enteredOptions[0].subject.name.trim().toLowerCase();
                            if (!requiredSubjectNames.includes(name)) {
                                requiredSubjectNames.push(name);
                            }
                        }
                    });

                    const selectedBestSix = [];
                    requiredSubjectNames.forEach(function (name) {
                        const subject = validForBestSix.find(function (item) {
                            return item.name.trim().toLowerCase() === name;
                        });
                        if (subject && !selectedBestSix.includes(subject)) {
                            selectedBestSix.push(subject);
                        }
                    });

                    validForBestSix.sort(function (a, b) {
                        return getNSCScore(Number(b.mark)).points -
                            getNSCScore(Number(a.mark)).points;
                    }).forEach(function (subject) {
                        if (selectedBestSix.length < 6 &&
                            !selectedBestSix.includes(subject)) {
                            selectedBestSix.push(subject);
                        }
                    });

                    selectedBestSix.length = Math.min(selectedBestSix.length, 6);
                    const courseBestSixPoints = selectedBestSix.reduce(function (total, subject) {
                        return total + getNSCScore(Number(subject.mark)).points;
                    }, 0);

                    if (selectedBestSix.length > 0) {
                        eligibilityHTML +=
                            "<h5>Best-six subjects for this course</h5>" +
                            "<div style='overflow-x:auto'><table style='width:100%;border-collapse:collapse'>" +
                            "<thead><tr><th style='border:1px solid #888;padding:6px'>Subject</th>" +
                            "<th style='border:1px solid #888;padding:6px'>Mark</th>" +
                            "<th style='border:1px solid #888;padding:6px'>NSC Level</th>" +
                            "<th style='border:1px solid #888;padding:6px'>Points</th>" +
                            "<th style='border:1px solid #888;padding:6px'>Status</th></tr></thead><tbody>";

                        selectedBestSix.forEach(function (subject) {
                            const name = subject.name.trim().toLowerCase();
                            const score = getNSCScore(Number(subject.mark));
                            const matchingOptions = item.eligibilityRules.reduce(function (all, group) {
                                return all.concat(group.options.filter(function (option) {
                                    return option.subject.toLowerCase() === name;
                                }));
                            }, []);
                            const required = requiredSubjectNames.includes(name);
                            const met = matchingOptions.some(function (option) {
                                return Number(subject.mark) >= option.minimum;
                            });
                            const status = required
                                ? (met ? "Requirement met" : "Threshold not met")
                                : "Best-six subject";
                            const rowStyle = required && met
                                ? "background:#e5f4e8;"
                                : (required ? "background:#fff0e0;" : "");

                            eligibilityHTML +=
                                "<tr style='" + rowStyle + "'>" +
                                "<td style='border:1px solid #888;padding:6px'>" + subject.name + "</td>" +
                                "<td style='border:1px solid #888;padding:6px;text-align:center'>" + subject.mark + "%</td>" +
                                "<td style='border:1px solid #888;padding:6px;text-align:center'>" + score.level + "</td>" +
                                "<td style='border:1px solid #888;padding:6px;text-align:center'>" + score.points + "</td>" +
                                "<td style='border:1px solid #888;padding:6px'>" + status + "</td></tr>";
                        });

                        eligibilityHTML +=
                            "<tr><th colspan='3' style='border:1px solid #888;padding:6px;text-align:right'>Best-six total</th>" +
                            "<th style='border:1px solid #888;padding:6px'>" + courseBestSixPoints + "</th>" +
                            "<th style='border:1px solid #888;padding:6px'></th></tr></tbody></table></div>";
                    }

                    if (missing.length > 0) {
                        eligibilityHTML +=
                            "<p><strong>Cannot assess all subject requirements yet.</strong> " +
                            "Enter marks for: " + missing.join("; ") + ".</p>";
                    }

                    if (below.length > 0) {
                        eligibilityHTML +=
                            "<p><strong>Some listed subject thresholds are not met yet.</strong> " +
                            "Review these results and improve the marks or enter an eligible alternative:</p><ul>" +
                            below.map(function (item) {
                                return "<li>" + item + "</li>";
                            }).join("") + "</ul>" +
                            "<h4>Alternative Courses to Consider</h4>" +
                            "<p>Your current subjects and marks may match other courses. Detailed alternatives, requirements and fees will be added later.</p>";
                    }

                    if (missing.length === 0 && below.length === 0) {
                        hasEligibleStudyOption = true;

                        eligibilityHTML +=
                            "<p><strong>Your marks meet the listed subject thresholds.</strong></p>";

                        eligibilityHTML +=
                            "<p><button type='button' " +
                            "onclick=\"alert('Your application has been sent. Please wait for a response from the institution.'); " +
                            "this.textContent='Application Status: In Progress'; " +
                            "this.disabled=true;\">" +
                            "Apply to this institution</button></p>";

                    }

                    if (Array.isArray(item.additionalChecks) &&
                        item.additionalChecks.length > 0) {
                        eligibilityHTML +=
                            "<p><strong>Other requirements still to confirm:</strong></p><ul>" +
                            item.additionalChecks.map(function (item) {
                                return "<li>" + item + "</li>";
                            }).join("") + "</ul>";
                    }

                    if (item.source) {
                        eligibilityHTML +=
                            "<p><button type='button' onclick=\"window.open('" +
                            item.source +
                            "', '_blank')\">Review Official Requirements</button></p>";
                    }
                }

                eligibilityHTML +=
                    "<p>This is a preliminary check, not an admission decision. " +
                    "Meeting the listed requirements means you may apply, but it does not guarantee admission. " +
                    "Submit your application and wait for the institution's official admission decision.</p>";

                optionsHTML +=
                    "</ul>" +
                    eligibilityHTML +
                    "<p><strong>Study duration:</strong> " +
                    item.duration + "</p>" +
                    "<p><strong>Tuition fees:</strong> " +
                    (item.fees || "Confirm current tuition costs with the institution.") +
                    "</p>" +
                    (item.feeSource
                        ? "<p><a href='" + item.feeSource +
                          "' target='_blank' rel='noopener'>Official tuition fee information</a></p>"
                        : "") +
                    (item.source
                        ? "<p><a href='" + item.source +
                          "' target='_blank' rel='noopener'>Official course and admission information</a></p>"
                        : "<p>Official course page not verified yet.</p>") +
                    "</div>";
            });
        } else {
            optionsHTML =
                "<p>No course match has been configured for " +
                career + " yet. Related university and TVET options " +
                "and their entry requirements still need to be researched.</p>";
        }

        careerResultsHTML +=
            "<section class='career-comparison'>" +
            "<h3>Career: " +
            (career.toLowerCase().includes("charter") &&
             career.toLowerCase().includes("account")
                ? "Chartered Accountant"
                : career) + "</h3>" +
            "<h4>University and TVET College options</h4>" +
            optionsHTML +
            "</section>";
    });

    let improvementHTML = "";
    let hasLowMark = false;

    subjects.forEach(function (item) {
        if (item.mark < 50) {
            hasLowMark = true;
            improvementHTML += "<li>" + item.name +
                ": current mark " + item.mark +
                "%. Check the target course requirements to determine " +
                "the mark needed.</li>";
        }
    });

    if (!hasLowMark) {
        improvementHTML =
            "<li>No subjects below 50%. Course-specific requirements " +
            "must still be checked.</li>";
    }

    results.innerHTML =
        "<h2>Your Study Pathway Comparison</h2>" +
        "<p>Careers selected: " +
        (careers.length ? careers.length : "None") + "</p>" +
        careerResultsHTML +
        (hasEligibleStudyOption
            ? "<section id='fundingSection' class='institution-card'>" +
              "<h3>How will you fund your studies?</h3>" +
              "<p>Select one option for your study pathway.</p>" +
              "<label><input type='radio' name='fundingChoice' value='cash'> Paying in cash (self-funded)</label><br>" +
              "<label><input type='radio' name='fundingChoice' value='nsfas'> NSFAS</label><br>" +
              "<label><input type='radio' name='fundingChoice' value='bursary'> Bursaries</label><br>" +
              "<button type='button' id='fundingApplyButton'>APPLY FOR SELECTED FUNDING</button>" +
              "<p id='fundingMessage' aria-live='polite'></p></section>"
            : "") +
        "<h3>Subjects to Consider Improving</h3>" +
        "<ul>" + improvementHTML + "</ul>" +
        "<p>Study modes and alternative pathways must be verified " +
        "with each institution.</p>";
}

let extraSubjectCount = 0;

const addSubjectButton = document.getElementById("addSubjectButton");
const extraSubjectsContainer = document.getElementById("extraSubjectsContainer");

const availableSubjects = [
    "English Home Language",
    "English First Additional Language",
    "Mathematics",
    "Mathematical Literacy",
    "Physical Sciences",
    "Life Sciences",
    "Accounting",
    "Business Studies",
    "Computer Applications Technology"
];

function checkDuplicateSubjects(changedSelect) {
    const allSelects = document.querySelectorAll(
        'select[id^="subject"], .extra-subject-select'
    );

    const selectedValues = [];

    for (const select of allSelects) {
        if (!select.value) continue;

        const value = select.value;

        const isEnglish = value === "English Home Language" ||
            value === "English First Additional Language";

        const isMaths = value === "Mathematics" ||
            value === "Mathematical Literacy";

        for (const previous of selectedValues) {
            const sameEnglishGroup =
                isEnglish &&
                (previous === "English Home Language" ||
                 previous === "English First Additional Language");

            const sameMathsGroup =
                isMaths &&
                (previous === "Mathematics" ||
                 previous === "Mathematical Literacy");

            if (
                value === previous ||
                sameEnglishGroup ||
                sameMathsGroup
            ) {
                alert(
                    sameEnglishGroup
                        ? "Choose English Home Language OR English First Additional Language, not both."
                        : sameMathsGroup
                        ? "Choose Mathematics OR Mathematical Literacy, not both."
                        : "This subject has already been selected."
                );

                changedSelect.value = "";
                return;
            }
        }

        selectedValues.push(value);
    }
}

document.addEventListener("change", function (event) {
    if (
        event.target.matches('select[id^="subject"]') ||
        event.target.matches(".extra-subject-select")
    ) {
        checkDuplicateSubjects(event.target);
    }
});

if (addSubjectButton && extraSubjectsContainer) {
    addSubjectButton.addEventListener("click", function () {
        extraSubjectCount++;

        const row = document.createElement("div");
        row.className = "extra-subject-row";

row.innerHTML =
    '<label>ADDITIONAL SUBJECT ' + extraSubjectCount + '</label>' +
    '<input type="text" class="extra-subject-select" ' +
    'id="extraSubject' + extraSubjectCount +
    '" placeholder="Type subject name">' +
    '<label>SUBJECT MARK</label>' +
    '<input type="number" class="extra-subject-mark" ' +
    'id="extraMark' + extraSubjectCount +
    '" placeholder="Enter mark (0-100)" min="0" max="100">' +
    '<button type="button" class="remove-extra-subject">' +
    'REMOVE SUBJECT</button>';

        extraSubjectsContainer.appendChild(row);

        row.querySelector(".remove-extra-subject")
            .addEventListener("click", function () {
                row.remove();
            });
    });
}


const careerOptions = document.querySelectorAll(".career-option");
const otherCareerOption = document.getElementById("otherCareerOption");
const otherCareerBox = document.getElementById("otherCareerBox");
const otherCareerInput = document.getElementById("otherCareerInput");
const careerSummary = document.getElementById("careerSummary");
const careerMessage = document.getElementById("careerMessage");
let otherCareers = [];

otherCareerInput.addEventListener("input", updateCareerPicker);

function saveOtherCareer() {
    const name = otherCareerInput.value.trim();
    if (!name) {
        careerMessage.textContent = "Please type a career first.";
        return;
    }

    const standardCount = Array.from(careerOptions).filter(
        option => option.checked && option.value !== "__other__"
    ).length;

    if (standardCount + otherCareers.length >= 5) {
        careerMessage.textContent = "Maximum of five careers selected.";
        return;
    }

    const existingCareers = [
        ...Array.from(careerOptions)
            .filter(option => option.checked && option.value !== "__other__")
            .map(option => option.value),
        ...otherCareers
    ];

    if (existingCareers.some(
        career => career.trim().toLowerCase() === name.toLowerCase()
    )) {
        careerMessage.textContent =
            "That career is already selected. Choose a different career.";
        return;
    }

    otherCareers.push(name);
    otherCareerInput.value = "";
    renderOtherCareers();
    updateCareerPicker();
}

const addCareerButton = document.getElementById("addCareerButton");
if (addCareerButton) {
    addCareerButton.addEventListener("click", saveOtherCareer);
}

otherCareerInput.addEventListener("keydown", function (event) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    saveOtherCareer();
});

function renderOtherCareers() {
    const container = document.getElementById("otherCareerTags");
    container.replaceChildren();

    otherCareers.forEach(function (career, index) {
        const item = document.createElement("span");
        item.textContent = career + " ";

        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "Remove";
        remove.addEventListener("click", function () {
            otherCareers.splice(index, 1);
            renderOtherCareers();
            updateCareerPicker();
        });

        item.appendChild(remove);
        container.appendChild(item);
    });
}

function updateCareerPicker() {
    const standardCount = Array.from(careerOptions).filter(
        option => option.checked && option.value !== "__other__"
    ).length;

    const count = standardCount + otherCareers.length;

    careerSummary.textContent = "Select careers (" + count + "/5)";
    otherCareerBox.style.display = otherCareerOption.checked ? "block" : "none";

    careerOptions.forEach(function (option) {
        option.disabled = count >= 5 &&
            !option.checked &&
            option.value !== "__other__";
    });

    careerMessage.textContent = count >= 5
        ? "Maximum of five careers selected."
        : "";
}

careerOptions.forEach(function (option) {
    option.addEventListener("change", function () {
        if (option.checked && option.value !== "__other__" && otherCareers.some(c => c.trim().toLowerCase() === option.value.trim().toLowerCase())) {
            option.checked = false;
            careerMessage.textContent = "That career is already saved under Other. Please remove it there first.";
            updateCareerPicker();
            return;
        }

        const selectedCount = Array.from(careerOptions).filter(item => item.checked && item.value !== "__other__").length + otherCareers.length + (otherCareerInput.value.trim() ? 1 : 0);
        if (selectedCount > 5) {
            option.checked = false;
            careerMessage.textContent = "You can select a maximum of five careers.";
        }

        if (option === otherCareerOption && !option.checked) {
            otherCareerInput.value = "";
            otherCareers = [];
            document.getElementById("otherCareerTags").textContent = "";
        }

        updateCareerPicker();
    });
});

// BACK AND RETURN NAVIGATION
document.getElementById("screen2BackButton").addEventListener("click", function () {
    screen2.classList.add("screen-hidden");
    screen1.classList.remove("screen-hidden");
});

document.getElementById("profileBackButton").addEventListener("click", function () {
    screen3.classList.add("screen-hidden");
    screen2.classList.remove("screen-hidden");
});

document.getElementById("resultsBackButton").addEventListener("click", function () {
    document.getElementById("universityScreen").style.display = "none";
    screen3.style.display = "";
    screen3.classList.remove("screen-hidden");
});

document.getElementById("resultsHomeButton").addEventListener("click", function () {
    document.querySelectorAll("#screen3 input, #screen3 select").forEach(function (field) {
        field.value = "";
    });

    document.getElementById("extraSubjectsContainer").innerHTML = "";
    extraSubjectCount = 0;
    careerOptions.forEach(function (option) {
        option.checked = false;
        option.disabled = false;
    });
    otherCareerInput.value = "";
    otherCareers = [];
    document.getElementById("otherCareerTags").textContent = "";
    document.getElementById("careerDropdown").open = false;
    careerMessage.textContent = "";
    updateCareerPicker();

    document.getElementById("results").innerHTML = "";
    document.getElementById("institutionResults").innerHTML = "";
    document.getElementById("universityScreen").style.display = "none";

    screen3.style.display = "";
    screen3.classList.add("screen-hidden");
    screen2.classList.add("screen-hidden");
    screen1.classList.remove("screen-hidden");
});


document.addEventListener("click", function (event) {
    if (event.target.id !== "fundingApplyButton") return;

    const selected = document.querySelector(
        "input[name='fundingChoice']:checked"
    );
    const message = document.getElementById("fundingMessage");
    if (!message) return;

    if (!selected) {
        message.textContent = "Please select one funding option.";
    } else if (selected.value === "cash") {
        message.textContent =
            "You selected self-funded. Use the institution's verified official fee and payment instructions. Banking details will be added when confirmed.";
    } else if (selected.value === "nsfas") {
        message.textContent =
            "You selected NSFAS. The official application link and application tracking will be added in a later step.";
    } else {
        message.textContent =
            "You selected bursaries. Relevant bursaries, eligibility rules and official application links will be added next.";
    }
});


// ONE-STOP SUCCESS: STUDENT UNIVERSITY SCREEN
const universityButton = document.getElementById("universityButton");
const studentUniversityScreen = document.getElementById("studentUniversityScreen");
const studentUniversityHomeButton = document.getElementById("studentUniversityHomeButton");
const studentModulesTable = document.getElementById("studentModulesTable");
const addModuleButton = document.getElementById("addModuleButton");

if (universityButton && studentUniversityScreen) {
    universityButton.addEventListener("click", function () {
        screen1.classList.add("screen-hidden");
        screen2.classList.add("screen-hidden");
        screen3.classList.add("screen-hidden");
        document.getElementById("universityScreen").style.display = "none";
        studentUniversityScreen.style.display = "block";
    });
}

if (studentUniversityHomeButton && studentUniversityScreen) {
    studentUniversityHomeButton.addEventListener("click", function () {
        studentUniversityScreen.style.display = "none";
        screen3.classList.add("screen-hidden");
        document.getElementById("universityScreen").style.display = "none";
        screen1.classList.add("screen-hidden");
        screen2.classList.remove("screen-hidden");
    });
}

if (addModuleButton && studentModulesTable) {
    addModuleButton.addEventListener("click", function () {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="text" placeholder="Module name"></td>
            <td>
                <select>
                    <option value="">Choose type</option>
                    <option>Test</option>
                    <option>Assignment</option>
                    <option>Exam</option>
                </select>
            </td>
            <td>
                <select>
                    <option value="">Choose number</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                </select>
            </td>
            <td><input type="number" min="0" max="100" placeholder="Mark"></td>
        `;
        studentModulesTable.appendChild(row);
    });
}

// STUDENT UNIVERSITY SCREEN: INSTITUTION AND QUALIFICATION DROPDOWNS
(function () {
    const institutionSelect = document.getElementById("studentInstitutionSelect");
    const qualificationSelect = document.getElementById("studentQualificationSelect");
    const yearSelect = document.getElementById("studentStudyYearSelect");
    const moduleStatus = document.getElementById("studentModuleStatus");
    const institutionText = document.getElementById("studentInstitution");
    const qualificationText = document.getElementById("studentQualification");

    if (
        !institutionSelect ||
        !qualificationSelect ||
        !yearSelect ||
        !moduleStatus
    ) return;

    const specializationContainer = document.createElement("div");
    specializationContainer.style.display = "none";
    specializationContainer.style.margin = "12px 0";

    const specializationLabel = document.createElement("label");
    specializationLabel.htmlFor = "studentSpecializationSelect";
    specializationLabel.textContent =
        "Choose ONE specialization (required for Year 2 and Year 3)";
    specializationLabel.style.display = "block";
    specializationLabel.style.marginBottom = "6px";

    const specializationSelect = document.createElement("select");
    specializationSelect.id = "studentSpecializationSelect";
    specializationSelect.disabled = true;
    specializationSelect.style.width = "100%";

    [
        ["", "Choose ONE specialization"],
        ["Software Development", "Software Development"],
        ["Communication Networks", "Communication Networks"]
    ].forEach(function (item) {
        const option = document.createElement("option");
        option.value = item[0];
        option.textContent = item[1];
        specializationSelect.appendChild(option);
    });

    specializationContainer.append(
        specializationLabel,
        specializationSelect
    );

    yearSelect.insertAdjacentElement(
        "afterend",
        specializationContainer
    );

    // These entries mirror the qualifications already in the app catalogue.
    // Module lists are not claimed to be verified by this dropdown code.
    const studentQualifications = [
        { institution: "Mangosuthu University of Technology (MUT)", name: "Diploma in Information Technology (Standard)", years: 3 },
        { institution: "Mangosuthu University of Technology (MUT)", name: "Diploma in Information Technology (Extended Curriculum Programme)", years: 4 },
        { institution: "Elangeni TVET College", name: "NC(V) Information Technology & Computers", years: 3 },
        { institution: "University of Zululand (UniZulu)", name: "Bachelor of Engineering in Mechanical Engineering", years: 4, periodType: "semester", periods: 8 },
        { institution: "University of Zululand (UniZulu)", name: "Bachelor of Engineering in Electrical Engineering", years: 4, periodType: "semester", periods: 8 },
        { institution: "University of Zululand (UniZulu)", name: "Bachelor of Engineering in Electrical Engineering and Computer Engineering", years: 4, periodType: "semester", periods: 8 },
        { institution: "University of Zululand (UniZulu)", name: "Bachelor of Engineering in Mechatronic Engineering", years: 4, periodType: "semester", periods: 8 },
        { institution: "University of Pretoria (UP)", name: "BEng Mechanical Engineering (5-year programme)", years: 5 },
        { institution: "University of KwaZulu-Natal (UKZN)", name: "Bachelor of Nursing", years: 4, periodType: "semester", periods: 8 },
        { institution: "University of KwaZulu-Natal (UKZN)", name: "Bachelor of Education: Foundation Phase (Grade R–3)", years: 4, periodType: "semester", periods: 8 },
        { institution: "Coastal KZN TVET College", name: "NC(V) Education and Development", years: 3 },
        { institution: "Coastal KZN TVET College", name: "NATED Educare N4–N6", years: 3 },
        { institution: "University of KwaZulu-Natal (UKZN)", name: "Bachelor of Commerce – General", years: 3, periodType: "semester", periods: 6 },
        { institution: "Coastal KZN TVET College", name: "NC(V) Finance, Economics and Accounting", years: 3 },
        { institution: "University of KwaZulu-Natal (UKZN)", name: "Bachelor of Laws (LLB)", years: 4, periodType: "semester", periods: 8 },
        { institution: "Coastal KZN TVET College", name: "NC(V) Office Administration (related administrative pathway)", years: 3 },
        { institution: "University of KwaZulu-Natal (UKZN)", name: "BSc Environmental Science", years: 3, periodType: "semester", periods: 6 },
        { institution: "Durban University of Technology (DUT)", name: "Diploma in Fine Art", years: 3 },
        { institution: "Mangosuthu University of Technology (MUT)", name: "Diploma in Agriculture: Crop Production", years: 3, periodType: "semester", periods: 6 },
        { institution: "Mangosuthu University of Technology (MUT)", name: "Diploma in Agriculture: Crop Production (ECP)", years: 4, periodType: "semester", periods: 8 },
        { institution: "Coastal KZN TVET College", name: "NC(V) Primary Agriculture", years: 3 },
        { institution: "University of KwaZulu-Natal (UKZN)", name: "BCom in Accounting (CA pathway)", years: 3, periodType: "semester", periods: 6 },
        { institution: "University of KwaZulu-Natal (UKZN)", name: "BCom in Accounting Extended Curriculum", years: 4, periodType: "semester", periods: 8 },
        { institution: "Coastal KZN TVET College", name: "Occupational Certificate: Welder", years: 3 }
    ];

    function resetDropdown(select, firstOption) {
        select.replaceChildren();
        const option = document.createElement("option");
        option.value = "";
        option.textContent = firstOption;
        select.appendChild(option);
    }

    resetDropdown(institutionSelect, "Choose institution");
    resetDropdown(qualificationSelect, "Choose institution first");
    resetDropdown(yearSelect, "Choose qualification first");

    qualificationSelect.disabled = true;
    yearSelect.disabled = true;

    const institutions = [...new Set(
        studentQualifications.map(item => item.institution)
    )];

    institutions.forEach(function (institution) {
        const option = document.createElement("option");
        option.value = institution;
        option.textContent = institution;
        institutionSelect.appendChild(option);
    });

    institutionSelect.addEventListener("change", function () {
        resetDropdown(qualificationSelect, "Choose qualification");
        resetDropdown(yearSelect, "Choose qualification first");

        qualificationSelect.disabled = !institutionSelect.value;
        yearSelect.disabled = true;

        if (institutionText) {
            institutionText.textContent =
                "Institution: " + (institutionSelect.value || "Not set yet");
        }

        if (qualificationText) {
            qualificationText.textContent = "Qualification: Not set yet";
        }

        if (!institutionSelect.value) {
            moduleStatus.textContent =
                "Select an institution, qualification and year of study to view available modules.";
            return;
        }

        studentQualifications
            .filter(item => item.institution === institutionSelect.value)
            .forEach(function (item) {
                const option = document.createElement("option");
                option.value = item.name;
                option.textContent = item.name;
                qualificationSelect.appendChild(option);
            });

        moduleStatus.textContent =
            "Choose your qualification. Module lists must be verified or clearly labelled DEMO before they are loaded.";
    });

    qualificationSelect.addEventListener("change", function () {
        resetDropdown(yearSelect, "Choose year of study");
        yearSelect.disabled = true;
        specializationSelect.value = "";
        specializationSelect.disabled = true;
        specializationContainer.style.display = "none";

        if (qualificationText) {
            qualificationText.textContent =
                "Qualification: " + (qualificationSelect.value || "Not set yet");
        }

        if (!qualificationSelect.value) {
            moduleStatus.textContent = "Choose a qualification to continue.";
            return;
        }

        const selectedQualification = studentQualifications.find(function (item) {
            return item.institution === institutionSelect.value &&
                item.name === qualificationSelect.value;
        });

        if (!selectedQualification || selectedQualification.years < 1) {
            moduleStatus.textContent =
                "Year structure not configured. Confirm the exact qualification with the institution before continuing.";
            return;
        }

        const isMutStandard =
            institutionSelect.value === "Mangosuthu University of Technology (MUT)" &&
            qualificationSelect.value === "Diploma in Information Technology (Standard)";
        const isMutEcp =
            institutionSelect.value === "Mangosuthu University of Technology (MUT)" &&
            qualificationSelect.value === "Diploma in Information Technology (Extended Curriculum Programme)";
        const isMutITQualification = isMutStandard || isMutEcp;

        specializationSelect.disabled = !isMutITQualification;
        specializationLabel.textContent = isMutEcp
            ? "Choose ONE specialization (required for Year 3 and Year 4)"
            : "Choose ONE specialization (required for Year 2 and Year 3)";

        const usesSemesters = selectedQualification.periodType === "semester";
        const periodCount = usesSemesters
            ? selectedQualification.periods
            : selectedQualification.years;

        const periodLabel = document.querySelector(
            'label[for="studentStudyYearSelect"]'
        );

        if (periodLabel) {
            periodLabel.textContent = usesSemesters
                ? "Semester of Study"
                : "Year of Study";
        }

        for (let period = 1; period <= periodCount; period++) {
            const option = document.createElement("option");
            option.value = usesSemesters
                ? "S" + period
                : String(period);
            option.textContent = usesSemesters
                ? "Semester " + period
                : "Year " + period;
            yearSelect.appendChild(option);
        }

        yearSelect.disabled = false;

        moduleStatus.textContent = isMutStandard
            ? "Year 1 has shared modules. At the start of Year 2, choose ONE specialization: Software Development OR Communication Networks."
            : "Choose your year or semester of study. If official modules are not configured, you can still enter modules manually below.";
    });

    specializationSelect.addEventListener("change", function () {
        if (yearSelect.value) {
            yearSelect.dispatchEvent(new Event("change"));
        }
    });

    const verifiedModulesByYear = {
        // UniZulu BEng Mechanical Engineering (5MEDG1).
        // Module names and codes checked against the official 2026 undergraduate prospectus.
        "University of Zululand (UniZulu)|Bachelor of Engineering in Mechanical Engineering|S1": [
            "4MTH171 - Calculus I for Engineers",
            "4PHY171 - General Physics A for Engineers",
            "4MTH181 - Engineering Mechanics",
            "4CPS171 - Introductory Computing for Engineers",
            "5MEC111 - Engineering Drawing"
        ],
        "University of Zululand (UniZulu)|Bachelor of Engineering in Mechanical Engineering|S2": [
            "4MTH172 - Calculus II for Engineers",
            "4PHY172 - General Physics B for Engineers",
            "5EEE112 - Introduction to Engineering",
            "4CHM172 - General Chemistry for Engineers",
            "5MEC112 - Introduction to Engineering Design"
        ],
        "University of Zululand (UniZulu)|Bachelor of Engineering in Mechanical Engineering|S3": [
            "4MTH271 - Advanced Calculus for Engineers",
            "5EEE221 - Analogue Electronic Design",
            "5EEE211 - Signals and Systems I",
            "5MEC211 - Mechanics of Solids I",
            "5MEC221 - Materials Science in Engineering"
        ],
        "University of Zululand (UniZulu)|Bachelor of Engineering in Mechanical Engineering|S4": [
            "4MTH272 - Linear Algebra and Differential Equations for Engineers",
            "5MEC212 - Thermofluids I",
            "5MEC222 - Dynamics I",
            "5MEC232 - Mechanical Engineering Machine Element Design I",
            "5EEE212 - Introduction to Power Engineering"
        ],
        // UniZulu 2026 Undergraduate Handbook: first-year engineering modules.
        "University of Zululand (UniZulu)|Bachelor of Engineering in Electrical Engineering|S1": [
            "4MTH171 - Calculus I for Engineers",
            "4PHY171 - General Physics A for Engineers",
            "4MTH181 - Engineering Mechanics",
            "4CPS171 - Introductory Computing for Engineers",
            "5MEC111 - Engineering Drawing"
        ],
        "University of Zululand (UniZulu)|Bachelor of Engineering in Electrical Engineering|S2": [
            "4MTH172 - Calculus II for Engineers",
            "4PHY172 - General Physics B for Engineers",
            "5EEE112 - Introduction to Engineering",
            "4CHM172 - General Chemistry for Engineers",
            "5MEC112 - Introduction to Engineering Design"
        ],
        "University of Zululand (UniZulu)|Bachelor of Engineering in Electrical Engineering and Computer Engineering|S1": [
            "4MTH171 - Calculus I for Engineers",
            "4PHY171 - General Physics A for Engineers",
            "4MTH181 - Engineering Mechanics",
            "4CPS171 - Introductory Computing for Engineers",
            "5MEC111 - Engineering Drawing"
        ],
        "University of Zululand (UniZulu)|Bachelor of Engineering in Electrical Engineering and Computer Engineering|S2": [
            "4MTH172 - Calculus II for Engineers",
            "4PHY172 - General Physics B for Engineers",
            "5EEE112 - Introduction to Engineering",
            "4CHM172 - General Chemistry for Engineers",
            "5MEC112 - Introduction to Engineering Design"
        ],
        "University of Zululand (UniZulu)|Bachelor of Engineering in Mechatronic Engineering|S1": [
            "4MTH171 - Calculus I for Engineers",
            "4PHY171 - General Physics A for Engineers",
            "4MTH181 - Engineering Mechanics",
            "4CPS171 - Introductory Computing for Engineers",
            "5MEC111 - Engineering Drawing"
        ],
        "University of Zululand (UniZulu)|Bachelor of Engineering in Mechatronic Engineering|S2": [
            "4MTH172 - Calculus II for Engineers",
            "4PHY172 - General Physics B for Engineers",
            "5EEE112 - Introduction to Engineering",
            "4CHM172 - General Chemistry for Engineers",
            "5MEC112 - Introduction to Engineering Design"
        ],
        "University of Pretoria (UP)|BEng Mechanical Engineering (5-year programme)|1": [
            "CHM 172 - General Chemistry 172",
            "FSK 116 - Physics 116",
            "JPO 110 - Professional orientation 110",
            "JPO 116 - Additional mathematics 1 116",
            "JPO 120 - Professional orientation 120",
            "JPO 126 - Additional mathematics 2 126",
            "JPO 152 - Additional physics 152",
            "JPO 161 - Additional chemistry 1 161",
            "JSU 110 - Introduction to sustainable engineering I 110",
            "JSU 120 - Introduction to sustainable engineering II 120",
            "WTW 158 - Calculus 158",
            "WTW 164 - Mathematics 164",
            "WWP 121 - Workshop practice 121",
            "UPO 112 - Academic orientation 112"
        ],
        "University of Pretoria (UP)|BEng Mechanical Engineering (5-year programme)|2": [
            "EBN 111 - Electricity and electronics 111",
            "JCP 203 - Community-based project 203",
            "MGC 110 - Graphical communication 110",
            "NMC 123 - Materials science 123",
            "SWK 122 - Statics 122",
            "WTW 258 - Calculus 258",
            "WTW 263 - Numerical methods 263",
            "JPO 112 - Additional electricity and electronics 112",
            "JPO 113 - Additional graphical communication 113",
            "JPO 123 - Additional materials science 123",
            "JPO 125 - Additional statics 125"
        ],
        "University of Pretoria (UP)|BEng Mechanical Engineering (5-year programme)|3": [
            "BES 220 - Engineering statistics 220",
            "MJJ 210 - Professional and technical communication 210",
            "MOW 217 - Manufacturing and design 217",
            "MOW 227 - Structural design 227",
            "MPR 213 - Programming and information technology 213",
            "MSD 210 - Dynamics 210",
            "MTX 221 - Thermodynamics 221",
            "WTW 238 - Mathematics 238",
            "WTW 256 - Differential equations 256"
        ],
        "Mangosuthu University of Technology (MUT)|Diploma in Information Technology (Standard)|1": [
            "ISYS100 - Information Systems I",
            "DSOF100 - Development Software I",
            "TPRO100 - Technical Programming I",
            "SSOF100 - System Software I"
        ],
        "Mangosuthu University of Technology (MUT)|Diploma in Information Technology (Standard)|Software Development|2": [
            "ISYS200 - Information Systems II",
            "ITSL200 - Information Technology Skills I",
            "DSOF200 - Development Software II",
            "TPRO200 - Technical Programming II"
        ],
        "Mangosuthu University of Technology (MUT)|Diploma in Information Technology (Standard)|Software Development|3": [
            "ISYS300 - Information Systems III",
            "DSOF300 - Development Software III",
            "ITNP300 - Internet Programming II",
            "IDSE300 - Industry Exposure III"
        ],
        "Mangosuthu University of Technology (MUT)|Diploma in Information Technology (Standard)|Communication Networks|2": [
            "CNET200 - Communication Networks II",
            "IMTS200 - Information Technology Skills I",
            "DTRS200 - Distributed Systems II",
            "ITCS200 - IT Electronics II"
        ],
        "Mangosuthu University of Technology (MUT)|Diploma in Information Technology (Standard)|Communication Networks|3": [
            "CNET300 - Communication Networks III",
            "DTRS300 - Distributed Systems III",
            "ITCS300 - IT Electronics III",
            "IEXP300 - Industry Exposure III"
        ],

        "Mangosuthu University of Technology (MUT)|Diploma in Information Technology (Extended Curriculum Programme)|1": [
            "COFU000 - Computing Fundamentals",
            "IPSP000 - Introduction to Problem-Solving and Programming Concepts",
            "COMA000 - Computer Maths",
            "ENLS000 - English Language Skills"
        ],
        "Mangosuthu University of Technology (MUT)|Diploma in Information Technology (Extended Curriculum Programme)|2": [
            "IFSY100 - Information Systems I",
            "DVSF100 - Development Software I",
            "TLPR100 - Technical Programming I",
            "SYST100 - System Software I"
        ],
        "Mangosuthu University of Technology (MUT)|Diploma in Information Technology (Extended Curriculum Programme)|Software Development|3": [
            "IFSY200 - Information Systems II",
            "IFTS200 - Information Technology Skills I",
            "DVSF200 - Development Software II",
            "TLPR200 - Technical Programming II"
        ],
        "Mangosuthu University of Technology (MUT)|Diploma in Information Technology (Extended Curriculum Programme)|Communication Networks|3": [
            "CONE200 - Communication Networks II",
            "ITSK200 - Information Technology Skills I",
            "DISY200 - Distributed Systems II",
            "ITEL200 - IT Electronics II"
        ],
        "Mangosuthu University of Technology (MUT)|Diploma in Information Technology (Extended Curriculum Programme)|Software Development|4": [
            "IFSY300 - Information Systems III",
            "DVSF300 - Development Software III",
            "ITPR300 - Internet Programming II",
            "INXP300 - Industry Exposure III"
        ],
        "Mangosuthu University of Technology (MUT)|Diploma in Information Technology (Extended Curriculum Programme)|Communication Networks|4": [
            "CONE300 - Communication Networks III",
            "DISY300 - Distributed Systems III",
            "ITEL300 - IT Electronics III",
            "INEX300 - Industry Exposure III"
        ],

        "Mangosuthu University of Technology (MUT)|Diploma in Agriculture: Crop Production|S1": [
            "AGME101 - Agricultural Mechanisation I",
            "ASTA101 - Agricultural Statistics I",
            "AOCE101 - Aspects of Crop Enterprises",
            "CPUT101 - Computer Skills IA",
            "ENGS101 - English Communication Skills I"
        ],
        "Mangosuthu University of Technology (MUT)|Diploma in Agriculture: Crop Production|S2": [
            "AGEC102 - Agricultural Economics I",
            "AGRE102 - Agricultural Extension I",
            "CSKL102 - Computer Skills IB",
            "CPRO102 - Crop Production I",
            "English Communication Skills II",
            "SOSC102 - Soil Science I"
        ],
        "Mangosuthu University of Technology (MUT)|Diploma in Agriculture: Crop Production|S3": [
            "AGRE201 - Agricultural Extension II",
            "AMKT201 - Agricultural Marketing II",
            "CROP201 - Crop Protection I",
            "FRUP201 - Fruit Production II",
            "VEGP201 - Vegetable Production II"
        ],
        "Mangosuthu University of Technology (MUT)|Diploma in Agriculture: Crop Production|S4": [
            "AGRE202 - Agricultural Extension III",
            "CRPD202 - Crop Production II",
            "CROP202 - Crop Protection II",
            "SOSC202 - Soil Science II",
            "SFSP202 - Subtropical Fruit and Sugarcane Production II"
        ],
        "Mangosuthu University of Technology (MUT)|Diploma in Agriculture: Crop Production|S5": [
            "AGPM301 - Agricultural Production Management III",
            "CRPD301 - Crop Production III",
            "CROP301 - Crop Protection III",
            "FRUP301 - Fruit Production III",
            "SOSC301 - Soil Science III",
            "AGCD000 - Work Readiness"
        ],
        "Mangosuthu University of Technology (MUT)|Diploma in Agriculture: Crop Production|S6": [
            "APRC302 - Agricultural Practice (Work-Integrated Learning)"
        ],

        "Mangosuthu University of Technology (MUT)|Diploma in Agriculture: Crop Production (ECP)|S1": [
            "BAEN001 - Basic English",
            "BNUM001 - Basic Numeracy",
            "ELOA001 - Elements of Agriculture",
            "PHSC001 - Physical Science",
            "PLBI001 - Plant Biology"
        ],
        "Mangosuthu University of Technology (MUT)|Diploma in Agriculture: Crop Production (ECP)|S2": [
            "AGCH002 - Agricultural Chemistry",
            "AGNU002 - Agricultural Numeracy",
            "ANBI002 - Animal Biology",
            "COMU002 - Communication",
            "COLI002 - Computer Literacy"
        ],
        "Mangosuthu University of Technology (MUT)|Diploma in Agriculture: Crop Production (ECP)|S3": [
            "AGMH101 - Agricultural Mechanisation I",
            "ASTT101 - Agricultural Statistics I",
            "ASCE101 - Aspects of Crop Enterprises",
            "CUTK101 - Computer Skills IA",
            "ECML101 - English Communication Skills I"
        ],
        "Mangosuthu University of Technology (MUT)|Diploma in Agriculture: Crop Production (ECP)|S4": [
            "AECM102 - Agricultural Economics I",
            "AXTS102 - Agricultural Extension I",
            "CUTK102 - Computer Skills IB",
            "CPRD102 - Crop Production I",
            "ECML102 - English Communication Skills II",
            "SLSC102 - Soil Science I"
        ],
        "Mangosuthu University of Technology (MUT)|Diploma in Agriculture: Crop Production (ECP)|S5": [
            "AXTS201 - Agricultural Extension II",
            "AMRK201 - Agricultural Marketing II",
            "CPTC201 - Crop Protection I",
            "FPRD201 - Fruit Production II",
            "VPRD201 - Vegetable Production II"
        ],
        "Mangosuthu University of Technology (MUT)|Diploma in Agriculture: Crop Production (ECP)|S6": [
            "AXTS202 - Agricultural Extension III",
            "CPRD202 - Crop Production II",
            "CPTC202 - Crop Protection II",
            "SLSC202 - Soil Science II",
            "SUSP202 - Subtropical Fruit and Sugarcane Production II"
        ],
        "Mangosuthu University of Technology (MUT)|Diploma in Agriculture: Crop Production (ECP)|S7": [
            "APMA301 - Agricultural Production Management III",
            "CPRD301 - Crop Production III",
            "CPTC301 - Crop Protection III",
            "FPRD301 - Fruit Production III",
            "SLSC301 - Soil Science III",
            "AGCE000 - Work Readiness"
        ],
        "Mangosuthu University of Technology (MUT)|Diploma in Agriculture: Crop Production (ECP)|S8": [
            "APRT302 - Agricultural Practice (Work-Integrated Learning)"
        ],

        "Elangeni TVET College|NC(V) Information Technology & Computers|1": [
            "English First Additional Language",
            "Life Orientation",
            "Mathematics",
            "Introduction to Information Systems",
            "Introduction to Systems Development",
            "Electronics"
        ],
        "Elangeni TVET College|NC(V) Information Technology & Computers|2": [
            "English First Additional Language",
            "Life Orientation",
            "Mathematics",
            "Systems Analysis and Design",
            "Computer Hardware and Software",
            "Principles of Computer Programming"
        ],
        "Elangeni TVET College|NC(V) Information Technology & Computers|3": [
            "English First Additional Language",
            "Life Orientation",
            "Mathematics",
            "Systems Analysis and Design",
            "Data Communication and Networking",
            "Computer Programming"
        ],
    

        "University of KwaZulu-Natal (UKZN)|Bachelor of Commerce – General|S1": [
            "Accounting 101 - ACCT101",
            "Principles of Microeconomics - ECON101",
            "IS&T for Business - ISTN101",
            "Management 120 - MGNT102",
            "Quantitative Methods 1 - MATH134"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Commerce – General|S2": [
            "Accounting 102/103 - ACCT102/103",
            "Principles of Macroeconomics - ECON102",
            "Development Applications Fundamentals - ISTN103",
            "Introduction to Commercial Law - LAWS1IC",
            "Introduction to Statistics - STAT130"
        ],

        "University of KwaZulu-Natal (UKZN)|BCom in Accounting Extended Curriculum|S1": [
            "Elementary Microeconomics - ECON1CO",
            "ISTN Workshops",
            "Foundation Mathematics - MATH194",
            "Academic Literacy for Commerce - ACCT1AL"
        ],

        "University of KwaZulu-Natal (UKZN)|BCom in Accounting Extended Curriculum|S2": [
            "Foundation Mathematics - MATH194",
            "Elementary Macroeconomics - ECON1DO",
            "Academic Literacy for Commerce - ACCT1AL",
            "Service-Learning - MGNT1SL"
        ],

        "University of KwaZulu-Natal (UKZN)|BCom in Accounting Extended Curriculum|S3": [
            "Accounting 101 - ACCT101",
            "Principles of Microeconomics - ECON101",
            "IS&T for Business - ISTN101",
            "Management 120 - MGNT102",
            "Quantitative Methods 1 - MATH134"
        ],

        "University of KwaZulu-Natal (UKZN)|BCom in Accounting Extended Curriculum|S4": [
            "Accounting 103 - ACCT103 OR Accounting 102 - ACCT102 (Accounting major)",
            "Principles of Macroeconomics - ECON102",
            "Development & Applications Fundamental - ISTN103",
            "Introduction to Statistics - STAT130"
        ],

        "University of KwaZulu-Natal (UKZN)|BCom in Accounting (CA pathway)|S1": [
            "Accounting 101",
            "Principles of Microeconomics",
            "IS&T for Business",
            "Introduction to Statistics",
            "Introduction to Calculus"
        ],

        "University of KwaZulu-Natal (UKZN)|BCom in Accounting (CA pathway)|S2": [
            "Accounting 102/103",
            "Principles of Macroeconomics",
            "Development Applications Fundamentals",
            "Introduction to Commercial Law",
            "Introduction to Statistics"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Laws (LLB)|S1": [
            "Introduction to Law - LAWS1LW"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Laws (LLB)|S2": [
            "Foundations of South African Law - LAWS1FL"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Nursing|S1": [
            "Fundamental Nursing Science 1 - NURS115",
            "Special Science - CHEM100",
            "Anatomy 1 for Nurses - ANAT120",
            "Critical Social Justice and Citizenship - EDJICS (0 credits)",
            "Becoming a Health Care Professional - SHSC1BH"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Nursing|S2": [
            "Fundamental Nursing Science 2 - NURS116",
            "Physiology 1 - HPHS1NU",
            "Anatomy 2 for Nurses - ANAT121",
            "Basic isiZulu Language Studies - ZULN101",
            "Academic Learning in English - ACLE102"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Nursing|S3": [
            "Physiology 2 - HPHS2NU",
            "Health Promotion and Disease Prevention Clinical - NURS209",
            "Health Promotion and Disease Prevention Theory - NURS208",
            "Health, Illness & Behaviour - SHSC1HI",
            "Pharmacology for Nurses - PHRM2IN"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Nursing|S4": [
            "Medical and Surgical Nursing 1 (Theory) - NURS225",
            "Medical and Surgical Nursing 1 (Clinical) - NURS226",
            "Community-based Care - SHSC1CB"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Nursing|S5": [
            "Unit Management and Leadership - NURS318",
            "Medical and Surgical Nursing 2 (Theory) - NURS304",
            "Medical and Surgical Nursing 2 (Clinical) - NURS306",
            "Research Methods for Health Sciences - SHSC1RM"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Nursing|S6": [
            "Medical Surgical Nursing 3 (Theory) - NURS315",
            "Medical Surgical Nursing 3 (Clinical) - NURS316",
            "Obstetrics and Foundations of Midwifery Theory - NURS351",
            "Obstetrics and Foundations of Midwifery Clinical - NURS350"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Nursing|S7": [
            "Midwifery 1 (Theory) - NURS412",
            "Midwifery 1 (Clinical) - NURS413",
            "Mental Health Nursing (Theory) - NURS406",
            "Primary Care (Theory and Clinical) - NURS404"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Nursing|S8": [
            "Midwifery 2 (Theory) - NURS414",
            "Midwifery 2 (Clinical) - NURS417",
            "Community Mental Health Nursing - NURS418",
            "Mental Health Nursing (Clinical) - NURS407"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Education: Foundation Phase (Grade R–3)|S1": [
            "Education Studies 1: An Introduction into the Study of Education - EDES113",
            "English: Language, Learning and Teaching in Education - EDEN111",
            "English Education: Foundations - EDEN113",
            "Integrated isiZulu and Literacy Studies - EDZU135 (English HL/isiZulu FAL) OR EDZU130 (isiZulu HL/English FAL)",
            "Computer Literacy - EDCE101 (zero-credit requirement; exemption may apply)"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Education: Foundation Phase (Grade R–3)|S2": [
            "Education Studies 2: Teaching, Learning and Classroom Practices - EDES130",
            "Numeracy in the Early Years - EDPY110",
            "English Education 2: Introduction to Theory and Practice - EDEN114 (English HL option)",
            "isiZulu Education 2 - EDZU136 (English HL/isiZulu FAL) OR EDZU131 (isiZulu HL/English FAL)",
            "Teaching Practice 1 - EDTP121",
            "Computer Literacy - EDCE101 (zero-credit requirement; exemption may apply)"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Education: Foundation Phase (Grade R–3)|S3": [
            "English Literacy Method 1 (EDPY203) OR isiZulu Literacy Method 1 HL (EDPY205) - choose applicable language pathway",
            "Understanding Child Development and Learning in the Foundation Phase - EDPY202",
            "Mathematics for Foundation and Intermediate Phase 1 - EDMA226",
            "Life Skills 1 - EDPY201"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Education: Foundation Phase (Grade R–3)|S4": [
            "Education Studies 3: Curriculum - EDES211",
            "Mathematics for Foundation and Intermediate Phase 2 - EDMA227",
            "English Literacy Method 2 / Literacies in Foundation Phase - EDPY204",
            "Teaching Practice 2 - EDTP221"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Education: Foundation Phase (Grade R–3)|S5": [
            "Education Studies 4: Psychology - EDES311",
            "Life Skills Method 1 - EDPY323",
            "English Education 3 - EDEN211 OR isiZulu Education 3 - EDZU240 (choose applicable language pathway)",
            "Mathematics Education for Foundation Phase Method 1 - EDPY324"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Education: Foundation Phase (Grade R–3)|S6": [
            "Contextual Realities, Education Frameworks and Processes in the Foundation Phase - EDPY325",
            "South African Sign Language - EDEN318",
            "Life Skills 2 - EDPY321",
            "Introduction to Computer Systems and Data Representation - EDCM111",
            "Teaching Practice 3 - EDTP321",
            "Mathematics Education for Foundation Phase Method 2 - EDPY410"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Education: Foundation Phase (Grade R–3)|S7": [
            "Teaching Practice 4 block session - EDTP430",
            "Education Studies 5: Researching Education - EDES412"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Education: Foundation Phase (Grade R–3)|S8": [
            "Education Studies 6: Philosophy and Sociology - EDES411",
            "Life Skills 3 - EDPY411",
            "Life Skills Method 2 - EDPY412"
        ],

        "University of KwaZulu-Natal (UKZN)|BSc Environmental Science|S1": [
            "The Smaller Side of Life - BIOL101",
            "General Principles of Chemistry - CHEM110",
            "Mathematics for Natural Sciences - MATH150",
            "Human Environments - GEOG110"
        ],

        "University of KwaZulu-Natal (UKZN)|BSc Environmental Science|S2": [
            "Life on Earth - BIOL102",
            "Environmental Systems - ENVS120",
            "Introduction to Statistics - STAT130",
            "Elective: Chemical Reactivity - CHEM120 (recommended)",
            "Elective: Computing for Natural Scientists - COMP106 (recommended)",
            "Elective: Earths Surface Processes - GEOL102 (Westville only)"
        ],

        "University of KwaZulu-Natal (UKZN)|BSc Environmental Science|S3": [
            "Biological Sciences Toolkit - BIOL200 (both campuses)",
            "Biophysical Environments of Southern Africa - ENVS210 (both campuses)",
            "Pietermaritzburg options: Plant and Animal Ecophysiology - BIOL204; Rangeland Plants: Ecology and Management - BIOL223; Introduction to Soils and the Environment - SSCI217",
            "Westville options: Plant and Animal Ecophysiology - BIOL204; Invertebrate Diversity and Ecology - BIOL214"
        ],

        "University of KwaZulu-Natal (UKZN)|BSc Environmental Science|S4": [
            "Geographic Information Systems - ENVS211 (both campuses)",
            "Pietermaritzburg: Geographies of Urban and Rural Change - GEOG220; Vertebrate Biology - BIOL222; choose one 16-credit elective: Pedology - SSCI230; Invertebrate Diversity and Conservation - BIOL213; Soil Biology and Biochemistry - SSCI260; Environmental Instruments: Life/Earth Sciences - AMET212",
            "Westville: Geographies of Urban and Rural Change - GEOG220; Marine Environment - BIOL231; choose one 16-credit option: Basic isiZulu Language Studies A - ZULN101; Vertebrate Biology and Ecology - BIOL210; Angiosperm Evolution and Diversification - BIOL212"
        ],

        "University of KwaZulu-Natal (UKZN)|BSc Environmental Science|S5": [
            "Population and Community Ecology - BIOL305 (both campuses)",
            "GIS and Remote Sensing - ENVS316 (both campuses)",
            "Soil Erosion and Land Degradation - ENVS315 (both campuses)",
            "Pietermaritzburg option: Atmospheric Science - ENVS318 OR Biogeography and Climatic Change - ENVS314",
            "Westville options: Comparative Animal Ecophysiology - BIOL306 OR Parasites and People - BIOL344"
        ],

        "University of KwaZulu-Natal (UKZN)|BSc Environmental Science|S6": [
            "Pietermaritzburg: Global Environmental Change - ENVS319; Environmental Management - ENVS322; choose 32 credits of BIOL electives, recommended Applied Biotechnology - BIOL315 and Reproductive and Behaviour Ecology - BIOL325",
            "Westville: Biogeography and Climatic Change - ENVS314; Research in the Environmental Sciences - ENVS390; Environmental Management - ENVS322; choose one: Marine Ecophysiology - BIOL342 OR Applied Plant Physiology - BIOL348"
        ],

        "University of KwaZulu-Natal (UKZN)|BCom in Accounting (CA pathway)|S3": [
            "Financial Accounting 2A - ACCT211",
            "Management and Cost Accounting 200 - ACCT251",
            "Intermediate Macro & Applications - ECON201",
            "Finance 201 - FINA201",
            "Introductory Programming for Information Systems - ISTN2IP OR STAT243 (approved alternative)"
        ],

        "University of KwaZulu-Natal (UKZN)|BCom in Accounting (CA pathway)|S4": [
            "Financial Accounting 2B - ACCT212",
            "Auditing 200 - ACCT221",
            "Intermediate Micro & Applications - ECON202",
            "Finance 202 - FINA202",
            "Integrated Business Studies - FINA103"
        ],

        "University of KwaZulu-Natal (UKZN)|BCom in Accounting (CA pathway)|S5": [
            "Financial Accounting 3A - ACCT311",
            "Auditing 3A - ACCT321",
            "Managerial Accounting and Financial Management 3A - ACCT331",
            "Taxation 3A - ACCT341"
        ],

        "University of KwaZulu-Natal (UKZN)|BCom in Accounting (CA pathway)|S6": [
            "Financial Accounting 3B - ACCT312",
            "Auditing 3B - ACCT322",
            "Managerial Accounting and Financial Management 3B - ACCT332",
            "Taxation 3B - ACCT342"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Laws (LLB)|S3": [
            "Criminal Law - LAWS2CR",
            "Family Law - LAWS2FM",
            "Law of Persons - LAWS2LP",
            "Legal Research, Writing and Reasoning - LAWS2LR",
            "Constitutional Law - LAWS2CS",
            "Delict - LAWS2DL",
            "Human Rights - LAWS2HR",
            "Interpretation of Law - LAWS2LW",
            "Property - LAWS2PR",
            "Non-legal module - choose your registered module"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Laws (LLB)|S4": [
            "Criminal Law - LAWS2CR",
            "Family Law - LAWS2FM",
            "Law of Persons - LAWS2LP",
            "Legal Research, Writing and Reasoning - LAWS2LR",
            "Constitutional Law - LAWS2CS",
            "Delict - LAWS2DL",
            "Human Rights - LAWS2HR",
            "Interpretation of Law - LAWS2LW",
            "Property - LAWS2PR",
            "Non-legal module - choose your registered module"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Laws (LLB)|S5": [
            "Contract - LAWS3CT",
            "International Law - LAWS3IN",
            "Professional Training 1 - LAWS3PT",
            "Specific Offences - LAWS3SO",
            "Succession - LAWS3SC",
            "Accounting for Legal Practice - LAWS3AP",
            "Criminal Procedure - LAWS3CP",
            "Evidence - LAWS3EV",
            "Jurisprudence - LAWS3JP",
            "Legal Diversity - LAWS3LD",
            "Labour Law - LAWS3LL"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Laws (LLB)|S6": [
            "Accounting for Legal Practice - LAWS3AP",
            "Criminal Procedure - LAWS3CP",
            "Evidence - LAWS3EV",
            "Jurisprudence - LAWS3JP",
            "Labour Law - LAWS3LL"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Laws (LLB)|S7": [
            "Administrative Law - LAWS4AL",
            "Insurance and Agency - LAWS4IA",
            "Professional Training 2 - LAWS4PT",
            "Sale, Lease and Credit Agreements - LAWS4SL",
            "Civil Procedure - LAWS4CV",
            "Corporate Law - LAWS4CO",
            "Negotiable Instruments - LAWS4NG",
            "Security and Insolvency - LAWS4SI",
            "Choose one Public Interest Law module: Clinical Law - LAWS4CC OR Teaching Legal Skills - LAWS4TS OR Street Law - LAWS4ST",
            "Electives: choose three only, subject to campus and semester availability: Access to Justice - LAWS4AJ; Bioethics - LAWS4BE; Cyber Law - LAWS4CL; Environmental Law - LAWS4EN; Gender and the Law - LAWS4GL; Intellectual Property Law - LAWS4IP; International Criminal Law - LAWS4IC; Income Tax Law - LAWS4IT; Maritime Law - LAWS4ML; Research Project - LAWS4RP; Sentencing - LAWS4SN"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Laws (LLB)|S8": [
            "Administrative Law - LAWS4AL",
            "Insurance and Agency - LAWS4IA",
            "Professional Training 2 - LAWS4PT",
            "Sale, Lease and Credit Agreements - LAWS4SL",
            "Civil Procedure - LAWS4CV",
            "Corporate Law - LAWS4CO",
            "Negotiable Instruments - LAWS4NG",
            "Security and Insolvency - LAWS4SI",
            "Choose one Public Interest Law module: Clinical Law - LAWS4CC OR Teaching Legal Skills - LAWS4TS OR Street Law - LAWS4ST",
            "Electives: choose three only, subject to campus and semester availability: Access to Justice - LAWS4AJ; Bioethics - LAWS4BE; Cyber Law - LAWS4CL; Environmental Law - LAWS4EN; Gender and the Law - LAWS4GL; Intellectual Property Law - LAWS4IP; International Criminal Law - LAWS4IC; Income Tax Law - LAWS4IT; Maritime Law - LAWS4ML; Research Project - LAWS4RP; Sentencing - LAWS4SN"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Commerce – General|S3": [
            "Responsible and Sustainable Management Principles - MGNT2SM",
            "Level 2 elective choices: Systems Analysis and Design - ISTN211; Introductory Programming for Information Systems - ISTN2IP; Intermediate Macro & Applications - ECON201; Introduction to HR Management - HRMG2HM; Introduction to Marketing - MARK2IM; Finance 201 - FINA201; Research Methodology Statistical Methods and Analysis - HRMG2A0; Managerial Ethics in the Workplace - HRMG2E0; Career Management - HRMG2KO; Business Enterprise Law - LAWS2CA; Special Topics in Business Law - LAWS2CB; Financial Accounting 2A - ACCT211; Ethics and Business Ethics for Accounting and Management - ACCT213",
            "Choose six Level 2 electives according to your approved study plan"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Commerce – General|S4": [
            "Basic isiZulu Language Studies - ZULN101",
            "If exempt from isiZulu, choose an approved Level 1 elective worth 16 credits",
            "Level 2 elective choices: Intermediate Micro & Applications - ECON202; Introduction to Entrepreneurship - ENTR2IE; Introduction to Operations Management - SCMA2OM; Finance 202 - FINA202; Human Resource Information Systems - HRMG2D0; Managing Workplace Diversity - HRMG2JO; Employee Wellness - HRMG2HO; Auditing 200 - ACCT221; Managerial Accounting and Finance - ACCT231; Financial Accounting 2B - ACCT212",
            "Choose six Level 2 electives according to your approved study plan"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Commerce – General|S5": [
            "Third-year major choices (select only modules in your registered discipline): Auditing 3A - ACCT321; Industrial Organisation - ECON305; International Economics - ECON306; Mathematical Economics - ECON310; Capital Market Theory - FINA311; Financial Risk Management - FINA312; Financial Accounting 3A - ACCT311; Employment Resourcing - HRMG3ER; Individual Employment Relations Law - HRMG3IE; Advanced Systems Analysis and Design - ISTN3SA; Applied Systems Implementation 1 - ISTN3AS; Mobile Technology and Cloud Computing - ISTN3MT; E-Commerce and e-Deployment - ISTN3EC; Applied Systems Implementation - ISNT3SI; Networking and Database Management - ISTN3ND; Information Systems and Technology Professional Skills - ISTN3PS; Corporate Strategy - MGNT307; Technology Management - MGNT314; Managerial Accounting and Financial Management 3A - ACCT331; Consumer Behaviour - MARK301; Marketing Research - MARK303; Development Policy and Project Management - PADM3A0; Organisational Change and Leadership - PADM3EO; Operations and Supply Chain Management - SCMA301; Purchasing Management and Contemporary Issues - SCMA305; Taxation 3A - ACCT341",
            "Select four third-year modules (64 credits) in your approved discipline; confirm semester availability with UKZN"
        ],

        "University of KwaZulu-Natal (UKZN)|Bachelor of Commerce – General|S6": [
            "Third-year major choices: Financial Accounting 3B - ACCT312; Auditing 3B - ACCT322; Managerial Accounting and Financial Management 3B - ACCT332; Taxation 3B - ACCT342",
            "Other third-year choices listed by UKZN include Economics, Finance, Human Resource Management, Information Systems and Technology, Management, Marketing, Public Governance and Supply Chain Management; choose only modules approved for your major",
            "Select four third-year modules (64 credits) in your approved discipline; confirm exact semester offerings with UKZN"
        ],

        "University of KwaZulu-Natal (UKZN)|BCom in Accounting Extended Curriculum|S5": [
            "Financial Accounting 3A - ACCT311",
            "Auditing 3A - ACCT321",
            "Managerial Accounting and Financial Management 3A - ACCT331",
            "Taxation 3A - ACCT341"
        ],

        "University of KwaZulu-Natal (UKZN)|BCom in Accounting Extended Curriculum|S6": [
            "Financial Accounting 3B - ACCT312",
            "Auditing 3B - ACCT322",
            "Managerial Accounting and Financial Management 3B - ACCT332",
            "Taxation 3B - ACCT342"
        ],

    };

    const savedYearTables = {};
    let currentYearKey = "";

    function saveCurrentYearTable() {
        if (!currentYearKey) return;

        savedYearTables[currentYearKey] = Array.from(
            studentModulesTable.querySelectorAll("tr")
        ).map(function (row) {
            return Array.from(row.querySelectorAll("input, select"))
                .map(function (field) {
                    return field.value;
                });
        });
    }

    function createModuleRow(values = []) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td><input type="text" placeholder="Module name"></td>
            <td>
                <select>
                    <option value="">Choose type</option>
                    <option>Test</option>
                    <option>Assignment</option>
                    <option>Exam</option>
                </select>
            </td>
            <td>
                <select>
                    <option value="">Choose number</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                </select>
            </td>
            <td><input type="number" min="0" max="100" placeholder="Mark"></td>
        `;

        row.querySelectorAll("input, select").forEach(function (field, index) {
            if (values[index] !== undefined) {
                field.value = values[index];
            }
        });

        return row;
    }

    yearSelect.addEventListener("change", function () {
        saveCurrentYearTable();

        if (!yearSelect.value) {
            currentYearKey = "";
            moduleStatus.textContent = "Choose your year or semester of study.";
            return;
        }

        const isMutStandard =
            institutionSelect.value === "Mangosuthu University of Technology (MUT)" &&
            qualificationSelect.value === "Diploma in Information Technology (Standard)";
        const isMutEcp =
            institutionSelect.value === "Mangosuthu University of Technology (MUT)" &&
            qualificationSelect.value === "Diploma in Information Technology (Extended Curriculum Programme)";
        const isMutITQualification = isMutStandard || isMutEcp;
        const selectedYear = Number(yearSelect.value);
        const specializationStartYear = isMutEcp ? 3 : 2;
        const requiresSpecialization =
            isMutITQualification && selectedYear >= specializationStartYear;

        specializationContainer.hidden = !requiresSpecialization;
        specializationContainer.style.display =
            requiresSpecialization ? "block" : "none";

        if (requiresSpecialization && !specializationSelect.value) {
            currentYearKey = "";
            studentModulesTable.replaceChildren();
            moduleStatus.textContent = isMutEcp
                ? "Choose ONE specialization before viewing Year 3 or Year 4 modules."
                : "Choose ONE specialization before viewing Year 2 or Year 3 modules.";
            return;
        }

        const selectedKey = requiresSpecialization
            ? institutionSelect.value + "|" + qualificationSelect.value + "|" +
                specializationSelect.value + "|" + yearSelect.value
            : institutionSelect.value + "|" + qualificationSelect.value + "|" +
                yearSelect.value;

        currentYearKey = selectedKey;
        studentModulesTable.replaceChildren();

        if (savedYearTables[selectedKey]) {
            savedYearTables[selectedKey].forEach(function (values) {
                studentModulesTable.appendChild(createModuleRow(values));
            });

            moduleStatus.textContent = verifiedModulesByYear[selectedKey]
                ? "Your module list is ready. Enter your assessment details and marks below."
                : "No configured module list is available for this selection. Please enter your assessment details manually below.";
            return;
        }

        const officialModules = verifiedModulesByYear[selectedKey];

        if (officialModules) {
            officialModules.forEach(function (moduleName) {
                studentModulesTable.appendChild(createModuleRow([moduleName]));
            });

            moduleStatus.textContent =
                "Your module list is ready. Enter your assessment details and marks below.";
            return;
        }

        studentModulesTable.appendChild(createModuleRow());

        moduleStatus.textContent =
            "No configured module list is available for this selection. Please enter your assessment details manually below.";
    });
})();


// STUDENT UNIVERSITY SCREEN: CHECK MY PROGRESS FEEDBACK
(function () {
    const button = document.getElementById("studentCheckProgressButton");
    const table = document.getElementById("studentModulesTable");
    const feedback = document.getElementById("studentProgressFeedback");

    if (!button || !table || !feedback) return;

    button.addEventListener("click", function () {
        const rows = Array.from(table.querySelectorAll("tr"));
        const incomplete = [];
        const good = [];
        const improve = [];

        rows.forEach(function (row, index) {
            row.style.backgroundColor = "";

            const fields = row.querySelectorAll("input, select");
            const name = fields[0] ? fields[0].value.trim() : "";
            const type = fields[1] ? fields[1].value : "";
            const number = fields[2] ? fields[2].value : "";
            const markText = fields[3] ? fields[3].value.trim() : "";

            if (!name || !type || !number || markText === "") {
                incomplete.push(index + 1);
                row.style.backgroundColor = "#fff3cd";
                return;
            }

            const mark = Number(markText);
            if (!Number.isFinite(mark) || mark < 0 || mark > 100) {
                incomplete.push(index + 1);
                row.style.backgroundColor = "#fff3cd";
                return;
            }

            if (mark >= 50) {
                good.push({name: name, mark: mark});
                row.style.backgroundColor = "#e2f4e8";
            } else {
                improve.push({name: name, mark: mark});
                row.style.backgroundColor = "#fde2e2";
            }
        });

        feedback.replaceChildren();

        const heading = document.createElement("h3");
        heading.textContent = "Your Progress Report";
        feedback.appendChild(heading);

        const summary = document.createElement("p");
        summary.textContent =
            "Completed assessments: " + (good.length + improve.length) +
            " | At least 50%: " + good.length +
            " | Below 50%: " + improve.length +
            " | Incomplete: " + incomplete.length;
        feedback.appendChild(summary);

        if (incomplete.length) {
            const title = document.createElement("h4");
            title.textContent = "Complete these entries";
            feedback.appendChild(title);

            incomplete.forEach(function (n) {
                const p = document.createElement("p");
                p.textContent =
                    "Row " + n +
                    ": complete the module, assessment type, assessment number and mark.";
                feedback.appendChild(p);
            });
        }

        if (good.length) {
            const title = document.createElement("h4");
            title.textContent = "🎉 Good work!";
            feedback.appendChild(title);

            good.forEach(function (item) {
                const p = document.createElement("p");
                p.textContent = item.name + " — " + item.mark +
                    "%. Good work on this assessment. Keep it up!";
                feedback.appendChild(p);
            });
        }

        if (improve.length) {
            const title = document.createElement("h4");
            title.textContent = "📌 Assessments to improve";
            feedback.appendChild(title);

            improve.forEach(function (item) {
                const p = document.createElement("p");
                p.textContent = item.name + " — " + item.mark +
                    "%. Review this topic, ask your lecturer for feedback, " +
                    "and prepare for the next assessment.";
                feedback.appendChild(p);
            });
        }

        const note = document.createElement("p");
        note.textContent =
            "This report checks individual assessment marks. " +
            "A mark of 50% does not automatically mean the whole module is passed. " +
            "Check your institution's module requirements.";
        feedback.appendChild(note);

        feedback.scrollIntoView({behavior: "smooth", block: "nearest"});
    });
})();


/* EMPLOYMENT AND ALUMNI SCREEN NAVIGATION */
function openJourneySection(sectionId) {
    ["screen1", "screen2", "screen3"].forEach(function(id) {
        const el = document.getElementById(id);
        if (el) el.classList.add("screen-hidden");
    });

    ["universityScreen", "studentUniversityScreen"].forEach(function(id) {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });

    const target = document.getElementById(sectionId);
    if (target) target.style.display = "block";
}

function closeJourneySection(sectionId) {
    const current = document.getElementById(sectionId);
    if (current) current.style.display = "none";

    const dashboard = document.getElementById("screen2");
    if (dashboard) dashboard.classList.remove("screen-hidden");
}

const employmentButton = document.getElementById("employmentButton");
const alumniButton = document.getElementById("alumniButton");

if (employmentButton) {
    employmentButton.addEventListener("click", function() {
        openJourneySection("employmentScreen");
    });
}

if (alumniButton) {
    alumniButton.addEventListener("click", function() {
        openJourneySection("alumniScreen");
    });
}
