// messages at replies na naka-save sa browser
const messagesStorageKey = "hanaphire-messages-v1";

const conversationList = document.getElementById("conversation-list");
const searchMessages = document.getElementById("message-search");
const mailboxTitle = document.getElementById("mailbox-title");
const chatPlaceholder = document.getElementById("chat-placeholder");
const chatContent = document.getElementById("chat-content");
const chatMessages = document.getElementById("chat-messages");
const replyForm = document.getElementById("message-form");
const replyInput = document.getElementById("message-reply");
const replyCount = document.getElementById("reply-count");
const messagesFeedback = document.getElementById("messages-feedback");

// job seeker ang default; employer kapag may role sa link
const pageRole = new URLSearchParams(window.location.search).get("role");

const currentUser = pageRole === "employer"
    ? "technova"
    : "ryzza";

let selectedConversation = null;
let activeFolder = "inbox";
const replyDrafts = {};

// sample conversations para may mabuksan agad
const createStartingConversations = () => {
    const companies = [
        {
            id: "technova",
            name: "TechNova Solutions",
            subject: "Software Engineer application",
            text: "Hi Ryzza! Thank you for your application. Are you available for an interview this week?"
        },
        {
            id: "digitalworks",
            name: "DigitalWorks PH",
            subject: "Front-End Developer opportunity",
            text: "Hello Ryzza! We would like to learn more about your front-end experience. Could you share your portfolio?"
        },
        {
            id: "cloudcore",
            name: "CloudCore Technologies",
            subject: "Full Stack Developer opportunity",
            text: "Hi Ryzza! We have an opening that may match your skills. Let us know if you are interested."
        }
    ];

    return companies.map((company, index) => {
        return {
            id: company.id,
            employer: {
                id: company.id,
                name: company.name
            },
            seeker: {
                id: "ryzza",
                name: "Ryzza Mae Dizon"
            },
            subject: company.subject,
            messages: [
                {
                    sender: company.id,
                    text: company.text,
                    date: new Date(
                        Date.now() - index * 86400000
                    ).toISOString(),
                    readBy: [company.id]
                }
            ]
        };
    });
};

let conversations = createStartingConversations();

// basahin ang dating conversations kung meron
try {
    const stored = JSON.parse(
        localStorage.getItem(messagesStorageKey)
    );

    if (Array.isArray(stored)) {
        conversations = stored;
    }
} catch {
    messagesFeedback.textContent =
        "Saved messages could not be loaded. Starting conversations are shown.";
}

// i-save muna bago baguhin ang nasa page
const saveConversations = (updated) => {
    try {
        localStorage.setItem(
            messagesStorageKey,
            JSON.stringify(updated)
        );

        conversations = updated;
        return true;
    } catch {
        messagesFeedback.textContent =
            "Your browser could not save this change. Your reply has not been cleared.";

        return false;
    }
};

// employer at job seeker lang ng conversation ang kasama
const userConversations = () => {
    return conversations.filter((conversation) => {
        return conversation.employer.id === currentUser
            || conversation.seeker.id === currentUser;
    });
};

// pangalan ng kausap
const otherPerson = (conversation) => {
    return conversation.employer.id === currentUser
        ? conversation.seeker
        : conversation.employer;
};

// check kung may hindi pa nababasang incoming message
const hasUnread = (conversation) => {
    return conversation.messages.some((message) => {
        return message.sender !== currentUser
            && !message.readBy.includes(currentUser);
    });
};

const formatMessageDate = (value) => {
    return new Date(value).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });
};

// update ang character counter
const updateReplyCount = () => {
    replyCount.textContent =
        `${replyInput.value.length} / ${replyInput.maxLength}`;
};

