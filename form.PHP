<?php
// Define database connection parameters
$serverName = "DYLAN256/JENNY"; 
$databaseName = "CaltechSolutions";
$uid = "sa"; 
$pwd = "skylz256"; 

$connectionInfo = array(
    "UID" => $uid,
    "PWD" => $pwd,
    "Database" => $databaseName
);

// Establish the connection
$conn = sqlsrv_connect($serverName, $connectionInfo);

// Check for connection errors
if ($conn === false) {
    die(print_r(sqlsrv_errors(), true));
}

// Check if the form was submitted using the POST method
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Sanitize and get form data
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $subject = htmlspecialchars($_POST['subject']);
    $message = htmlspecialchars($_POST['message']);

    // SQL query to insert data. Using '?' for prepared statement to prevent SQL injection.
    $sql = "INSERT INTO contact_submissions (name, email, subject, message) VALUES (?, ?, ?, ?)";
    
    // Create an array with the sanitized data
    $params = array($name, $email, $subject, $message);

    // Prepare and execute the statement
    $stmt = sqlsrv_query($conn, $sql, $params);

    if ($stmt === false) {
        // Log the error and show a generic message to the user
        // In a real environment, you wouldn't show the error details to the public
        echo "<h3>Message failed to send. Please try again.</h3>";
        die(print_r(sqlsrv_errors(), true));
    } else {
        // Success message
        echo "<h3>Thank you! Your message has been sent successfully.</h3>";
    }

    // Close the connection
    sqlsrv_close($conn);

} else {
    // If someone tries to access this script directly
    echo "<h3>Access Denied.</h3>";
}
?>