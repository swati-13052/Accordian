const APP_NAME = "ACCORDIAN";
(
  function () {

    const fetchUrl = "http://dummy.restapiexample.com/api/v1/employees";
    let allEmployees = [];
    let searchInputVal = "";

    let containerId = document.getElementById('container');
    let searchInput = document.getElementById("searchInput");
    let searchButton = document.getElementById("searchButton")
    let openedAccordian;

    containerId.addEventListener('click', showAccordian);
    searchInput.addEventListener('change', changeSearchInput);
    searchButton.addEventListener("click", searchEmployeeName);

    function searchEmployeeName() {
      let matchFound = false;
      allEmployees.forEach((employee, index) => {
        if (employee.employee_name.toLowerCase() === searchInputVal.toLowerCase()) {
          if(openedAccordian){
            closeClickedAccordian(openedAccordian)
          }
          openedAccordian = document.getElementById(index);
          if (!openedAccordian.classList.contains("active")) {
            openClickedAccordian(openedAccordian);
            openedAccordian.scrollIntoView();
          }
          matchFound = true;
        }
      });
      if(!matchFound && searchInputVal) {
        document.getElementById("errorText").textContent = "Searched Name doesnot exists in list";

        setTimeout(() => {
          document.getElementById("errorText").textContent = "";
        }, 3000);
      }
    }

    function changeSearchInput(event) {
      const value = event.target.value;
      searchInputVal = value;
    }

    function showAccordian(event) {
      let targetAccordian = event.target;
      let targetAccordianId = event.target.classList.contains('accor');
      searchInput.value = "";
      while (!targetAccordianId) {
        targetAccordian = event.target.parentNode;
        targetAccordianId = targetAccordian.classList.contains('accor');
        if (!targetAccordianId) {
          break;
        }
      }
      if (targetAccordianId) {

        if (openedAccordian) {
          closeClickedAccordian(openedAccordian);
        }

        if (openedAccordian !== targetAccordian) {
          openedAccordian = targetAccordian;
          openClickedAccordian(openedAccordian)
        } else {
          openedAccordian = null;
        }
      }
    }

    function openClickedAccordian() {
      openedAccordian.children[1].classList.remove('unactive');
      openedAccordian.children[1].classList.add('active');
      openedAccordian.children[0].children[1].classList.remove('down_arrow');
      openedAccordian.children[0].children[1].classList.add('up_arrow');
    }

    function closeClickedAccordian() {
      if (openedAccordian) {
        let openedContent = openedAccordian.children[1];
        let openedHeading = openedAccordian.children[0];
        openedContent.classList.remove('active');
        openedContent.classList.add('unactive');
        openedHeading.children[1].classList.remove('up_arrow');
        openedHeading.children[1].classList.add('down_arrow');
      }
    }

    function createAccordianContent(employee) {
      let accordianContentCont = document.createElement("div");
      accordianContentCont.setAttribute("class", "accor_content unactive");

      let salaryDiv = document.createElement("div");
      salaryDiv.textContent = `Employee Salary:  Rs. ${employee.employee_salary}`;

      let ageDiv = document.createElement("div");
      ageDiv.textContent = `Employee Age:  ${employee.employee_age}`;

      accordianContentCont.appendChild(salaryDiv);
      accordianContentCont.appendChild(ageDiv);

      return accordianContentCont;
    }

    function createAccordianHeader(employee) {
      let accordianHeader = document.createElement("div");
      accordianHeader.setAttribute("class", "accor_heading");

      let accordingHeading = document.createElement("span");
      accordingHeading.textContent = employee.employee_name;

      let arrow = document.createElement("i");
      arrow.setAttribute("class", "down_arrow");
      arrow.setAttribute("aria-hidden", true);

      accordianHeader.appendChild(accordingHeading);
      accordianHeader.appendChild(arrow);
      return accordianHeader;
    }

    function displayEmployees() {
      allEmployees.forEach((employee, index) => {
        let accordianContainer = document.createElement("div");
        accordianContainer.setAttribute("id", index);
        accordianContainer.setAttribute("class", "accor");

        let accordianHeader = createAccordianHeader(employee, index);
        let accordianContnet = createAccordianContent(employee);

        accordianContainer.appendChild(accordianHeader);
        accordianContainer.appendChild(accordianContnet);
        containerId.appendChild(accordianContainer);
      });
    }

    function setAllEmployeeData(employeeData) {
      const { data } = employeeData
      data.forEach(employee => {
        allEmployees.push(employee);
      });

      displayEmployees();
    }

    function getEmployeeData(callback) {
      let xttp = new XMLHttpRequest;
      xttp.onreadystatechange = function () {
        if (this.status === 200 && this.readyState === 4) {
          callback(JSON.parse(this.responseText));
        }
      }
      xttp.open("GET", fetchUrl);
      xttp.send();
    }

    getEmployeeData(setAllEmployeeData)
  }
)(APP_NAME)