// ipakita ang selected conversation
const renderConversation = () => {
    const conversation = userConversations().find(
        (item) => item.id === selectedConversation
    );

    chatPlaceholder.hidden = Boolean(conversation);
    chatContent.hidden = !conversation;

    if (!conversation) {
        return;
    }

    const person = otherPerson(conversation);

    document.getElementById("chat-name").textContent = person.name;
    document.getElementById("chat-subject").textContent =
        conversation.subject;

    document.getElementById("chat-avatar").textContent = person.name
        .split(" ")
        .slice(0, 2)
        .map((word) => word[0])
        .join("");

    chatMessages.replaceChildren();

    conversation.messages.forEach((message) => {
        const bubble = document.createElement("div");
        const text = document.createElement("p");
        const time = document.createElement("time");

        bubble.className = "chat-message";

        if (message.sender === currentUser) {
            bubble.classList.add("outgoing");
        }

        text.textContent = message.text;
        time.dateTime = message.date;
        time.textContent = formatMessageDate(message.date);

        bubble.append(text, time);
        chatMessages.appendChild(bubble);
    });

    replyInput.value = replyDrafts[conversation.id] || "";
    replyInput.setCustomValidity("");
    updateReplyCount();

    chatMessages.scrollTop = chatMessages.scrollHeight;
};

// ipakita ang listahan ayon sa folder at search
const renderConversationList = () => {
    const keyword = searchMessages.value.trim().toLowerCase();
    const available = userConversations();

    document.getElementById("inbox-count").textContent =
        available.filter((conversation) => {
            return conversation.messages.some(
                (message) => message.sender !== currentUser
            );
        }).length;

    document.getElementById("unread-count").textContent =
        available.filter(hasUnread).length;

    const matching = available.filter((conversation) => {
        const incoming = conversation.messages.some(
            (message) => message.sender !== currentUser
        );

        const sent = conversation.messages.some(
            (message) => message.sender === currentUser
        );

        const matchesFolder = activeFolder === "unread"
            ? hasUnread(conversation)
            : activeFolder === "sent"
                ? sent
                : incoming;

        const text = [
            otherPerson(conversation).name,
            conversation.subject,
            ...conversation.messages.map((message) => message.text)
        ].join(" ").toLowerCase();

        return matchesFolder && text.includes(keyword);
    });

    matching.sort((first, second) => {
        const firstDate = first.messages[first.messages.length - 1].date;
        const secondDate = second.messages[second.messages.length - 1].date;

        return new Date(secondDate) - new Date(firstDate);
    });

    conversationList.replaceChildren();

    if (matching.length === 0) {
        const empty = document.createElement("p");
        empty.className = "messages-list-empty";

        empty.textContent = keyword
            ? "No conversations match your search."
            : activeFolder === "unread"
                ? "You're all caught up. No unread messages."
                : activeFolder === "sent"
                    ? "You haven't sent any messages yet."
                    : "No inbox messages.";

        conversationList.appendChild(empty);
        return;
    }

    matching.forEach((conversation) => {
        const button = document.createElement("button");
        const name = document.createElement("strong");
        const preview = document.createElement("span");
        const date = document.createElement("time");

        const lastMessage =
            conversation.messages[conversation.messages.length - 1];

        button.type = "button";
        button.className = "conversation-button";

        button.classList.toggle(
            "selected",
            conversation.id === selectedConversation
        );

        button.classList.toggle("unread", hasUnread(conversation));

        button.setAttribute(
            "aria-pressed",
            String(conversation.id === selectedConversation)
        );

        const person = otherPerson(conversation);
        name.textContent = person.name;

        button.setAttribute(
            "aria-label",
            `${person.name}: ${conversation.subject}`
            + (hasUnread(conversation) ? ", unread messages" : "")
        );

        preview.className = "conversation-preview";
        preview.textContent = lastMessage.sender === currentUser
            ? `You: ${lastMessage.text}`
            : lastMessage.text;

        date.className = "conversation-date";
        date.dateTime = lastMessage.date;
        date.textContent = formatMessageDate(lastMessage.date);

        button.append(name, preview, date);

        button.addEventListener("click", () => {
            selectedConversation = conversation.id;
            messagesFeedback.textContent = "";

            // mark as read kapag binuksan ang conversation
            const updated = conversations.map((item) => {
                if (item.id !== conversation.id) {
                    return item;
                }

                return {
                    ...item,
                    messages: item.messages.map((message) => {
                        return {
                            ...message,
                            readBy: message.readBy.includes(currentUser)
                                ? message.readBy
                                : [...message.readBy, currentUser]
                        };
                    })
                };
            });

            if (hasUnread(conversation)) {
                saveConversations(updated);
            }

            renderConversationList();
            renderConversation();
            replyInput.focus();
        });

        conversationList.appendChild(button);
    });
};

