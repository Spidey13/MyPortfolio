# PostHog Analytics Dashboard Guide

Your PostHog dashboard captures both **Frontend Events** (user clicks, page views) and **Backend AI Logs** (actual queries, agent decisions).

## 1. How to View AI Chat Logs

To see exactly what users are saying to your AI and how it responds:

1.  Go to the **Activity** or **Events** tab in the left sidebar (looks like a clock icon)
2.  In the search/filter bar, type: `ai_query`
3.  Click on any event row to expand it. You will see:
    *   **query**: The exact text the user sent
    *   **agent**: Which AI agent handled it (e.g., `Profile Agent`, `Project Agent`)
    *   **response_time_ms**: How long it took to generate the reply
    *   **cached**: Whether it was a fresh generation or cache hit

## 2. Tracking Errors

To see if the AI is failing:

1.  Filter for event: `error`
2.  Expand to see the `error_message` property
3.  Common issues will appear here (e.g., timeouts, API key errors)

## 3. Creating a Simple Insight

To visualize usage trends:

1.  Click **New Insight** (top right)
2.  Select **Trends**
3.  Under "Series", select event: `ai_query`
4.  This will show you a graph of how many AI chats are happening over time.

## 4. Debugging in Real-time

1.  Open your app in one window
2.  Open PostHog **Live Events** (or "Activity" -> "Live") in another
3.  Send a message in your portfolio chat
4.  You should see the events appear instantly:
    *   `chat_message_sent` (Frontend)
    *   `ai_query` (Backend)
    *   `chat_response_received` (Frontend)

*(Note: We just fixed a bug where backend logs were being cut off prematurely, so you should see much more reliable data now!)*
