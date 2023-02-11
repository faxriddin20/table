const TOTAL_MARK = 150;
const TOTAL_MARK_PERCENT = 100;



const addZero = function(number){
    return number < 10 ? "0" + number:number
};

const studentsTemplate = document.querySelector("#student-template") 

const renderStudent = function(student){
    const{id,name,lastName,mark,markedDate}=student;
    const studentRow = studentsTemplate.content.cloneNode(true);
    studentRow.querySelector(".student-id").textContent = id;
    studentRow.querySelector(".student-name").textContent = `${name} ${lastName}`;
    studentRow.querySelector(".student-marked-date").textContent =  new Date().getHours() + " : " + new Date().getMinutes() + " : " + new Date().getSeconds();
    const markPercent = Math.round(mark*TOTAL_MARK_PERCENT/TOTAL_MARK);
    studentRow.querySelector(".student-mark").textContent = markPercent + "%";
    const failStudentMark = 40;
    const studentBadge = studentRow.querySelector(".student-pass-status");
    if(markPercent >= failStudentMark){
        studentBadge.textContent = "Pass";
        studentBadge.classList.add("bg-success");
    }
    else{
        studentBadge.textContent = "Fail";
        studentBadge.classList.add("bg-danger");
    };
    const studentsEditBtn = studentRow.querySelector(".student-edit");
    studentsEditBtn.setAttribute("data-id",id);
    const StudentsDelBtn = studentRow.querySelector(".student-delete");
    StudentsDelBtn.setAttribute("data-id", id)
    return studentRow;
};
const studentsTableBody = document.querySelector("#students-table-body");
let showingStudents = students.slice();
let count = document.querySelector(".count");
const avMark = document.querySelector(".text-end");
const renderStudents = function(){
    studentsTableBody.innerHTML = "";
    let sum = 0;
    students.forEach(student => {
        sum += student.mark 
    });
    if(sum <= 0){
        count.textContent = `No More Students`
        avMark.textContent = `No percent`
    }
    else if(sum > 0){
        count.textContent = `Count: ${students.length}`;
        avMark.textContent = "Mark" + Math.round(sum * 100 / 150 / students.length) + "%"
    }
    const studentsFragment  = document.createDocumentFragment();
    students.forEach(student => {
        const studentRow = renderStudent(student);
        studentsFragment.append(studentRow);
    })
    studentsTableBody.append(studentsFragment);
}

renderStudents();

const addForm = document.querySelector("#add-form");
const addStudentModalE1 = document.querySelector("#add-student-modal");
const addStudentModal  = new bootstrap.Modal(addStudentModalE1)
addForm.addEventListener("submit", function(evt){
    evt.preventDefault();
    const nameValue = evt.target[0].value;
    const lastNameValue = evt.target[1].value;
    const markValue = +evt.target[2].value;

    if(nameValue &&lastNameValue &&markValue){
        const newStudent = {
            id:Math.floor(Math.random() * 100),
            name: nameValue,
            lastName:lastNameValue,
            mark:markValue,
            markedDate:new Date().toISOString()

        }
        students.push(newStudent);
        localStorage.setItem("students",JSON.stringify(students));
    }
    addForm.reset();
    renderStudents();
    addStudentModal.hide()
})

const editForm = document.querySelector("#edit-form");
// const editFormModal = document.querySelector("#edit-form-modal");
// const editFormE1Modal = new bootstrap.Modal(editFormModal);
const studentsTable = document.querySelector("#students-table");

const editName = document.querySelector("#edit-name");
const editLastName = document.querySelector("#edit-lastname");
const editMark = document.querySelector("#edit-mark");


studentsTable.addEventListener("click",function(evt){
    if(evt.target.matches(".btn-outline-danger")){
        const delStudent = +evt.target.dataset.id;
        const studentDelIndex = students.findIndex(student =>{
            return student.id === delStudent
        });
        students.splice(studentDelIndex,1);
        localStorage.setItem("students",JSON.stringify(students));
    } else if(evt.target.matches(".btn-outline-secondary")){
        const editStudent = +evt.target.dataset.id;
        const editStudentIndex = students.find(student => {
            return student.id === editStudent
        })
        editName.value = editStudentIndex.name;
        editLastName.value = editStudentIndex.lastName;
        editMark.value = editStudentIndex.mark;
        editForm.setAttribute("data-editingId",editStudentIndex.id)
    }
    renderStudents()
})

editForm.addEventListener("submit",function(evt){
    evt.preventDefault();

    const editingForm = +evt.target.dataset.editingId;

    const editingName = evt.target[0].value;
    const editingLastName = evt.target[1].value;
    const editingMark = +evt.target[2].value;

    if(editingName.trim() && editingLastName.trim() && editingMark >= 0 && editingMark <= 150){
        const editingStudent = {
            id: Math.floor(Math.random()*100),
            name: editingName,
            lastName: editingLastName,
            mark: editingMark,
            markedDate: new Date()
        }
        const editingStudentIndex = students.findIndex(student => {
            return student.id === editingForm;
        });
        students.splice(editingStudentIndex,1,editingStudent);
        localStorage.setItem("students",JSON.stringify(students));
    }
    editForm.reset();
    renderStudents();
});

const filterForm = document.querySelector(".filter");

filterForm.addEventListener("submit", function(evt) {
  evt.preventDefault();

  const searchValue = evt.target[0].value;
  const fromValue = evt.target[1].value;
  const toValue = evt.target[2].value;
  const sortValue = evt.target[3].value;

  students.sort(function(a, b) {
      switch(sortValue) {
        case "1": {
          if(a.name > b.name) {
            return 1
          } else if (b.name > a.name) {
            return -1
          } else {
            return 0
          }
        }
        case "2": {
         return b.mark - a.mark
        }
        case "3": {
          return a.mark - b.mark
        }
        case "4": {
          return new Date(a.markedDate).getTime() - new Date(b.markedDate).getTime()
        }
      }
  })
  .filter(student => {

    const totalMarkPercent = Math.round(student.mark * 100 / 150);
   
    const searchRegExp = new RegExp(searchValue, "gi");
    
    const totalCondition = !toValue ? true : totalMarkPercent <= toValue;
    
    const nameLastName = `${student.name} ${student.lastname}`;

    return totalMarkPercent >= fromValue && totalCondition && nameLastName.match(searchRegExp);
  })

  renderStudents();
});









