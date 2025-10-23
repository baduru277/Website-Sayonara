<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Access Portal</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f0f0f5; /* Light subtle background */
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 1rem;
        }
        
        /* Define Custom Purple Color for Tailwind (based on user image) */
        .primary-purple { background-color: #A052D9; }
        .primary-purple-text { color: #A052D9; }
        .hover\:primary-purple-hover:hover { background-color: #8C48C2; }
        .border-primary-purple { border-color: #A052D9; }

        /* Custom glow effect for inputs */
        .input-glow:focus {
            outline: none;
            border-color: #A052D9;
            box-shadow: 0 0 0 3px rgba(160, 82, 217, 0.1); /* Subtle inner glow */
            background-color: #fefdff; /* Slightly whiter background on focus */
        }
        
        /* Custom input style to match image */
        .form-input {
            width: 100%;
            padding: 12px;
            border: 1px solid #e5e7eb;
            background-color: #faf7ff; /* Very light purple/white background */
            border-radius: 12px;
            transition: all 0.2s;
        }
        .tab-indicator {
            height: 2px;
            background-color: #A052D9;
            transition: transform 0.3s ease;
        }
    </style>
</head>
<body>

    <!-- Message Box -->
    <div id="message-box" class="fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-opacity duration-300 opacity-0 pointer-events-none">
        <div id="message-content" class="px-4 py-2 rounded-lg shadow-xl text-white font-medium"></div>
    </div>

    <!-- Auth Modal (The main content, always visible) -->
    <div id="auth-modal" class="bg-white w-full max-w-sm m-4 p-6 rounded-2xl shadow-2xl relative transform transition-all duration-300">
        <!-- Content will be rendered here -->
    </div>

    <div class="fixed bottom-4 right-4 text-xs text-gray-500" id="user-info"></div>

    <!-- Firebase SDK Imports -->
    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
        import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

        // Global Variables
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
        const __initial_auth_token = typeof window.__initial_auth_token !== 'undefined' ? window.__initial_auth_token : undefined;

        let app, db, auth;
        let userId = null;
        let currentAuthView = 'login'; // State for tab switching

        /**
         * Utility function to display non-blocking messages (instead of alert()).
         * @param {string} message - The message to display.
         * @param {'success'|'error'|'info'} type - The type of message.
         */
        function showMessage(message, type = 'info') {
            const box = document.getElementById('message-box');
            const content = document.getElementById('message-content');

            // Using Primary Purple for success messages
            let bgColor = 'bg-gray-700';
            if (type === 'success') bgColor = 'primary-purple';
            if (type === 'error') bgColor = 'bg-red-600';

            content.textContent = message;
            content.className = `px-4 py-2 rounded-lg shadow-xl text-white font-medium ${bgColor}`;

            // Show and fade out
            box.style.opacity = '1';
            box.style.pointerEvents = 'auto';

            setTimeout(() => {
                box.style.opacity = '0';
                box.style.pointerEvents = 'none';
            }, 3000);
        }

        // --- Firebase Initialization and Authentication Setup ---

        try {
            app = initializeApp(firebaseConfig);
            db = getFirestore(app);
            auth = getAuth(app);

            // 1. Initial Authentication
            const setupAuth = async () => {
                try {
                    if (__initial_auth_token) {
                        await signInWithCustomToken(auth, __initial_auth_token);
                    } else {
                        await signInAnonymously(auth);
                    }
                } catch (error) {
                    console.error("Authentication setup failed:", error);
                    showMessage(`Auth error: ${error.message}`, 'error');
                }
            };
            setupAuth();

            // 2. Auth State Listener (Simplified: only shows user ID, no view switching)
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    userId = user.uid;
                } else {
                    userId = null;
                }
                const userInfoEl = document.getElementById('user-info');
                // Display the current user state
                if (userId && auth.currentUser.email) {
                    userInfoEl.innerHTML = `Signed in as: <span class="font-bold">${auth.currentUser.email}</span>`;
                } else if (userId) {
                    userInfoEl.innerHTML = `Signed in anonymously. ID: ${userId}`;
                } else {
                    userInfoEl.textContent = 'Signed out.';
                }
                
                // Always render the modal content
                renderAuthModal(); 
            });

        } catch (error) {
            console.error("Firebase initialization failed:", error);
            showMessage("Error initializing Firebase. Check your config.", 'error');
        }

        // --- UI Rendering Functions ---

        const authModal = document.getElementById('auth-modal');

        function renderAuthModal() {
            // Tab content rendering
            let formContent = '';
            let submitButtonText = '';
            let formId = '';
            let toggleLinkText = '';
            let toggleView = '';

            // If a user is logged in (and the modal is kept), show a simple logged-in message and a log-out button
            if (userId && auth.currentUser.email) {
                authModal.innerHTML = `
                    <div class="text-center p-4">
                        <h2 class="text-2xl font-bold primary-purple-text mb-4">Welcome Back!</h2>
                        <p class="text-gray-600 mb-6">You are currently logged in as:</p>
                        <p class="font-semibold text-lg text-gray-800 break-words">${auth.currentUser.email}</p>
                        <button id="logout-button" class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition duration-150 shadow-md mt-6">
                            Log Out
                        </button>
                    </div>
                `;
                 document.getElementById('logout-button').addEventListener('click', handleLogout);
                return; // Stop rendering the form if logged in
            }


            // --- Content for Log In Tab ---
            if (currentAuthView === 'login') {
                formId = 'login-form';
                submitButtonText = 'LOG IN';
                toggleLinkText = 'Need an account? Sign Up';
                toggleView = 'register';
                formContent = `
                    <div class="space-y-4">
                        <label class="block text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" id="login-email" placeholder="sarika1@gmail.com" required
                            class="form-input input-glow">
                        
                        <label class="block text-sm font-medium text-gray-700 pt-2">Password</label>
                        <div class="relative">
                            <input type="password" id="login-password" placeholder="••••••••••••" required
                                class="form-input input-glow">
                        </div>
                    </div>
                `;
            } 
            
            // --- Content for Sign Up Tab (Register) ---
            else { 
                formId = 'register-form';
                submitButtonText = 'SIGN UP';
                toggleLinkText = 'Already have an account? Log In';
                toggleView = 'login';
                formContent = `
                    <div class="text-red-600 text-sm mb-4" id="register-error-message"></div>
                    <div class="space-y-4">
                        <label class="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" id="register-name" placeholder="Enter your name" required
                            class="form-input input-glow">

                        <label class="block text-sm font-medium text-gray-700 pt-2">Email Address</label>
                        <input type="email" id="register-email" placeholder="sarika1@gmail.com" required
                            class="form-input input-glow">
                        
                        <label class="block text-sm font-medium text-gray-700 pt-2">Password</label>
                        <input type="password" id="register-password" placeholder="••••••••••••" required
                            class="form-input input-glow">
                        
                        <label class="block text-sm font-medium text-gray-700 pt-2">Confirm Password</label>
                        <input type="password" id="register-confirm-password" placeholder="Confirm your password" required
                            class="form-input input-glow">
                    </div>
                    
                    <div class="flex items-start mt-6 text-center justify-center">
                        <div class="flex items-center h-5">
                            <input id="terms-checkbox" aria-describedby="terms" type="checkbox" required
                                class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500">
                        </div>
                        <div class="ml-2 text-sm text-gray-500">
                            Are you agree to <a href="#" class="primary-purple-text hover:underline font-medium">Sayonara Terms of Condition</a> and <a href="#" class="primary-purple-text hover:underline font-medium">Privacy Policy</a>.
                        </div>
                    </div>
                `;
            }
            
            // Full Modal Structure
            authModal.innerHTML = `
                <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl">
                    &times;
                </button>

                <!-- Tabs -->
                <div class="flex border-b border-gray-200 mb-6 relative">
                    <button data-view="login" class="flex-1 text-center py-3 text-lg font-semibold transition duration-200 ${currentAuthView === 'login' ? 'primary-purple-text' : 'text-gray-500 hover:text-gray-700'}">
                        Log In
                    </button>
                    <button data-view="register" class="flex-1 text-center py-3 text-lg font-semibold transition duration-200 ${currentAuthView === 'register' ? 'primary-purple-text' : 'text-gray-500 hover:text-gray-700'}">
                        Sign Up
                    </button>
                    <!-- Animated Indicator -->
                    <div class="tab-indicator absolute bottom-0 w-1/2 ${currentAuthView === 'login' ? 'left-0' : 'left-1/2'}" style="transform: translateX(${currentAuthView === 'login' ? '0' : '0'});"></div>
                </div>

                <!-- Form -->
                <form id="${formId}" class="space-y-6">
                    ${formContent}
                    <button type="submit" class="w-full mt-6 py-3 rounded-xl primary-purple hover:primary-purple-hover text-white font-semibold text-lg transition duration-200 shadow-lg shadow-purple-200/50">
                        ${submitButtonText}
                    </button>
                </form>

                <!-- Toggle Link -->
                <div class="text-center mt-6">
                    <button id="auth-toggle-btn" data-toggle="${toggleView}" class="text-sm text-gray-500 hover:text-gray-800 transition duration-150">
                        ${toggleLinkText}
                    </button>
                </div>
            `;

            // Attach Event Listeners
            document.getElementById(formId).addEventListener('submit', currentAuthView === 'login' ? handleLogin : handleRegister);
            document.getElementById('auth-toggle-btn').addEventListener('click', () => {
                currentAuthView = toggleView;
                renderAuthModal();
            });
            document.querySelectorAll('#auth-modal button[data-view]').forEach(button => {
                button.addEventListener('click', (e) => {
                    currentAuthView = e.target.getAttribute('data-view');
                    renderAuthModal();
                });
            });
        }


        // --- Authentication Handlers ---

        async function handleRegister(e) {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const errorEl = document.getElementById('register-error-message');
            errorEl.textContent = ''; // Clear previous errors

            if (password !== confirmPassword) {
                errorEl.textContent = 'Passwords do not match.';
                return;
            }

            if (password.length < 6) {
                 errorEl.textContent = 'Password must be at least 6 characters long.';
                return;
            }

            try {
                // Creates the user and automatically signs them in
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                
                // Optional: Store the name in Firestore (private user data)
                const user = userCredential.user;
                // Note: Storing in a subcollection under the user's private path
                const userDocRef = doc(db, `/artifacts/${appId}/users/${user.uid}/profile/details`);
                await setDoc(userDocRef, { name: name, email: email, createdAt: new Date() });

                // Since we're in a portal view, a successful register should prompt a refresh of the modal
                showMessage("Registration successful! You are now logged in.", 'success');
                renderAuthModal(); // Show the 'Welcome Back' message
            } catch (error) {
                console.error("Registration failed:", error);
                
                let displayMessage = 'An unexpected error occurred during registration.';
                if (error.code === 'auth/email-already-in-use') {
                    displayMessage = 'The email address is already registered.';
                } else if (error.code === 'auth/invalid-email') {
                    displayMessage = 'The email address is not valid.';
                } else if (error.code === 'auth/weak-password') {
                     displayMessage = 'Password is too weak. Must be at least 6 characters.';
                }
                
                errorEl.textContent = displayMessage; // Display error on form
                showMessage(displayMessage, 'error'); // Display error message box
            }
        }

        async function handleLogin(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                await signInWithEmailAndPassword(auth, email, password);
                // Since we're in a portal view, a successful login should prompt a refresh of the modal
                showMessage("Login successful!", 'success');
                renderAuthModal(); // Show the 'Welcome Back' message
            } catch (error) {
                console.error("Login failed:", error);
                
                let errorMessage = 'Login failed. Please check your email and password.';
                if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                    errorMessage = 'Invalid email or password.';
                }
                
                showMessage(errorMessage, 'error');
            }
        }

        async function handleLogout() {
            try {
                await signOut(auth);
                // After logout, the onAuthStateChanged listener will call renderAuthModal()
                showMessage("Logged out successfully.", 'info');
            } catch (error) {
                console.error("Logout failed:", error);
                showMessage(`Logout Error: ${error.message}`, 'error');
            }
        }
        
        // Initial render of the modal is handled by onAuthStateChanged
    </script>
</body>
</html>
