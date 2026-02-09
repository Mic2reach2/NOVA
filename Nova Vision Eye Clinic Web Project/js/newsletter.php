<?php
$email = $_POST['email'];

if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
    file_put_contents("subscribers.txt", $email . PHP_EOL, FILE_APPEND);
    echo "Thank you for subscribing!";
} else {
    echo "Invalid email address.";
}
