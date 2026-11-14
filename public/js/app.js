document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("plannerForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    const weight = Number(form.elements.weight.value);
    const height = Number(form.elements.height.value);
    const age = Number(form.elements.age.value);
    if (weight < 25 || weight > 300 || height < 120 || height > 230 || age < 15 || age > 100) {
      event.preventDefault();
      alert("Please enter valid details: weight 25–300 kg, height 120–230 cm and age 15–100 years.");
      return;
    }
    const button = form.querySelector(".submit-btn");
    button.disabled = true;
    button.innerHTML = "Calculating your plan…";
  });

  const result = document.getElementById("results");
  if (result) {
    setTimeout(() => result.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  }
});