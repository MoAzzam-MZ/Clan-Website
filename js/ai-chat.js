/**
 * ============================================================================
 * ALEXANDERS AI CHAT WIDGET (Google Gemini Interactions API - v1beta)
 * ============================================================================
 * Features:
 * - Real factual community context compiled from all website pages
 * - One-time root context upload, cached in localStorage
 * - Verified alive via GET /v1beta/interactions/{id}
 * - Follow-up conversation turns chained via previous_interaction_id
 * - Bilingual response capability (Arabic & English) grounded strictly in facts
 */

// ============================================================================
// 1. CONFIGURATION & CONSTANTS
// ============================================================================
const PROXY_URL = "https://alexanders-ai-proxy.sci-mohamedelsayed32561.workers.dev".replace(/\/+$/, "");
let API_ENDPOINT = `${PROXY_URL}/v1beta/interactions`;
const MODEL_NAME = "gemini-3.5-flash-lite";
const CONTEXT_VERSION = "v7"; // Bumped to refresh the language instructions
const STORAGE_KEY = `sn_root_interaction_${CONTEXT_VERSION}`;

/**
 * ============================================================================
 * SOCIAL NETWORK CONTEXT (PLATFORM REFERENCE GUIDE)
 * ============================================================================
 * Comprehensive reference guide compiled directly from index.html, about.html,
 * story.html, and gallery.html.
 */
