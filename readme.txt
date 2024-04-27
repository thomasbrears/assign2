<!-- COMP721: Web Development
     Assignment 2
     Thomas Brears, #20122554, fcx9443 
-->
<!DOCTYPE html>
<html lang="en">
	<head>
		<!-- Meta Tags -->
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title> | AUT Comp721 Assignment 2</title>
		<!-- Styling -->
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css">
		<link rel="stylesheet" href="style.css">
		<!-- Java Script file -->
		<script src="script.js" defer></script>
	</head>
    
    <body>
	   <!-- Navigation Bar -->
        <nav id="navbar">
          <div class="nav-container">
            <span class="brand-name"> Status Posting </span>
            <div class="menu-icon" onclick="toggleMenu()">
              <i class="fa fa-bars"></i>
            </div>
            <div class="nav-links">
              <a href="index.html">Home</a>
              <a href="about.html">About</a>
              <a href="poststatusform.php">New Status</a>
              <a href="searchstatusform.html">Search Status</a>
              <a target="_blank" href="github.com/thomasbrears/assign1">Github Repo</a>
            </div>
          </div>
        </nav>
        
        <div class="content">
            <h2>Search Status</h2>
            
        </div>

        <!-- Footer Section -->
        <footer>
            <div class="footer-content">
                <!-- Copyright Section -->
                <div class="footer-copy">
                    <p>&copy; <script>
                            var CurrentYear = new Date().getFullYear();
                            document.write(CurrentYear);
                        </script> Thomas Brears | <a href="github.com/thomasbrears/assign2"> Github Repo</a>
                    </p>
                </div>
            </div>
        </footer>  
    </body>
</html>
