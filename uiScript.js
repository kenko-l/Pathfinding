// Open the sidebar
function openSidebar() {
    document.getElementById("sidebar").style.width = "250px";
  }
  
  // Close the sidebar
  function closeSidebar() {
    document.getElementById("sidebar").style.width = "0";
  }
  
  // Toggle dropdown visibility
  document.querySelectorAll('.dropdown-toggle').forEach(function(toggle) {
    toggle.addEventListener('click', function() {
      var dropdownContent = this.nextElementSibling;
      if (dropdownContent.classList.contains('show')) {
        dropdownContent.classList.remove('show');
      } else {
        document.querySelectorAll('.dropdown-content').forEach(function(content) {
          content.classList.remove('show');
        });
        dropdownContent.classList.add('show');
      }
    });
  });
  
  function triggerAnimation(element) {
    element.classList.remove('animate');
    // Trigger reflow to restart animation
    void element.offsetWidth; 
    element.classList.add('animate');
  }