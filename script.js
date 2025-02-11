let highestZ = 1;

// Fungsi untuk mendapatkan sudut antara dua jari
function getAngle(touches) {
  let dx = touches[1].clientX - touches[0].clientX;
  let dy = touches[1].clientY - touches[0].clientY;
  return Math.atan2(dy, dx) * (180 / Math.PI);
}

document.addEventListener("DOMContentLoaded", function () {
  const papers = document.querySelectorAll(".paper");

  papers.forEach((paper) => {
    paper.style.touchAction = "none"; // Mencegah konflik dengan scrolling bawaan
    paper.addEventListener("mousedown", startDrag);
    paper.addEventListener("touchstart", startDrag);

    let lastRotation = 0;
    let initialAngle = 0;
    let isRotating = false;
    
    function startDrag(event) {
      event.preventDefault();
      
      // Pastikan objek selalu berada di lapisan paling atas
      paper.style.zIndex = highestZ;
      highestZ += 1;

      let startX = event.clientX || event.touches[0].clientX;
      let startY = event.clientY || event.touches[0].clientY;

      if (event.touches && event.touches.length === 2) {
        // Jika ada dua jari, aktifkan rotasi
        initialAngle = getAngle(event.touches);
        isRotating = true;
      }

      function moveDrag(e) {
        if (isRotating && e.touches.length === 2) {
          let currentAngle = getAngle(e.touches);
          let rotationChange = currentAngle - initialAngle;
          paper.style.transform = `rotate(${lastRotation + rotationChange}deg)`;
          return;
        }

        let moveX = e.clientX || e.touches[0].clientX;
        let moveY = e.clientY || e.touches[0].clientY;

        let deltaX = moveX - startX;
        let deltaY = moveY - startY;

        paper.style.transform = `translate(${deltaX}px, ${deltaY}px) rotateZ(-5deg)`;
      }

      function stopDrag(e) {
        if (isRotating) {
          lastRotation = parseFloat(paper.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
          isRotating = false;
        }
        
        document.removeEventListener("mousemove", moveDrag);
        document.removeEventListener("touchmove", moveDrag);
        document.removeEventListener("mouseup", stopDrag);
        document.removeEventListener("touchend", stopDrag);
      }

      document.addEventListener("mousemove", moveDrag);
      document.addEventListener("touchmove", moveDrag);
      document.addEventListener("mouseup", stopDrag);
      document.addEventListener("touchend", stopDrag);
    }
  });
});
