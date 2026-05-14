document.addEventListener('DOMContentLoaded', () => {
    
    const chatBtn = document.getElementById('aiChatBtn');
    const chatWindow = document.getElementById('aiChatWindow');
    const closeBtn = document.getElementById('aiChatCloseBtn');
    const chatBody = document.getElementById('aiChatBody');
    const chatInput = document.getElementById('aiChatInput');
    const sendBtn = document.getElementById('aiChatSendBtn');

    
    
    const API_URL = "/api/chat";



    let isSending = false; 

    
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
        
        if (e.key === 'Escape' && chatWindow.classList.contains('show')) {
            chatWindow.classList.remove('show');
        }
    });

    
    document.addEventListener('click', (e) => {
        
        if (chatWindow.classList.contains('show')) {
            
            
            if (!chatWindow.contains(e.target) && !chatBtn.contains(e.target)) {
                chatWindow.classList.remove('show');
            }
        }
    });

    
    async function handleSendMessage() {
        if (isSending) return;
        const message = chatInput.value.trim();
        if (!message) return;

        isSending = true;
        sendBtn.disabled = true;

        
        addMessage('user', message);
        chatInput.value = '';
        showTypingIndicator();

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: message,
                    context: typeof DENTICA_CONTEXT !== 'undefined' ? DENTICA_CONTEXT : ''
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("API Error:", data);
                let errorMsg = data.error?.message || "Помилка сервера";
                throw new Error(errorMsg);
            }

            
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

    
    sendBtn?.addEventListener('click', handleSendMessage);
    chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    
    console.log(`Dentica AI підключено до бекенду.`);
});
