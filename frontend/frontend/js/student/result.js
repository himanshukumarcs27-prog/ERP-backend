const API = "http://localhost:3000/api/results/my";

async function loadResult() {
  const res = await fetch(API);
  const data = await res.json();

  const table = document.getElementById("resultTable");

  let total = 0;
  let labels = [];
  let marksArr = [];

  table.innerHTML = "";

  data.forEach(r => {
    table.innerHTML += `
      <tr>
        <td>${r.subject.name}</td>
        <td>${r.marks}</td>
      </tr>
    `;

    total += r.marks;
    labels.push(r.subject.name);
    marksArr.push(r.marks);
  });

  const percentage = total / data.length;

  document.getElementById("total").innerText = total;
  document.getElementById("percentage").innerText = percentage.toFixed(2);

  let grade = "F";
  if (percentage >= 90) grade = "A";
  else if (percentage >= 75) grade = "B";
  else if (percentage >= 60) grade = "C";

  document.getElementById("grade").innerText = grade;

  // Chart
  new Chart(document.getElementById("chart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Marks",
        data: marksArr
      }]
    }
  });
}

loadResult();