// palitan ang folder
document.querySelectorAll(".message-folder").forEach((button) => {
    button.addEventListener("click", () => {
        activeFolder = button.dataset.folder;

        mailboxTitle.textContent = {
            inbox: "Inbox",
            unread: "Unread",
            sent: "Sent"
        }[activeFolder];

        document.querySelectorAll(".message-folder").forEach((folder) => {
            const active = folder === button;

            folder.classList.toggle("active", active);
            folder.setAttribute("aria-pressed", String(active));
        });

        renderConversationList();
    });
});

searchMessages.addEventListener("input", renderConversationList);

// itabi muna ang draft habang nagpapalit ng conversation
replyInput.addEventListener("input", () => {
    if (selectedConversation) {
        replyDrafts[selectedConversation] = replyInput.value;
    }

    replyInput.setCustomValidity(
        replyInput.value.trim() ? "" : "Please enter a message."
    );

    updateReplyCount();
});

// idagdag ang reply sa selected conversation
replyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    replyInput.setCustomValidity(
        replyInput.value.trim() ? "" : "Please enter a message."
    );

    if (!replyForm.reportValidity() || !selectedConversation) {
        return;
    }

    const reply = {
        sender: currentUser,
        text: replyInput.value.trim(),
        date: new Date().toISOString(),
        readBy: [currentUser]
    };

    const updated = conversations.map((conversation) => {
        if (conversation.id !== selectedConversation) {
            return conversation;
        }

        return {
            ...conversation,
            messages: [...conversation.messages, reply]
        };
    });

    if (!saveConversations(updated)) {
        return;
    }

    replyDrafts[selectedConversation] = "";
    messagesFeedback.textContent = "Message added to the conversation.";

    renderConversationList();
    renderConversation();
    replyInput.focus();
});

// ayusin ang navigation kapag employer ang gumagamit
if (currentUser === "technova") {
    document.querySelector(".messages-account").textContent =
        "Employer Inbox";

    const navigation = document.querySelector(".jobseeker-nav");
    navigation.replaceChildren();

    const links = [
        ["Dashboard", "employerDashboard.html"],
        ["Find Talent", "findJobs.html"],
        ["Post a Job", "postJob.html"],
        ["Applicants", "manageApplicants.html"],
        ["Manage Jobs", "manageJobs.html"],
        ["Company", "companyProfile.html"],
        ["Messages", "messages.html?role=employer"]
    ];

    links.forEach(([label, url]) => {
        const link = document.createElement("a");

        link.href = url;
        link.textContent = label;

        if (label === "Messages") {
            link.className = "active";
            link.setAttribute("aria-current", "page");
        }

        navigation.appendChild(link);
    });

    const logo = document.querySelector(".jobseeker-header .logo");

    if (logo) {
        logo.href = "employerDashboard.html";
    }

    document.querySelector(".jobseeker-profile-name strong").textContent =
        "TechNova Solutions";

    document.querySelector(".jobseeker-profile-name span").textContent =
        "Employer";

    const avatar = document.querySelector(".jobseeker-picture img");
    avatar.src = "asset/images/company/technova.png";
    avatar.alt = "TechNova Solutions";
}

// unang display ng inbox
renderConversationList();
renderConversation();