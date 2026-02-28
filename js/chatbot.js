document.addEventListener('DOMContentLoaded', () => {
    // Chatbot Functionality
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');
    const chatValidationMessage = document.getElementById('chat-validation-message');

    const MAX_MESSAGE_LENGTH = 300;

    function showValidationMessage(text) {
        if (!chatValidationMessage) return;
        chatValidationMessage.textContent = text;
        chatValidationMessage.hidden = false;
        chatValidationMessage.classList.add('chat-validation-visible');
        chatInput.setAttribute('aria-invalid', 'true');
        // Auto-hide after 4 seconds
        clearTimeout(chatValidationMessage._hideTimer);
        chatValidationMessage._hideTimer = setTimeout(hideValidationMessage, 4000);
    }

    function hideValidationMessage() {
        if (!chatValidationMessage) return;
        chatValidationMessage.hidden = true;
        chatValidationMessage.classList.remove('chat-validation-visible');
        chatInput.removeAttribute('aria-invalid');
        clearTimeout(chatValidationMessage._hideTimer);
    }

    function handleUserMessage() {
        const text = chatInput.value.trim();

        if (!text || text.length === 0) {
            showValidationMessage('Please enter a message');
            return;
        }
        if (text.length > MAX_MESSAGE_LENGTH) {
            showValidationMessage('Message cannot exceed 300 characters');
            return;
        }

        hideValidationMessage();
        addMessage(text, true);
        chatInput.value = '';

        // Simulate thinking delay
        setTimeout(() => {
            getBotResponse(text);
        }, 600);
    }

    function toggleChat() {
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
            chatInput.focus();
        } else {
            hideValidationMessage();
        }
    }

    chatbotToggle.addEventListener('click', toggleChat);
    closeChat.addEventListener('click', toggleChat);

    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
        messageDiv.innerText = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Chatbot State
    let chatState = {
        askedName: false,
        userName: ''
    };

    const knowledgeBase = [
        {
            keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'],
            response: () => {
                const hour = new Date().getHours();
                let timeGreeting = "Good morning";
                if (hour >= 12 && hour < 18) timeGreeting = "Good afternoon";
                else if (hour >= 18) timeGreeting = "Good evening";

                if (chatState.userName) {
                    return `${timeGreeting}, ${chatState.userName}! How can I help you with your digital transformation today?`;
                } else {
                    chatState.askedName = true;
                    return `${timeGreeting}! Welcome to Danizta. Before we start, may I know your name?`;
                }
            }
        },
        {
            keywords: ['name', 'im', 'i am', 'call me'],
            matchFunction: (input) => {
                if (chatState.askedName) {
                    // Extract name (simple heuristic)
                    const words = input.split(' ');
                    const name = words[words.length - 1]; // Assume last word is name for simplicity
                    chatState.userName = name.charAt(0).toUpperCase() + name.slice(1);
                    chatState.askedName = false;
                    return `Nice to meet you, ${chatState.userName}! How can I assist you? We specialize in AI, SaaS, and Mobile solutions.`;
                }
                return null;
            }
        },
        {
            keywords: ['ai', 'machine learning', 'artificial intelligence', 'ml', 'predictive'],
            response: "Our AI & Machine Learning solutions help you automate workflows, predict trends, and personalize user experiences. We use Python, TensorFlow, and PyTorch."
        },
        {
            keywords: ['saas', 'software', 'cloud', 'enterprise', 'platform', 'web app'],
            response: "We build scalable, cloud-native Enterprise SaaS applications. We focus on high availability, security, and performance using technologies like React, Node.js, and AWS/Azure."
        },
        {
            keywords: ['mobile', 'app', 'ios', 'android', 'flutter', 'react native'],
            response: "We create cross-platform mobile experiences that feel native. Whether it's iOS or Android, we ensure a seamless and engaging user journey."
        },
        {
            keywords: ['pricing', 'cost', 'quote', 'price', 'rates', 'how much'],
            response: "Our pricing is tailored to the specific needs and scope of each project. We'd love to discuss your requirements to provide an accurate quote. Please message us via the contact form!"
        },
        {
            keywords: ['tech', 'technology', 'stack', 'languages', 'frameworks'],
            response: "We are language-agnostic but expert in modern stacks: JavaScript/TypeScript (React, Node, Next.js), Python (Django, FastAPI, AI/ML), .NET, and cloud platforms."
        },
        {
            keywords: ['location', 'where', 'office', 'address', 'city'],
            response: "We are headquartered at 637 E Big Beaver Rd. However, we work with clients globally."
        },
        {
            keywords: ['contact', 'email', 'phone', 'reach', 'number'],
            response: "You can email us at hello@danizta.com or call +1 (555) 123-4567. Alternatively, feel free to use the contact form below!"
        },
        {
            keywords: ['who', 'about', 'company', 'danizta'],
            response: "Danizta is a forward-thinking software engineering firm founded in 2024. We mission is to decode complexity and deliver seamless digital solutions."
        },
        {
            keywords: ['bye', 'goodbye', 'see you', 'later'],
            response: "Goodbye! Feel free to return if you have more questions. Have a great day!"
        }
    ];

    function getBotResponse(input) {
        const lowerInput = input.toLowerCase();

        // 1. Check for specific context handlers (like name)
        for (const topic of knowledgeBase) {
            if (topic.matchFunction) {
                const result = topic.matchFunction(lowerInput);
                if (result) return addMessage(result, false);
            }
        }

        // 2. Keyword matching
        for (const topic of knowledgeBase) {
            if (topic.keywords && topic.keywords.some(keyword => lowerInput.includes(keyword))) {
                const response = typeof topic.response === 'function' ? topic.response() : topic.response;
                return addMessage(response, false);
            }
        }

        // 3. Fallback
        const fallbacks = [
            "I'm not sure I quite understand. Could you verify if you're asking about our Services, Pricing, or Contact info?",
            "That's interesting, but I don't have information on that specific topic yet. Would you like to connect with a human agent?",
            "I'm still learning! Try asking about 'AI Services', 'Mobile Apps', or our 'Tech Stack'."
        ];
        // Pick a random fallback
        const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        addMessage(randomFallback, false);
    }

    sendBtn.addEventListener('click', handleUserMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });

    if (chatInput) {
        chatInput.addEventListener('input', hideValidationMessage);
    }
});
