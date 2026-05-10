document.addEventListener('DOMContentLoaded', () => {
    // Елементи
    const chatBtn = document.getElementById('aiChatBtn');
    const chatWindow = document.getElementById('aiChatWindow');
    const closeBtn = document.getElementById('aiChatCloseBtn');
    const chatBody = document.getElementById('aiChatBody');
    const chatInput = document.getElementById('aiChatInput');
    const sendBtn = document.getElementById('aiChatSendBtn');

    // === НАЛАШТУВАННЯ ===
    // Конфігурація тепер винесена на сервер (/api/chat) для безпеки та стабільності


    let isSending = false; // Захист від подвійних запитів

    // Логіка відкриття/закриття
    if (chatBtn) {
        chatBtn.onclick = () => {
            chatWindow.classList.toggle('show');
            document.body.classList.toggle('chat-open');
            chatInput?.focus();
            console.log("Відкриття вікна Dentica AI...");
        };
    }
    

    closeBtn?.addEventListener('click', () => {
        chatWindow.classList.remove('show');
        document.body.classList.remove('chat-open');
    });


    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && chatWindow.classList.contains('show')) {
            chatWindow.classList.remove('show');
            document.body.classList.remove('chat-open');
        }
    });

    // 2. Закриття при кліці поза вікном чату
    document.addEventListener('click', (e) => {
        if (chatWindow.classList.contains('show')) {
            if (!chatWindow.contains(e.target) && !chatBtn.contains(e.target)) {
                chatWindow.classList.remove('show');
                document.body.classList.remove('chat-open');
            }
        }
    });

    // Функція відправки повідомлення (Стрімінг через /api/chat)
    async function handleSendMessage() {
        if (isSending) return;
        const message = chatInput.value.trim();
        if (!message) return;

        isSending = true;
        sendBtn.disabled = true;

        addMessage('user', message);
        chatInput.value = '';
        
        // Створюємо порожнє повідомлення для бота, яке будемо наповнювати
        const botMsgDiv = document.createElement('div');
        botMsgDiv.className = 'chat-msg bot-msg';
        const botTextP = document.createElement('p');
        botMsgDiv.appendChild(botTextP);
        chatBody.appendChild(botMsgDiv);
        
        showTypingIndicator();

        try {
            const response = await fetch('/api/chat', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Помилка сервера');
            }

            removeTypingIndicator();
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let aiResponse = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                
                // Парсимо SSE формат (Gemini повертає блоки "data: {...}")
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const json = JSON.parse(line.substring(6));
                            const textChunk = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
                            aiResponse += textChunk;
                            botTextP.innerHTML = aiResponse.replace(/\n/g, '<br>');
                            chatBody.scrollTop = chatBody.scrollHeight;
                        } catch (e) {
                            // Пропускаємо неповні JSON чанки
                        }
                    }
                }
            }

        } catch (error) {
            console.error("Chat Error:", error);
            removeTypingIndicator();
            botTextP.innerText = `Помилка: ${error.message}. Спробуйте пізніше.`;
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
