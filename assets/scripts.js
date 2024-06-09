function loadContent(category, element) {
  const mainContent = document.getElementById("child");
  const ma = document.getElementById("cont");

  let content = "";

  switch (category) {
    case "constant":
      content = `
                <div class="column"><a href="../Algorithms/Constant Time Complexity (O(1))/power/index.html" id="power"><div class="box" id="algo">Power of the number</div></a></div>
                <div class="column"><a href="../Algorithms/Constant Time Complexity (O(1))/summation/index.html" id="summation"><div class="box" id="algo">Summation of the numbers</div></a></div>`;
      break;
    case "linear":
      content = `
                <div class="column"><a href="../Algorithms/Linear Time Complexity (O(n))/reverse_array/index.html" id="reversearray"><div class="box" id="algo">Reverse array processing</div></a></div>
                <div class="column"><a href="../Algorithms/Linear Time Complexity (O(n))/threshold/index.html" id="thresh"><div class="box" id="algo">Threshold image processing</div></a></div>`;
      break;
    case "factorial":
      content = `
                <div class="column"><a href="../Algorithms/Factorial time complexity (O(n!))/factorial/index.html" id="factorial"><div class="box" id="algo">Factorial of the number (Recursive)</div></a></div>
                <div class="column"><a href="../Algorithms/Factorial time complexity (O(n!))/permutation/index.html" id="permutation"><div class="box" id="algo">Continuous Permutation Calculation</div></a></div>`;
      break;
    case "quadratic":
      content = `
                <div class="column"><a href="../Algorithms/Quadratic Time Complexity ( O(n^2))/bubble_sort/index.html" id="bubble_sort"><div class="box" id="algo">Bubble sort</div></a></div>
                <div class="column"><a href="../Algorithms/Quadratic Time Complexity ( O(n^2))/selectionsort/index.html" id="selectionsort"><div class="box" id="algo">Selection sort</div></a></div>`;
      break;
    case "cubic":
      content = `
                <div class="column"><a href="../Algorithms/Cubic Time Complexity (O(n^3))/Cubic Polynomial Evaluation/index.html" id="cubicpoly"><div class="box" id="algo">Cubic Polynomial Evaluation</div></a></div>
                <div class="column"><a href="../Algorithms/Cubic Time Complexity (O(n^3))/Matrix Multiplication/index.html" id="matrixmul"><div class="box" id="algo">Matrix Multiplication</div></a></div>`;
      break;
    case "quartic":
      content = `
                <div class="column"><a href="../Algorithms/Quartic Time Complexity (O(n^4))/Nested Loop Multiplication/index.html" id="nesloopmul"><div class="box" id="algo">Nested Loop Multiplication</div></a></div>
                <div class="column"><a href="../Algorithms/Quartic Time Complexity (O(n^4))/Nested Loop Summation/index.html" id="nesloopsum"><div class="box" id="algo">Nested Loop Summation</div></a></div>`;
      break;
    case "logarithmic":
      content = `
                <div class="column"><a href="../Algorithms/Logarithmic Time Complexity (O(log n))/Binary Search Algorithm/index.html" id="binarysearch"><div class="box" id="algo">Binary Search Algorithm</div></a></div>
                <div class="column"><a href="../Algorithms/Logarithmic Time Complexity (O(log n))/Binary Search on Rotated Sorted Array/index.html" id="binaryrotated"><div class="box" id="algo">Binary Search on Rotated Sorted Array</div></a></div>`;
      break;
    case "loglinear":
      content = `
                <div class="column"><a href="../Algorithms/Loglinear Time Complexity (O(n log n))/image_generation_and_sort/index.html" id="imagegen"><div class="box" id="algo">Image generation and sort</div></a></div>
                <div class="column"><a href="../Algorithms/Loglinear Time Complexity (O(n log n))/quicksort/quick.html" id="quicksort"><div class="box" id="algo">Quick sort</div></a></div>`;
      break;
  }

  mainContent.innerHTML = content;
  highlightSelectedDiv(element);
  history.pushState({ category }, null, `#${category}`);
}

function highlightSelectedDiv(element) {
  // Remove the active class from all boxes
  const boxes = document.querySelectorAll(".box");
  boxes.forEach((box) => {
    box.classList.remove("active");
  });

  // Add the active class to the clicked box
  element.classList.add("active");
}

window.addEventListener("popstate", function (event) {
  if (event.state && event.state.category) {
    loadContent(event.state.category);
  } else {
    document.getElementById("child").innerHTML = "";
    const boxes = document.querySelectorAll(".box");
    boxes.forEach((box) => {
      box.classList.remove("active");
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  if (location.hash) {
    const category = location.hash.substring(1);
    const element = document.querySelector(
      `[onclick="loadContent('${category}', this)"]`
    );
    loadContent(category, element);
  }
});
