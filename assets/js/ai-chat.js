document.addEventListener('DOMContentLoaded', () => {
    // Елементи
    const chatBtn = document.getElementById('aiChatBtn');
    const chatWindow = document.getElementById('aiChatWindow');
    const closeBtn = document.getElementById('aiChatCloseBtn');
    const chatBody = document.getElementById('aiChatBody');
    const chatInput = document.getElementById('aiChatInput');
    const sendBtn = document.getElementById('aiChatSendBtn');

    // === НАЛАШТУВАННЯ ===
    const API_KEY = "AIzaSyCbdjoqBGCcbvOUboCTN6mzo9GwayjUUXY"; // Твій ключ

    // Актуальна модель на квітень 2026
    const MODEL_NAME = "gemini-2.5-flash";        // Рекомендую для чату (швидко + добре)
    // Альтернативи:
    // const MODEL_NAME = "gemini-2.5-pro";       // потужніша, але дорожча
    // const MODEL_NAME = "gemini-2.5-flash-lite"; // найдешевша для великих обсягів

    const API_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    let isSending = false; // Захист від подвійних запитів

    // Логіка відкриття/закриття
    if (chatBtn) {
        chatBtn.onclick = () => {
            chatWindow.classList.toggle('show');
            chatInput?.focus();
            console.log("Відкриття вікна Dentica AI...");
        };
    }
    

    closeBtn?.addEventListener('click', () => {
        chatWindow.classList.remove('show');
    });


    document.addEventListener('keydown', (e) => {
        // Перевіряємо, чи натиснуто Esc і чи чат наразі відкритий
        if (e.key === 'Escape' && chatWindow.classList.contains('show')) {
            chatWindow.classList.remove('show');
        }
    });

    // 2. Закриття при кліці поза вікном чату
    document.addEventListener('click', (e) => {
        // Перевіряємо, чи чат відкритий
        if (chatWindow.classList.contains('show')) {
            // Перевіряємо, чи клік відбувся НЕ по самому вікну чату 
            // та НЕ по кнопці його відкриття
            if (!chatWindow.contains(e.target) && !chatBtn.contains(e.target)) {
                chatWindow.classList.remove('show');
            }
        }
    });

    // Функція відправки повідомлення
    async function handleSendMessage() {
        if (isSending) return;
        const message = chatInput.value.trim();
        if (!message) return;

        isSending = true;
        sendBtn.disabled = true;

        // Додаємо повідомлення користувача
        addMessage('user', message);
        chatInput.value = '';
        showTypingIndicator();

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `${DENTICA_CONTEXT || ''}\n\nКористувач: ${message}`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1000,
                    }
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("API Error:", data);
                let errorMsg = data.error?.message || "Помилка сервера";

                if (data.error?.code === 404) {
                    errorMsg = `Модель ${MODEL_NAME} не знайдена. Спробуй іншу модель (наприклад gemini-2.5-flash).`;
                }

                throw new Error(errorMsg);
            }

            // Отримуємо текст відповіді
            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text 
                || "Вибачте, не вдалося згенерувати відповідь.";

            removeTypingIndicator();
            addMessage('bot', aiText);

        } catch (error) {
            console.error("Chat Error:", error);
            removeTypingIndicator();
            addMessage('bot', "Вибачте, сталася помилка при обробці запиту. Спробуйте ще раз.");
        } finally {
            isSending = false;
            sendBtn.disabled = false;
            chatInput.focus();
        }
    }

    // Рендер повідомлень
    function addMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${sender}-msg`;
        msgDiv.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'chat-msg bot-msg typing-indicator';
        indicator.id = 'temp-typing';
        indicator.innerHTML = `<span></span><span></span><span></span>`;
        chatBody.appendChild(indicator);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function removeTypingIndicator() {
        document.getElementById('temp-typing')?.remove();
    }

    // Слухачі подій
    sendBtn?.addEventListener('click', handleSendMessage);
    chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    // Додатковий дебаг: вивести доступні моделі в консоль
    console.log(`Dentica AI запущено з моделлю: ${MODEL_NAME}`);
});