const SOCIAL_NETWORK_CONTEXT = `
# دليل مجتمع ألكساندرز الرسمي (ALEXANDERS Community Official Reference Guide)

## 1. نبذة عن المجتمع والرؤية (About & Identity)
- **الاسم**: ألكساندرز (ALEXANDERS / Alexander's Group).
- **الشعار التعريفي**: "عائلة طلابية بقلب واحد" | "نصنع المستقبل معًا" | "نبني المستقبل معًا".
- **الرسالة والوصف**: مجتمع ثقافي وطلابي إسكندراني رائد مبني بالطاقة والعزيمة، يجمع بين روح الفن الكلاسيكي والإبداع التكنولوجي تحت مظلة واحدة (نُلهم، نُعلّم، ونبني الجيل القادم من المبدعين). نؤمن أن العقول العربية قادرة على صناعة فرق حقيقي، ونعمل كل يوم لتمكينها بالأدوات والفرص والمعرفة.
- **تاريخ التأسيس**: تأسس عام 2024 بالإسكندرية (Est. 2024).
- **الشركاء والرعاة الرسميون (Official Partners)**: جامعة الإسكندرية (Alexandria University)، إدارة الأسر والاتحادات الطلابية، والتعاون مع جهات دولية مثل منظمة اليونسكو (UNESCO).
- **المؤسس والإدارة**: مينا عماد (Mina Emad) - المؤسس ومصمم الهوية ومجلس الإدارة ("Designed by Mina Emad").

## 2. إحصائيات وأرقام الكيان (Key Community Stats)
- **+500** عضو متطوع ونشط.
- **+30** نشاط وفعالية تم تنظيمها.
- **7** لجان بالمجتمع (بينها 6 لجان رئيسية ولجنة أكاديمية).
- **+3** سنوات من العطاء والأثر المتواصل.

## 3. قيادة اللجان وفريق الإدارة (Leadership & Committee Heads)
- **رئيس لجنة الفعاليات**: نور الدين.
- **رئيس اللجنة الإعلامية**: كريم عماد.
- **رئيس لجنة التصميم**: ليلى حسن.
- **رئيس اللجنة الأكاديمية**: سارة فؤاد.

## 4. اللجان الست الرئيسية وتخصصاتها (The 6 Core Committees)
1. **لجنة الإعلام (01 - Media Committee)**:
   - مسؤولة عن التصوير، المونتاج الإبداعي، وتوثيق الفعاليات لحظة بلحظة بشكل ملهم، مع إبراز صوت المجتمع وصناعة القصص الملهمة.
2. **العلاقات العامة (02 - Public Relations Committee)**:
   - بناء جسور التواصل والتعاون الفعّال مع الكليات والجهات والاتحادات الطلابية والشركاء لتعزيز صورة الكيان.
3. **لجنة البرمجة (03 - Tech & Software Committee)**:
   - قلب الحلول الرقمية؛ مسؤولة عن ابتكار وتطوير المواقع والمنصات وتطبيقات الويب لمساعدة المجتمع وتطوير مهارات الأعضاء.
4. **لجنة التصميم (04 - Design & Creative Committee)**:
   - الإبداع البصري وتصميم الجرافيك، وصناعة الهوية البصرية ومحتوى السوشيال ميديا الإبداعي المعبر عن الفريق.
5. **لجنة الفعاليات (05 - Events & Logistics Committee)**:
   - التخطيط والتنظيم والإدارة الميدانية لجميع الأحداث، الحفلات، الرحلات والمسابقات في أجواء مفعمة بالطاقة والمرح.
6. **لجنة التسويق (06 - Marketing Committee)**:
   - الترويج والتسويق الرقمي، بناء حضور قوي على مختلف منصات التواصل الاجتماعي، وجذب الجمهور المستهدف.

## 5. ما يقدمه المجتمع (What We Offer)
- **أنشطة تطوعية**: مبادرات إنسانية وأيام ميدانية لخدمة المجتمع، وتنمية المسؤولية المجتمعية وبناء الشخصية.
- **فعاليات وحفلات**: رحلات، مسابقات، وحفلات تخرج ولقاءات تعارف تجمع الأعضاء في أجواء حيوية.
- **ورش ودورات**: ورش عمل لتطوير المهارات الشخصية والتقنية والأكاديمية لتأهيل الطلاب لسوق العمل.

## 6. أبرز الأنشطة والفعاليات المنفذة (Key Events & Activities)
- **دوري العقول الخضراء (Green Minds League - نشاط تطوعي)**: شارك الكيان بمنافسة مع 16 فريقًا وحصل على المركز الثاني.
- **برنامج بناء قدرات الشباب في الوطن العربي (حملة)**: سلسلة تدريبية شبابية نحو مستقبل أكثر استدامة.
- **رحلة الكوميونيتي السنوية (رحلة)**: رحلة سنوية ترفيهية للأعضاء لترسيخ روح العائلة والتواصل.
- **تنظيم فعاليات اليوم العالمي للبيئة (ورشة عمل)**: حدث بيئي رسمي أقيم تحت رعاية منظمة اليونسكو وإدارة الأسر.
- **رحلة لمعسكر بجوش (حفل ورحلة قيادية)**: معسكر طلابي أقيم تحت إشراف ورعاية أ.د. عبد العزيز قنصوة رئيس جامعة الإسكندرية.
- **تطوير المهارات التقنية لسوق العمل (توعية)**: مبادرة بالتعاون مع أكبر المؤسسات التقنية، تشمل التوعية الصحية والنصائح الطبية.

## 7. قصة ومسيرة ألكساندرز (The Story & Journey - 7 Milestones)
1. **البداية**: انطلاقة صغيرة بفكرة كبيرة تجمع الشغوفين في مساحة واحدة ليتعلموا فيها ويكبروا معًا.
2. **أول لقاء**: من أول تجمع بدأ بناء روح الفريق وتحويل الحماس إلى خطوات عملية منظمة على أرض الواقع.
3. **مرحلة النمو**: توسعت الأنشطة وتنوعت المسارات، وأصبح لكل عضو مساحة واضحة للتأثير والمساهمة.
4. **اليوم والرؤية**: استمرار بثقة أكبر لبناء مجتمع ملهم يُخرّج نماذج تقود مستقبلاً أفضل.
5. **إنجازات على الأرض**: تحويل الأفكار إلى مبادرات حقيقية أثرت في الطلاب والمجتمع بأنشطة متنوعة ومستدامة.
6. **أثر ممتد**: بناء أثر عميق يخلق فرصًا متجددة للتعلم، التطوع، والقيادة.
7. **المستقبل يبدأ الآن**: التوسع المستمر، رعاية المواهب، وصناعة تجارب أقوى لكل عضو جديد.

## 8. معرض المبدعين (Gallery Page)
- صفحة المعرض مخصصة لاستعراض الأعمال الإبداعية لأعضاء ALEXANDERS (تصاميم فنية، مشاريع برمجية، وفيديوهات ملهمة - جاري العمل عليها وستظهر قريباً).

## 9. الانضمام والتواصل (Join & Official Channels)
- **الانضمام إلى الكيان**: متاح عبر الضغط على أزرار "انضم إلينا" أو "يلا انضم لـ العيلة" في صفحات الموقع.
- **صفحات الموقع**:
  - الرئيسية: index.html
  - من نحن: about.html
  - قصتنا: story.html
  - المعرض: gallery.html
- **روابط التواصل الاجتماعي الرسمية**:
  - YouTube: https://www.youtube.com/@alexandersgroup
  - LinkedIn: https://www.linkedin.com/company/alexanders-group/posts/
  - Facebook: https://www.facebook.com/profile.php?id=61573564592001
  - TikTok: https://www.tiktok.com/@alexanders.groupp
`.trim();

