✨ Key Features

🧑‍💼 User Registration
• Register with name, email, phone number (using intl-tel-input), and password.
• Client-side validation ensures all fields are correctly filled before submission.

🔐 Authentication
• Simple login system using localStorage to store user credentials securely.
• Displays error messages for invalid or empty inputs.

🏠 Home Screen with Instructions
• Clearly outlines test guidelines.
• Includes a Start Test button to begin the quiz.

📝 Quiz Flow
• Includes 5 multiple-choice questions, each with 3 options.
• Immediate feedback after selecting an answer (correct/incorrect).
• A 30-minute countdown timer displayed in MM:SS format.
• Navigation logic to move through the quiz.
• Visually paired with a themed illustrative image beside the questions.

📊 Results Summary
• Displays:
• ✅ Correct and ❌ incorrect answers.
• ⏱️ Time taken to complete the quiz.
• Automatically stores the latest 3 attempts in IndexedDB.
• Options to:
• 🔁 Restart the quiz.
• 🏡 Return to the home screen.
• ❌ Delete attempt history.

📱 Responsive Design
• Built with Tailwind CSS for a clean and responsive layout.
• Optimized for:
• 📱 Mobile devices
• 💻 Tablets
• 🖥️ Desktop screens

🌐 AJAX-Based Data Handling
• Data (user info + quiz answers) is sent via AJAX (fetch API) to a backend hosted on Render.