// ============================================================================
// 2. STATE LOGIC & INTERACTION LIFECYCLE
// ============================================================================
let rootInteractionId = null;
let currentInteractionId = null;
let isInitializingContext = false;
let isSendingMessage = false;

/**
 * Builds the canonical GET URL for verifying an interaction ID through the proxy.
 */
function buildInteractionUrl(id) {
  if (!id) return API_ENDPOINT;
  if (API_ENDPOINT.endsWith("/v1beta/interactions")) {
    return id.startsWith("interactions/")
      ? `${PROXY_URL}/v1beta/${id}`
      : `${API_ENDPOINT}/${encodeURIComponent(id)}`;
  }
  return id.startsWith("interactions/")
    ? `${PROXY_URL}/${id}`
    : `${PROXY_URL}/${encodeURIComponent(id)}`;
}

/**
 * Helper to perform fetch with automatic retry on HTTP 503 (high demand) or 429 (rate limit).
 * Automatically retries with a 1.5-second delay whenever the Gemini API returns HTTP 503 or 429.
 */
async function fetchWithRetry(url, options, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      if ((response.status === 503 || response.status === 429) && attempt < retries) {
        console.warn(`[Alexanders AI] Received HTTP ${response.status} from Gemini API. Retrying in 1.5s (attempt ${attempt + 1}/${retries})...`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        continue;
      }
      return response;
    } catch (err) {
      if (attempt < retries) {
        console.warn(`[Alexanders AI] Network error during fetch. Retrying in 1.5s (attempt ${attempt + 1}/${retries}):`, err);
        await new Promise(resolve => setTimeout(resolve, 1500));
        continue;
      }
      throw err;
    }
  }
}

/**
 * Ensures that a valid root interaction seeded with SOCIAL_NETWORK_CONTEXT exists.
 * Lifecycle:
 * 1. Checks localStorage for sn_root_interaction_${CONTEXT_VERSION}.
 * 2. If present, calls GET /v1beta/interactions/{id} to verify it is alive on Google's servers.
 * 3. If alive (200 OK), reuses it as rootInteractionId without uploading anything.
 * 4. If missing, expired, or invalid, performs a single POST to seed the context once.
 */
async function ensureContextExists() {
  if (rootInteractionId) {
    if (!currentInteractionId) currentInteractionId = rootInteractionId;
    return rootInteractionId;
  }

  if (isInitializingContext) {
    // Wait for in-flight initialization
    while (isInitializingContext) {
      await new Promise(r => setTimeout(r, 100));
    }
    if (rootInteractionId) return rootInteractionId;
  }

  isInitializingContext = true;

  try {
    const cachedId = localStorage.getItem(STORAGE_KEY);

    if (cachedId) {
      // Step 1: Verify the interaction is still alive on Google's servers
      const getUrl = buildInteractionUrl(cachedId);

      try {
        const verifyRes = await fetchWithRetry(getUrl, {
          method: "GET",
          headers: {}
        });

        if (verifyRes.ok) {
          const verifyData = await verifyRes.json();
          const verifiedId = verifyData.id || cachedId;
          rootInteractionId = verifiedId;
          if (!currentInteractionId) currentInteractionId = verifiedId;
          isInitializingContext = false;
          return rootInteractionId;
        } else {
          console.warn(`[Alexanders AI] Cached interaction expired or unavailable (status ${verifyRes.status}). Clearing cache and re-seeding...`);
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (checkErr) {
        console.warn("[Alexanders AI] Error verifying cached interaction, will attempt fresh seed:", checkErr);
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    // Step 2: One-time seed upload with strict instructions
    console.log("[Alexanders AI] Performing one-time context seed upload to v1beta...");
    const seedInput = `
You are the official conversational AI assistant for "ALEXANDERS" (مجتمع ألكساندرز).
You have been provided with the official comprehensive platform reference guide extracted directly from the website.

MANDATORY INSTRUCTIONS:
1. Language: Answer in the EXACT SAME language the user writes to you. If the user writes in Arabic, reply purely in natural, articulate Arabic. If the user writes in English, reply purely in English with no Arabic script mixed into English sentences; translate Arabic slogans or titles into English when needed. Never mix scripts within a reply.
2. Tone & Personality: Be warm, enthusiastic, polite, and helpful, reflecting the welcoming spirit of our student family ("عائلة طلابية بقلب واحد").
3. Accuracy & Grounding: Base all your responses strictly and exclusively on the facts, numbers, committee leaders, events, achievements, and links listed in the Platform Reference Guide below. Do not fabricate facts.
4. Missing Information: If the user asks about something not mentioned in the guide (such as personal phone numbers, prices, or unlisted events), politely explain that this specific information is not currently mentioned on the website, and encourage them to connect with the team via our official social links or through the "انضم إلينا" section.
5. Confirmation: Acknowledge memorization of this guide by replying strictly with "READY.".

================================================================================
ALEXANDERS PLATFORM REFERENCE GUIDE
================================================================================
${SOCIAL_NETWORK_CONTEXT}
`.trim();

    const seedPayload = {
      model: MODEL_NAME,
      input: seedInput,
      generation_config: {
        thinking_level: "minimal"
      }
    };

    let seedResponse = await fetchWithRetry(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(seedPayload)
    });

    if (!seedResponse.ok) {
      const errText = await seedResponse.text();
      console.error(`[Alexanders AI] Context seed failed (HTTP ${seedResponse.status}):`, errText);
      throw new Error(`Context seed upload failed (HTTP ${seedResponse.status}): ${errText}`);
    }

    const seedData = await seedResponse.json();
    const newId = seedData.id;

    if (!newId) {
      throw new Error("API did not return a valid interaction ID during context seed.");
    }

    console.log("[Alexanders AI] Context seeded successfully. Root interaction ID:", newId);
    localStorage.setItem(STORAGE_KEY, newId);
    rootInteractionId = newId;
    currentInteractionId = newId;
    return rootInteractionId;
  } finally {
    isInitializingContext = false;
  }
}

/**
 * Extracts plain text cleanly from the Gemini Interactions API JSON response.
 * Handles the current REST schema (data.steps -> step.content[].text) as well as
 * direct output_text and legacy fallbacks.
 */
function extractReplyText(data) {
  if (!data) return "";
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }
  if (typeof data.text === "string" && data.text.trim()) {
    return data.text.trim();
  }

  // Current Interactions API REST schema: data.steps -> step.type === "model_output" -> step.content[] -> block.text
  if (Array.isArray(data.steps)) {
    const texts = [];
    for (const step of data.steps) {
      if (step.type === "thought") continue;
      if (typeof step.text === "string") texts.push(step.text);
      if (typeof step.content === "string") texts.push(step.content);
      if (Array.isArray(step.content)) {
        for (const block of step.content) {
          if (block && block.type === "text" && typeof block.text === "string") {
            texts.push(block.text);
          } else if (block && typeof block.text === "string") {
            texts.push(block.text);
          }
        }
      }
    }
    if (texts.join("").trim()) return texts.join("\n").trim();
  }

  // Legacy fallback
  if (Array.isArray(data.outputs)) {
    const legacy = data.outputs
      .filter((o) => o && o.type !== "thought")
      .map((o) => o.text || (Array.isArray(o.content) ? o.content.map((c) => c.text || "").join("") : ""))
      .join("\n")
      .trim();
    if (legacy) return legacy;
  }

  console.warn("[Alexanders AI] Unrecognized response format:", JSON.stringify(data, null, 2));
  return "";
}

/**
 * Sends a user message chained to currentInteractionId without re-uploading context.
 * Uses standard JSON POST with fast minimal thinking (under 1s responses).
 */
async function sendUserMessage(userText) {
  if (!userText || !userText.trim()) return;
  const cleanText = userText.trim();

  if (isSendingMessage) return;
  isSendingMessage = true;

  // Render user message bubble immediately
  appendMessage("user", cleanText);
  showTypingIndicator();

  try {
    // 1. Ensure root context is alive
    await ensureContextExists();

    // 2. Send user message chained to previous_interaction_id with minimal thinking
    const payload = {
      model: MODEL_NAME,
      input: cleanText,
      previous_interaction_id: currentInteractionId,
      generation_config: {
        thinking_level: "minimal"
      }
    };

    const res = await fetchWithRetry(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    hideTypingIndicator();

    if (!res.ok) {
      const errDetails = await res.text();
      console.error(`[Alexanders AI] Request failed (HTTP ${res.status}):`, errDetails);

      let errorMsg = `خطأ في الخادم (HTTP ${res.status})`;
      try {
        const parsed = JSON.parse(errDetails);
        if (parsed.error?.message) {
          errorMsg += `: ${parsed.error.message}`;
        } else if (parsed.message) {
          errorMsg += `: ${parsed.message}`;
        }
      } catch (parseErr) {
        if (errDetails && errDetails.length < 200) {
          errorMsg += `: ${errDetails}`;
        }
      }

      if (res.status === 429) {
        errorMsg = "تم تجاوز حد الاستخدام المؤقت (HTTP 429 Rate Limit). يرجى الانتظار دقيقة والمحاولة مجددًا.";
      } else if (res.status === 503) {
        errorMsg = "الخدمة تواجه ضغطًا مرتفعًا مؤقتًا (HTTP 503 High Demand). يرجى المحاولة بعد لحظات.";
      }

      appendMessage("system-error", errorMsg);
      return;
    }

    const data = await res.json();
    
    // 3. Update current interaction ID to maintain conversation chain
    if (data.id) {
      currentInteractionId = data.id;
    }

    // 4. Extract and display reply
    const replyText = extractReplyText(data);
    if (replyText) {
      appendMessage("assistant", replyText);
    } else {
      appendMessage("assistant", "تم استلام رسالتك بنجاح ولكن لم يتم إرجاع نص إجابة.");
    }
  } catch (err) {
    hideTypingIndicator();
    console.error("[Alexanders AI] Error in sendUserMessage:", err.message || err);
    appendMessage(
      "system-error",
      `تعذر إرسال الرسالة (${err.message || "Network Error"}). يرجى التحقق من الاتصال والمحاولة لاحقًا.`
    );
  } finally {
    isSendingMessage = false;
  }
}

/**
 * Resets conversation state back to the root context interaction
 * without clearing or re-uploading the root context.
 */
function resetChatConversation() {
  if (rootInteractionId) {
    currentInteractionId = rootInteractionId;
  }
  const messagesContainer = document.getElementById("aiChatMessages");
  if (messagesContainer) {
    messagesContainer.innerHTML = "";
    // Re-insert initial welcome message
    appendMessage(
      "assistant",
      "أهلاً بك! تم إعادة ضبط المحادثة بنجاح 🔄\nأنا مساعد ألكساندرز الذكي، اسألني عن لجاننا، أنشطتنا، قيادة الفريق، أو كيفية الانضمام إلينا!"
    );
  }
}

// ============================================================================
// 3. UI RENDERING & DOM INJECTION
// ============================================================================
function injectChatWidgetDOM() {
  if (document.getElementById("aiChatWidget")) return;

  const widgetHTML = `
    <div id="aiChatWidget" class="ai-chat-widget">
      <!-- Chat Panel -->
      <div id="aiChatPanel" class="ai-chat-panel" role="dialog" aria-label="Alexanders AI Assistant">
        <!-- Header -->
        <div class="ai-chat-header">
          <div class="ai-chat-header-info">
            <div class="ai-chat-avatar">✦</div>
            <div class="ai-chat-title-group">
              <h3>مساعد ألكساندرز</h3>
              <div class="ai-chat-status">
                <span class="ai-chat-status-dot"></span>
                <span>متصل</span>
              </div>
            </div>
          </div>
          <div class="ai-chat-header-actions">
            <button id="aiChatResetBtn" class="ai-chat-btn-action" title="إعادة ضبط المحادثة">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="1 4 1 10 7 10"></polyline>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
              </svg>
              <span>إعادة تعيين</span>
            </button>
            <button id="aiChatCloseBtn" class="ai-chat-btn-close" aria-label="إغلاق المحادثة">✕</button>
          </div>
        </div>

        <!-- Messages Area -->
        <div id="aiChatMessages" class="ai-chat-messages">
          <div class="ai-message assistant">
            <div class="ai-message-content">مرحبًا بك في مجتمع ألكساندرز! 👋<br>أنا المساعد الذكي لمجتمعنا. اسألني عن فعالياتنا، لجان العمل، قيادتنا، أو كيفية الانضمام إلينا!</div>
          </div>
        </div>

        <!-- Input Bar -->
        <div class="ai-chat-input-bar">
          <form id="aiChatForm" class="ai-chat-input-wrapper">
            <input
              type="text"
              id="aiChatInput"
              class="ai-chat-input"
              placeholder="اكتب استفسارك هنا..."
              autocomplete="off"
            />
            <button type="submit" id="aiChatSendBtn" class="ai-chat-send-btn" aria-label="إرسال">
              <svg class="ai-chat-send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
          <div class="ai-chat-footer-note">
            <span>مساعد مجتمع ألكساندرز</span>
          </div>
        </div>
      </div>

      <!-- Floating Trigger Button -->
      <button id="aiChatToggleBtn" class="ai-chat-toggle-btn" aria-label="فتح المساعد الذكي">
        <span class="ai-chat-badge"></span>
        <svg class="ai-chat-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", widgetHTML);
  bindChatEvents();
}

/**
 * Appends a message bubble to the messages list and auto-scrolls down.
 */
function appendMessage(role, text) {
  const container = document.getElementById("aiChatMessages");
  if (!container) return null;

  const msgDiv = document.createElement("div");
  msgDiv.className = `ai-message ${role}`;

  const contentDiv = document.createElement("div");
  contentDiv.className = "ai-message-content";
  contentDiv.innerText = text;

  msgDiv.appendChild(contentDiv);
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
  return contentDiv;
}

/**
 * Displays bouncing typing indicator.
 */
function showTypingIndicator() {
  hideTypingIndicator();
  const container = document.getElementById("aiChatMessages");
  if (!container) return;

  const indicator = document.createElement("div");
  indicator.id = "aiTypingIndicator";
  indicator.className = "ai-typing-indicator";
  indicator.innerHTML = `
    <span class="ai-typing-dot"></span>
    <span class="ai-typing-dot"></span>
    <span class="ai-typing-dot"></span>
  `;

  container.appendChild(indicator);
  container.scrollTop = container.scrollHeight;
}

/**
 * Removes typing indicator.
 */
function hideTypingIndicator() {
  const indicator = document.getElementById("aiTypingIndicator");
  if (indicator) indicator.remove();
}

/**
 * Binds DOM event listeners for the widget.
 */
function bindChatEvents() {
  const widget = document.getElementById("aiChatWidget");
  const toggleBtn = document.getElementById("aiChatToggleBtn");
  const closeBtn = document.getElementById("aiChatCloseBtn");
  const resetBtn = document.getElementById("aiChatResetBtn");
  const form = document.getElementById("aiChatForm");
  const input = document.getElementById("aiChatInput");

  if (!widget || !toggleBtn) return;

  function toggleChat(forceOpen) {
    const isCurrentlyActive = widget.classList.contains("active");
    const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : !isCurrentlyActive;

    if (shouldOpen) {
      widget.classList.add("active");
      toggleBtn.classList.add("open");
      if (input) setTimeout(() => input.focus(), 250);
      // Lazily verify or seed context on first open in the background
      ensureContextExists().catch(err => {
        console.warn("[Alexanders AI] Background context pre-check error:", err);
      });
    } else {
      widget.classList.remove("active");
      toggleBtn.classList.remove("open");
    }
  }

  toggleBtn.addEventListener("click", () => toggleChat());
  if (closeBtn) closeBtn.addEventListener("click", () => toggleChat(false));
  if (resetBtn) resetBtn.addEventListener("click", () => resetChatConversation());

  if (form && input) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) return;
      input.value = "";
      sendUserMessage(val);
    });

    // Enter to send
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        form.dispatchEvent(new Event("submit"));
      }
    });
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", injectChatWidgetDOM);
} else {
  injectChatWidgetDOM();
}

// Pre-seed context quietly in the background 1 second after page load (idle)

if (document.readyState === "complete") {
  setTimeout(() => ensureContextExists().catch(() => {}), 1000);
} else {
  window.addEventListener("load", () => {
    setTimeout(() => ensureContextExists().catch(() => {}), 1000);
  });
}
